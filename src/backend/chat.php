<?php

declare(strict_types=1);

/**
 * POST /api/chat — the Symnexus AI assistant.
 *
 * Proxies a short conversation to an OpenAI-compatible chat-completions API
 * (Groq by default) with the company briefing in src/ai/instructions.md as the
 * system prompt. Configure with environment variables:
 *
 *   AI_API_KEY (or GROQ_API_KEY)  required — the widget is hidden without it
 *   AI_API_URL                    default https://api.groq.com/openai/v1/chat/completions
 *   AI_MODEL                      default llama-3.3-70b-versatile
 */

const CHAT_MAX_MESSAGE_CHARS = 1000;
const CHAT_MAX_HISTORY       = 10;
const CHAT_MAX_BODY_BYTES    = 32768;
const CHAT_RATE_LIMIT        = 20;   // requests…
const CHAT_RATE_WINDOW       = 300;  // …per 5 minutes per IP (best effort, per instance)

function chat_respond(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

/** Reject cross-site calls: browsers always send Origin on POST fetches. */
function chat_same_origin(): bool
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? null;
    if ($origin === null) {
        return true; // non-browser clients; rate limiting still applies
    }
    $originHost = (string) parse_url($origin, PHP_URL_HOST);
    $originPort = parse_url($origin, PHP_URL_PORT);
    $authority  = $originHost . ($originPort !== null ? ':' . $originPort : '');
    $host       = $_SERVER['HTTP_X_FORWARDED_HOST'] ?? $_SERVER['HTTP_HOST'] ?? '';
    return $host !== '' && strcasecmp($authority, $host) === 0;
}

function chat_rate_limited(): bool
{
    if (!function_exists('apcu_enabled') || !apcu_enabled()) {
        return false;
    }
    $ip  = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown')[0]);
    $key = 'chat_rl_' . md5($ip);
    apcu_add($key, 0, CHAT_RATE_WINDOW);
    return apcu_inc($key) > CHAT_RATE_LIMIT;
}

/** @return list<array{role: string, content: string}> */
function chat_clean_history(mixed $history): array
{
    if (!is_array($history)) {
        return [];
    }

    $clean = [];
    foreach (array_slice(array_values($history), -CHAT_MAX_HISTORY) as $msg) {
        if (!is_array($msg) || !is_string($msg['content'] ?? null)) {
            continue;
        }
        $content = trim(mb_substr($msg['content'], 0, 2000));
        if ($content === '') {
            continue;
        }
        $clean[] = [
            'role'    => ($msg['role'] ?? '') === 'user' ? 'user' : 'assistant',
            'content' => $content,
        ];
    }
    return $clean;
}

function handle_chat(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        header('Allow: POST');
        chat_respond(405, ['error' => 'Method not allowed.']);
        return;
    }

    $apiKey = env('AI_API_KEY') ?? env('GROQ_API_KEY');
    if ($apiKey === null) {
        chat_respond(503, ['error' => 'The assistant is not configured.']);
        return;
    }

    if (!chat_same_origin()) {
        chat_respond(403, ['error' => 'Forbidden.']);
        return;
    }

    if (chat_rate_limited()) {
        chat_respond(429, ['error' => "You're sending messages quickly — please wait a moment."]);
        return;
    }

    $raw = file_get_contents('php://input', false, null, 0, CHAT_MAX_BODY_BYTES + 1);
    if ($raw === false || strlen($raw) > CHAT_MAX_BODY_BYTES) {
        chat_respond(413, ['error' => 'Message too long.']);
        return;
    }

    $input   = json_decode($raw, true);
    $message = is_array($input) && is_string($input['message'] ?? null) ? trim($input['message']) : '';
    if ($message === '') {
        chat_respond(422, ['error' => 'Please type a question.']);
        return;
    }
    if (mb_strlen($message) > CHAT_MAX_MESSAGE_CHARS) {
        chat_respond(422, ['error' => 'Please keep questions under ' . CHAT_MAX_MESSAGE_CHARS . ' characters.']);
        return;
    }

    $instructions = @file_get_contents(SRC_DIR . '/ai/instructions.md');
    if ($instructions === false) {
        $instructions = 'You are the assistant for Symnexus, a software company. Answer briefly and direct visitors to ' . SITE_EMAIL . '.';
    }

    $messages = array_merge(
        [['role' => 'system', 'content' => trim($instructions)]],
        chat_clean_history($input['history'] ?? []),
        [['role' => 'user', 'content' => $message]],
    );

    $payload = json_encode([
        'model'       => env('AI_MODEL', 'llama-3.3-70b-versatile'),
        'messages'    => $messages,
        'max_tokens'  => 350,
        'temperature' => 0.4,
    ], JSON_UNESCAPED_UNICODE);

    $ch = curl_init(env('AI_API_URL', 'https://api.groq.com/openai/v1/chat/completions'));
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT        => 25,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json',
        ],
    ]);

    $response = curl_exec($ch);
    $status   = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr  = curl_error($ch);
    curl_close($ch);

    $data  = is_string($response) ? json_decode($response, true) : null;
    $reply = $data['choices'][0]['message']['content'] ?? null;

    if ($status !== 200 || !is_string($reply) || trim($reply) === '') {
        // Log the upstream detail server-side; never echo provider errors to visitors.
        error_log(sprintf('[symnexus chat] upstream failure: HTTP %d %s %s', $status, $curlErr, is_string($response) ? mb_substr($response, 0, 500) : ''));
        chat_respond(502, ['error' => 'The assistant is unavailable right now.']);
        return;
    }

    chat_respond(200, ['reply' => trim($reply)]);
}
