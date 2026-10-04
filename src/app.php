<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

/**
 * Route table: clean URL => page template in src/pages, plus sitemap metadata.
 * A null priority keeps the page out of the sitemap.
 */
const ROUTES = [
    '/'                                        => ['page' => 'home',                'priority' => '1.0'],
    '/services'                                => ['page' => 'services',            'priority' => '0.9'],
    '/about'                                   => ['page' => 'about',               'priority' => '0.8'],
    '/products'                                => ['page' => 'products',            'priority' => '0.9'],
    '/fluorocellai'                            => ['page' => 'fluorocellai',        'priority' => '0.9'],
    '/compliancecall'                          => ['page' => 'compliancecall',      'priority' => '0.9'],
    '/pricing'                                 => ['page' => 'pricing',             'priority' => '0.7'],
    '/research'                                => ['page' => 'research',            'priority' => '0.8'],
    '/research/fluorocellai-cancer-research-lab' => ['page' => 'research-fluorocellai', 'priority' => '0.7'],
    '/research/yashara-retail-ai'              => ['page' => 'research-yashara',    'priority' => '0.7'],
    '/careers'                                 => ['page' => 'careers',             'priority' => '0.5'],
    '/contact'                                 => ['page' => 'contact',             'priority' => '0.7'],
    '/demo'                                    => ['page' => 'demo',                'priority' => '0.8'],
    '/privacy'                                 => ['page' => 'privacy',             'priority' => '0.3'],
    '/terms'                                   => ['page' => 'terms',               'priority' => '0.3'],
    '/security'                                => ['page' => 'security',            'priority' => '0.4'],
    '/video'                                   => ['page' => 'video',               'priority' => null],
    '/qr'                                      => ['page' => 'qr',                  'priority' => null],
    '/offline'                                 => ['page' => 'offline',             'priority' => null],
];

/** Legacy URLs kept alive (the old per-product pricing pages were folded into /pricing). */
const REDIRECTS = [
    '/fluorocellai/pricing'   => ['/pricing#fluorocellai', 307],
    '/compliancecall/pricing' => ['/pricing#compliancecall', 307],
    '/index.php'              => ['/', 301],
    // The catalog moved to /products; the SymNexus(x) product sites still link here.
    '/solutions'              => ['/products', 301],
    '/case-studies'           => ['/research', 301],
    '/ai-development'         => ['/services', 301],
];

function send_common_headers(): void
{
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('X-Frame-Options: SAMEORIGIN');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
    // The same URL returns a full document or an SPA fragment depending on this header.
    header('Vary: X-SPA-Request');
}

function redirect_to(string $location, int $status): void
{
    header('Location: ' . $location, true, $status);
    header('Cache-Control: no-store');
}

/**
 * Render a page template inside an output buffer so templates can still set
 * headers/status late, and so a failure mid-render never leaks half a page.
 */
function render_page(string $page, int $status = 200): void
{
    http_response_code($status);

    ob_start();
    try {
        (static function (string $__file): void {
            require $__file;
        })(SRC_DIR . '/pages/' . $page . '.php');
    } catch (Throwable $e) {
        ob_end_clean();
        error_log('[symnexus] Render failed for ' . $page . ': ' . $e);
        render_fatal();
        return;
    }

    $html = (string) ob_get_clean();
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'HEAD') {
        echo $html;
    }
}

/** Last-resort 500 response that depends on nothing but PHP itself. */
function render_fatal(): void
{
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: text/html; charset=utf-8');
        header('Cache-Control: no-store');
    }
    echo '<!doctype html><meta charset="utf-8"><title>Error — SymNexus</title>'
        . '<p style="font-family:sans-serif;padding:2rem">Something went wrong. Please try again, or email '
        . '<a href="mailto:' . SITE_EMAIL . '">' . SITE_EMAIL . '</a>.</p>';
}

function render_sitemap(): void
{
    header('Content-Type: application/xml; charset=utf-8');
    header('Cache-Control: public, max-age=3600');

    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    foreach (ROUTES as $path => $route) {
        if ($route['priority'] === null) {
            continue;
        }
        $freq = (float) $route['priority'] <= 0.4 ? 'yearly' : 'monthly';
        echo '  <url><loc>' . e(SITE_URL . $path) . '</loc><priority>' . $route['priority']
            . '</priority><changefreq>' . $freq . '</changefreq></url>' . "\n";
    }
    echo '</urlset>' . "\n";
}

/**
 * Handle the current request. Returns false only under the PHP built-in dev
 * server, to let it stream an existing file from public/ (images, video ranges).
 */
function handle_request(): ?bool
{
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $uri    = $_SERVER['REQUEST_URI'] ?? '/';
    $path   = parse_url($uri, PHP_URL_PATH);
    $query  = parse_url($uri, PHP_URL_QUERY);
    $path   = is_string($path) && $path !== '' ? rawurldecode($path) : '/';

    // vercel.json rewrites every path to /api/index.php?__path=/<original>. The runtime
    // normally forwards the original URI; if it forwarded the rewritten one, recover it.
    if ($path === '/api/index.php' && is_string($_GET['__path'] ?? null)) {
        $path = '/' . ltrim($_GET['__path'], '/');
    }
    if (is_string($query)) {
        // Strip only our internal parameter; everything else passes through byte-for-byte.
        $query = trim((string) preg_replace('/(?:^|&)__path=[^&]*/', '', $query), '&');
    }

    // Local dev (`php -S ... -t public api/index.php`): let the server stream static files.
    if (PHP_SAPI === 'cli-server' && $path !== '/') {
        $file = realpath(PUBLIC_DIR . $path);
        $root = realpath(PUBLIC_DIR);
        if ($file !== false && $root !== false && is_file($file) && str_starts_with($file, $root . DIRECTORY_SEPARATOR)) {
            return false;
        }
    }

    send_common_headers();

    // Canonicalise: collapse duplicate slashes and drop trailing slashes.
    $canonical = preg_replace('#/{2,}#', '/', $path) ?? $path;
    if ($canonical !== '/') {
        $canonical = rtrim($canonical, '/');
    }
    if ($canonical === '') {
        $canonical = '/';
    }
    if ($canonical !== $path) {
        // Re-encode each segment so decoded characters (e.g. "\" from %5C) can never
        // turn the Location into a protocol-relative, off-site URL.
        $location = implode('/', array_map('rawurlencode', explode('/', $canonical)));
        redirect_to($location . (is_string($query) && $query !== '' ? '?' . $query : ''), 301);
        return null;
    }

    if (isset(REDIRECTS[$path])) {
        [$target, $status] = REDIRECTS[$path];
        redirect_to($target, $status);
        return null;
    }

    if ($path === '/api/contact') {
        require_once SRC_DIR . '/backend/contact.php';
        handle_contact();
        return null;
    }

    if ($path === '/api/chat') {
        require_once SRC_DIR . '/backend/chat.php';
        handle_chat();
        return null;
    }

    if ($path === '/sitemap.xml') {
        render_sitemap();
        return null;
    }

    $GLOBALS['__current_path'] = $path;

    if (isset(ROUTES[$path])) {
        if ($method !== 'GET' && $method !== 'HEAD') {
            header('Allow: GET, HEAD');
            render_page('not-found', 405);
            return null;
        }
        render_page(ROUTES[$path]['page']);
        return null;
    }

    render_page('not-found', 404);
    return null;
}

return handle_request();
