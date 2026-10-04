<?php
/** The three engagement tiers (SERVICE_TIERS), used on the services and pricing pages. */
?>
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <?php foreach (SERVICE_TIERS as $t): ?>
        <article id="<?= e($t['id']) ?>" class="card flex flex-col scroll-mt-28 <?= !empty($t['featured']) ? 'ring-2 ring-brandPrimary/60' : '' ?>">
            <div class="flex items-center justify-between gap-3 mb-4">
                <h3 class="font-sans text-sm font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400"><?= e($t['name']) ?></h3>
                <?php if (!empty($t['featured'])): ?>
                    <span class="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/40 rounded border border-emerald-500/20">Most common</span>
                <?php endif; ?>
            </div>
            <p class="font-sans text-2xl font-bold text-gray-900 dark:text-white tracking-tight"><?= e($t['tagline']) ?></p>
            <p class="mt-3 body-copy text-sm"><?= e($t['body']) ?></p>
            <ul class="mt-6 flex-1 space-y-2.5 font-sans text-sm font-medium text-gray-700 dark:text-gray-300">
                <?php foreach ($t['items'] as $item): ?>
                    <li class="flex items-start"><span class="text-brandPrimary mr-2.5 mt-0.5 flex-shrink-0"><?= icon('check', 'w-4 h-4') ?></span><?= e($item) ?></li>
                <?php endforeach; ?>
            </ul>
            <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/40">
                <p class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Custom pricing, quoted to your scope</p>
                <a href="<?= e(PRIMARY_CTA['href']) ?>?interest=<?= e($t['id']) ?>" data-cta="tier-<?= e($t['id']) ?>" class="<?= !empty($t['featured']) ? 'btn-primary' : 'btn-secondary' ?> w-full justify-center"><?= e(PRIMARY_CTA['label']) ?></a>
            </div>
        </article>
    <?php endforeach; ?>
</div>
