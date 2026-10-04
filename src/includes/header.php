<?php
// ============================================================
// Layout header. Pages set $pageTitle and $pageMeta before including it;
// every field falls back to a site-level default.
//
// When the SPA router requests a page (X-SPA-Request: true) only the inner
// fragment is sent, so this file emits response headers and nothing else.
// ============================================================

$pageTitle = $pageTitle ?? 'SymNexus — Custom AI Software Development | Silicon Valley Engineers';
$pageMeta  = $pageMeta ?? [];

if (is_spa_request()) {
    header('X-SPA-Fragment: 1');
    header('X-SPA-Title: ' . rawurlencode($pageTitle));
    header('Cache-Control: no-store');
    return;
}

$canonical        = $pageMeta['canonical'] ?? (SITE_URL . current_path());
$meta_description = $pageMeta['description'] ?? SITE_DESCRIPTION;
$meta_og_type      = $pageMeta['og_type'] ?? 'website';
// Branded share card by default; pages with real product imagery may override it.
$meta_og_image     = $pageMeta['og_image'] ?? SITE_URL . asset('images/og-symnexus.png');
$meta_og_image_alt = $pageMeta['og_image_alt'] ?? 'SymNexus — production AI systems, built by Silicon Valley engineers';
$meta_robots       = $pageMeta['robots'] ?? 'index, follow';

$ld = $pageMeta['jsonld'] ?? organization_jsonld();

// Optional third-party tags, enabled per environment so no IDs live in the code.
$linkedinPartnerId = env('LINKEDIN_PARTNER_ID');

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Primary SEO Meta Tags -->
    <title><?= e($pageTitle) ?></title>
    <meta name="description" content="<?= e($meta_description) ?>">
    <meta name="robots" content="<?= e($meta_robots) ?>">
    <link rel="canonical" href="<?= e($canonical) ?>">
    <meta name="theme-color" content="#f0f2f5">

    <!-- Open Graph -->
    <meta property="og:type" content="<?= e($meta_og_type) ?>">
    <meta property="og:url" content="<?= e($canonical) ?>">
    <meta property="og:title" content="<?= e($pageTitle) ?>">
    <meta property="og:description" content="<?= e($meta_description) ?>">
    <meta property="og:image" content="<?= e($meta_og_image) ?>">
    <meta property="og:image:alt" content="<?= e($meta_og_image_alt) ?>">
    <meta property="og:site_name" content="<?= e(SITE_NAME) ?>">
    <meta property="og:locale" content="en_US">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?= e($pageTitle) ?>">
    <meta name="twitter:description" content="<?= e($meta_description) ?>">
    <meta name="twitter:image" content="<?= e($meta_og_image) ?>">
    <meta name="twitter:image:alt" content="<?= e($meta_og_image_alt) ?>">

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json"><?= json_encode($ld, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP) ?></script>

    <link rel="icon" href="/favicon.ico" sizes="48x48">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">

    <!-- Light by default; dark only if the visitor chose it with the toggle. Resolved before first paint to avoid a flash. -->
    <script>
        (function () {
            var stored = null;
            try { stored = localStorage.getItem('color-theme'); } catch (e) {}
            var dark = stored === 'dark';
            document.documentElement.classList.toggle('dark', dark);
        })();
    </script>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200..800;1,200..800&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="<?= e(asset('css/app.css')) ?>">

    <script src="<?= e(asset('js/site.js')) ?>" defer></script>
    <script src="<?= e(asset('js/spa-router.js')) ?>" defer></script>

    <!-- Vercel Web Analytics (page views, incl. SPA navigations). Enable it in the Vercel project's Analytics tab. -->
    <script>window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };</script>
    <script defer src="/_vercel/insights/script.js"></script>
<?php if ($linkedinPartnerId !== null): ?>

    <!-- LinkedIn Insight Tag (LINKEDIN_PARTNER_ID) -->
    <script>
        window._linkedin_data_partner_ids = (window._linkedin_data_partner_ids || []).concat(<?= json_encode($linkedinPartnerId, JSON_HEX_TAG) ?>);
        (function (l) {
            if (!l) { window.lintrk = function (a, b) { window.lintrk.q.push([a, b]); }; window.lintrk.q = []; }
            var s = document.getElementsByTagName('script')[0], b = document.createElement('script');
            b.type = 'text/javascript'; b.async = true; b.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
            s.parentNode.insertBefore(b, s);
        })(window.lintrk);
    </script>
<?php endif; ?>
</head>

