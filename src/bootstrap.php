<?php

declare(strict_types=1);

// ── Site-wide constants ─────────────────────────────────────────────────────
const SITE_NAME       = 'Symnexus';
const SITE_LEGAL_NAME = 'Symnexus Ltd.';
const SITE_URL        = 'https://symnexus.co';
const SITE_EMAIL      = 'info@symnexus.com';
const SITE_PHONE      = '+1 (858) 905-4826';
const SITE_PHONE_TEL  = '+18589054826';

const ROOT_DIR   = __DIR__ . '/..';
const SRC_DIR    = __DIR__;
const PUBLIC_DIR = ROOT_DIR . '/public';

require_once SRC_DIR . '/data/images.php';
require_once SRC_DIR . '/data/nav.php';
require_once SRC_DIR . '/data/products.php';
require_once SRC_DIR . '/includes/icons.php';

/**
 * Load KEY=VALUE pairs from a local .env file (local development only —
 * on Vercel, variables come from the project's environment settings).
 * Existing process variables always win over the file.
 */
function load_env(string $path): void
{
    if (!is_readable($path)) {
        return;
    }

    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) {
            continue;
        }

        [$name, $value] = array_map('trim', explode('=', $line, 2));
        $value = trim($value, "\"'");

        if ($name !== '' && getenv($name) === false) {
            putenv("$name=$value");
            $_ENV[$name] = $value;
        }
    }
}

function env(string $key, ?string $default = null): ?string
{
    $value = $_ENV[$key] ?? getenv($key);
    return ($value === false || $value === '') ? $default : (string) $value;
}

/** HTML-escape a value for output in markup or attributes. */
function e(null|string|int|float $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Cache-busted URL for a file in public/assets (content hash, memoised per request). */
function asset(string $path): string
{
    static $hashes = [];

    $path = ltrim($path, '/');
    if (!isset($hashes[$path])) {
        $file = PUBLIC_DIR . '/assets/' . $path;
        $hashes[$path] = is_file($file) ? substr(md5_file($file), 0, 10) : '0';
    }

    return '/assets/' . $path . '?v=' . $hashes[$path];
}

/** The normalised request path currently being rendered (set by the router). */
function current_path(): string
{
    return $GLOBALS['__current_path'] ?? '/';
}

/** Whether a nav link should be highlighted for the current page (section-aware). */
function is_active(string $href): bool
{
    $path = current_path();
    if ($href === '/') {
        return $path === '/';
    }
    return $path === $href || str_starts_with($path, $href . '/');
}

/**
 * True when the request came from the client-side SPA router, which only needs
 * the inner page fragment (see public/assets/js/spa-router.js).
 */
function is_spa_request(): bool
{
    return ($_SERVER['HTTP_X_SPA_REQUEST'] ?? '') === 'true';
}

/** Whether the AI assistant widget is configured and should be rendered. */
function chat_enabled(): bool
{
    return env('AI_API_KEY') !== null || env('GROQ_API_KEY') !== null;
}

/** mailto: link for the company inbox with an optional subject. */
function mailto(?string $subject = null): string
{
    return 'mailto:' . SITE_EMAIL . ($subject !== null ? '?subject=' . rawurlencode($subject) : '');
}

/** Render a partial from src/partials with the given variables in scope. */
function partial(string $name, array $vars = []): void
{
    extract($vars, EXTR_SKIP);
    require SRC_DIR . '/partials/' . $name . '.php';
}

load_env(ROOT_DIR . '/.env');
