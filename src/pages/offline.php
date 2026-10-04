<?php
// Served by the service worker when a page is requested with no network and no cached copy.
$pageTitle = 'You are offline — SymNexus';
$pageMeta  = ['robots' => 'noindex'];

require SRC_DIR . '/includes/header.php';
?>

<div class="w-full max-w-2xl mx-auto py-16 flex flex-col items-center justify-center text-center">
    <div class="mb-8 text-teal-700 dark:text-teal-400 animate-pulse">
        <?= icon('wifi-off', 'w-24 h-24 mx-auto') ?>
    </div>

    <h1 class="font-headline text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
        You're Offline
    </h1>
    <p class="font-body text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed max-w-md mb-10">
        Your network connection appears to be down. Pages you've already visited are still available.
    </p>

    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a href="/" class="btn-primary">Go Back Home</a>
        <button type="button" onclick="window.location.reload()" class="btn-secondary">Retry Connection</button>
    </div>
</div>

<?php require SRC_DIR . '/includes/footer.php'; ?>
