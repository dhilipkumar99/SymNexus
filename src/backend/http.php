<?php

declare(strict_types=1);

/**
 * Shared helpers for the JSON API endpoints (/api/chat, /api/contact):
 * responses, same-origin checks, client IP and best-effort rate limiting.
 */

function json_respond(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

/**
 * Only accept calls from our own pages. Browsers always send Origin on POST
 * requests (fetch and form submissions), so a missing Origin means a script.
 * Origin can be forged by non-browser clients — rate limits are the backstop,
 * and a Vercel Firewall rate-limit rule on /api/* is recommended in production.
 */
function request_is_same_origin(): bool
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') {
        return false;
    }
    $originHost = (string) parse_url($origin, PHP_URL_HOST);
    $originPort = parse_url($origin, PHP_URL_PORT);
    $authority  = $originHost . ($originPort !== null ? ':' . $originPort : '');
    $host       = $_SERVER['HTTP_X_FORWARDED_HOST'] ?? $_SERVER['HTTP_HOST'] ?? '';
    return $host !== '' && strcasecmp($authority, $host) === 0;
}

/**
 * Client IP. Forwarding headers are only trusted on Vercel, where the edge
 * overwrites them; elsewhere they are client-controlled, so REMOTE_ADDR is used.
 */
function client_ip(): string
{
    if (env('VERCEL') !== null) {
        $forwarded = $_SERVER['HTTP_X_VERCEL_FORWARDED_FOR'] ?? $_SERVER['HTTP_X_REAL_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
        $ip = trim(explode(',', $forwarded)[0]);
        if ($ip !== '') {
            return $ip;
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

/**
 * Increment fixed-window counters for the given keys and return their new values.
 * Uses APCu when available, else one locked JSON file per scope whose expired
 * windows are pruned on every write (so it never grows beyond the active window).
 *
 * @param list<string> $keys
 * @return array<string, int>
 */
function rate_hit(string $scope, array $keys, int $window): array
{
    if (function_exists('apcu_enabled') && apcu_enabled()) {
        $counts = [];
        foreach ($keys as $key) {
            $apcuKey = 'symnexus_' . $scope . '_' . $key;
            apcu_add($apcuKey, 0, $window);
            $counts[$key] = (int) apcu_inc($apcuKey);
        }
        return $counts;
    }

    $fh = @fopen(sys_get_temp_dir() . '/symnexus_ratelimit_' . $scope . '.json', 'c+');
    if ($fh === false) {
        return array_fill_keys($keys, 0);
    }
    flock($fh, LOCK_EX);
    $now  = time();
    $data = json_decode((string) stream_get_contents($fh), true);
    $data = array_filter(is_array($data) ? $data : [], static fn($w) => is_array($w) && ($w['start'] ?? 0) + $window >= $now);

    $counts = [];
    foreach ($keys as $key) {
        $data[$key] ??= ['start' => $now, 'count' => 0];
        $counts[$key] = ++$data[$key]['count'];
    }

    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, (string) json_encode($data));
    flock($fh, LOCK_UN);
    fclose($fh);
    return $counts;
}

/** True when this client (or the instance as a whole) exceeded the scope's limits. */
function rate_limited(string $scope, int $perIp, int $global, int $window): bool
{
    $ipKey  = 'ip_' . md5(client_ip());
    $counts = rate_hit($scope, [$ipKey, 'global'], $window);
    return $counts[$ipKey] > $perIp || $counts['global'] > $global;
}
