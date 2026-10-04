<?php
$status    = http_response_code();
$isMissing = $status === 404;

$pageTitle = ($isMissing ? '404' : (string) $status) . ' — SymNexus';
$pageMeta  = ['robots' => 'noindex, follow'];

require SRC_DIR . '/includes/header.php';
?>

<div class="w-full max-w-2xl mx-auto py-16 flex flex-col items-center justify-center text-center">
    <p class="font-mono text-[11px] uppercase tracking-widest text-teal-700 dark:text-teal-400 mb-6">Error <?= e($status) ?></p>

    <p class="font-sans text-7xl md:text-8xl font-bold text-gray-500 dark:text-gray-300 mb-4" aria-hidden="true"><?= e($status) ?></p>

    <h1 class="font-headline text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
        <?= $isMissing ? 'This page doesn&rsquo;t exist.' : 'Something went wrong.' ?>
    </h1>
    <p class="font-body text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed max-w-md mb-10">
        <?php if ($isMissing): ?>
            The page you&rsquo;re looking for may have moved or never existed. Let&rsquo;s get you back to familiar ground.
        <?php else: ?>
            An unexpected error occurred. Please try again — if the problem persists, contact us at
            <a href="<?= e(mailto()) ?>" class="link-inline"><?= e(SITE_EMAIL) ?></a>.
        <?php endif; ?>
    </p>

    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a href="/" class="btn-primary">Back to home</a>
        <a href="/contact" class="btn-secondary">Contact us</a>
    </div>
</div>

<?php require SRC_DIR . '/includes/footer.php'; ?>
