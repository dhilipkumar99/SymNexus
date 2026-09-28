<?php
/**
 * Legal/policy page body (reference article layout).
 *
 * @var string $eyebrow
 * @var string $title
 * @var string $meta      e.g. "Last updated: January 2025"
 * @var array  $sections  [['title' => ..., 'body' => ...]] — body may contain the {email} placeholder
 */
$emailLink = '<a href="' . e(mailto()) . '" class="link-inline">' . e(SITE_EMAIL) . '</a>';
?>
<div class="w-full max-w-3xl mx-auto py-4">
    <div class="mb-8 border-b border-gray-200 dark:border-gray-700/60 pb-8">
        <div class="mb-4 flex flex-wrap items-center gap-2 text-xs font-sans text-gray-500 dark:text-gray-400 font-medium">
            <span class="badge"><?= e($eyebrow) ?></span>
            <span class="text-gray-300 dark:text-gray-600" aria-hidden="true">•</span>
            <span><?= e($meta) ?></span>
        </div>
        <h1 class="font-headline text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight"><?= e($title) ?></h1>
    </div>

    <article class="font-body text-base leading-relaxed text-gray-600 dark:text-gray-400 space-y-8">
        <?php foreach ($sections as $section): ?>
            <section>
                <h2 class="font-headline text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3"><?= e($section['title']) ?></h2>
                <p><?= str_replace('{email}', $emailLink, e($section['body'])) ?></p>
            </section>
        <?php endforeach; ?>
    </article>
</div>