<body class="bg-white dark:bg-black min-h-screen font-body flex flex-col transition-colors duration-300">

    <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100000] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brandPrimary focus:shadow-md">Skip to content</a>

    <!-- Header Component (outer container is fully transparent) -->
    <header id="main-header"
        class="fixed top-6 left-0 right-0 w-full lg:left-12 lg:right-12 lg:w-auto px-4 sm:px-8 lg:px-16 transition-all duration-300 ease-in-out z-50">

        <div class="max-w-6xl mx-auto flex items-center justify-between h-16">

            <!-- Logo pill: naked at the top, glass once scrolled -->
            <div id="logo-pill" class="flex-shrink min-w-0 flex items-center rounded-full px-3 sm:px-5 py-2">
                <a href="/" class="block transition-opacity hover:opacity-80">
                    <img src="<?= e(asset('images/symnexus-wordmark.webp')) ?>" alt="SymNexus — home" width="1067" height="124"
                        class="block h-4 sm:h-5 w-auto dark:brightness-0 dark:invert">
                </a>
            </div>

            <!-- Center: floating pill for desktop nav links -->
            <nav aria-label="Primary"
                class="hidden lg:flex items-center space-x-1 xl:space-x-2 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md border border-gray-200/40 dark:border-neutral-800/40 shadow-md rounded-full px-6 py-2 transition-colors duration-300">
                <?php foreach (NAV_LINKS as $link): ?>
                    <a href="<?= e($link['href']) ?>" data-match="<?= e(implode(' ', $link['match'])) ?>"
                        <?= nav_is_active($link) ? 'aria-current="page"' : '' ?>
                        class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:text-brandPrimary dark:hover:text-brandPrimary aria-[current=page]:text-brandPrimary aria-[current=page]:font-semibold dark:aria-[current=page]:text-brandPrimary"><?= e($link['label']) ?></a>
                <?php endforeach; ?>
            </nav>

            <!-- Right: floating pill for the primary call to action, theme toggle and mobile trigger -->
            <div
                class="flex items-center space-x-1 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md border border-gray-200/40 dark:border-neutral-800/40 shadow-md rounded-full p-1.5 transition-colors duration-300">
                <a href="<?= e(PRIMARY_CTA['href']) ?>" data-cta="header"
                    class="inline-flex items-center whitespace-nowrap rounded-full px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brandPrimary focus-visible:ring-offset-1 transition-colors">
                    <span class="sm:hidden">Book a call</span><span class="hidden sm:inline"><?= e(PRIMARY_CTA['label']) ?></span>
                </a>
                <button id="theme-toggle" type="button"
                    class="text-gray-500 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-neutral-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brandPrimary rounded-full text-sm p-2 transition-all"
                    aria-label="Toggle dark mode">
                    <!-- Sun (shown in dark mode) -->
                    <svg class="hidden dark:block h-5 w-5 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                        <path
                            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 2.293a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm4 4.707a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM16.121 14.707a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM10 14a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.707-1.293a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm2.293-4.707a1 1 0 011.414-1.414l.707.707a1 1 0 01-1.414 1.414l-.707-.707zM10 5a5 5 0 100 10 5 5 0 000-10z" />
                    </svg>
                    <!-- Moon (shown in light mode) -->
                    <svg class="block dark:hidden h-5 w-5 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                </button>
                <!-- Mobile hamburger -->
                <button id="mobile-menu-btn" type="button" aria-controls="mobile-menu" aria-expanded="false" aria-label="Open menu"
                    class="lg:hidden text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brandPrimary rounded-full p-2 transition-colors">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Mobile drawer -->
        <div id="mobile-menu"
            class="hidden lg:hidden max-w-6xl mx-auto mt-2 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden">
            <nav aria-label="Mobile" class="px-4 py-4 space-y-1">
                <?php foreach (NAV_LINKS as $link): ?>
                    <a href="<?= e($link['href']) ?>" data-match="<?= e(implode(' ', $link['match'])) ?>"
                        <?= nav_is_active($link) ? 'aria-current="page"' : '' ?>
                        class="block text-sm font-medium px-4 py-2.5 rounded-xl transition-colors text-gray-600 dark:text-gray-300 hover:text-brandPrimary aria-[current=page]:text-brandPrimary aria-[current=page]:font-semibold aria-[current=page]:bg-gray-100 dark:aria-[current=page]:bg-white/5 dark:aria-[current=page]:text-brandPrimary"><?= e($link['label']) ?></a>
                <?php endforeach; ?>
                <a href="<?= e(PRIMARY_CTA['href']) ?>" data-cta="mobile-menu"
                    class="block text-center text-sm font-semibold px-4 py-2.5 mt-2 rounded-xl text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 transition-colors"><?= e(PRIMARY_CTA['label']) ?></a>
            </nav>
        </div>
    </header>

    <main id="main-content" class="flex-grow flex flex-col">

        <!-- Outer frame -->
        <section
            class="w-full bg-white dark:bg-[#22242a] min-h-screen flex flex-col items-center overflow-x-hidden flex-grow transition-colors duration-300">

            <!-- Inner card: page fragments are swapped in here by the SPA router -->
            <div id="spa-container"
                class="w-full max-w-7xl bg-[#f0f2f5] dark:bg-[#2c2e35] border-x border-gray-200/50 dark:border-gray-800/50 pt-28 pb-12 px-6 sm:pt-36 sm:pb-16 sm:px-12 md:pt-40 md:pb-20 md:px-16 transition-colors duration-300 min-h-screen flex flex-col">
