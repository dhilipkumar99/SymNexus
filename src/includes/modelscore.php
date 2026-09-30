<?php

declare(strict_types=1);

/**
 * Helpers for the SymNexus(x) product catalog (the nine ModelsCore product sites).
 *
 * The catalog itself is generated: src/data/modelscore.php is copied from ModelsCore by
 * `npm run sync:modelscore`, never edited by hand. It includes each product's `repo`, which
 * names model types and must never be rendered publicly.
 */

/** @return list<array<string, mixed>> The nine products, each with its tasks. */
function modelscore_products(): array
{
    static $products = null;
    return $products ??= require SRC_DIR . '/data/modelscore.php';
}

/**
 * Base URL of a product site, without a trailing slash. Production sets SYMNEXUS_<WORD>_URL;
 * when it is unset (or not an http(s) URL) links fall back to the local dev server.
 */
function modelscore_base(array $product): string
{
    $url = env($product['env_var']);
    if ($url === null || !preg_match('#^https?://[^/\s]+#i', $url)) {
        $url = $product['dev_url'];
    }
    return rtrim($url, '/');
}

/** "#4f46e5" → "79 70 229", for rgb(var(--x)) colour variables. */
function mc_rgb(string $hex): string
{
    return implode(' ', array_map('hexdec', str_split(ltrim($hex, '#'), 2)));
}
