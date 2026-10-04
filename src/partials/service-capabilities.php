<?php
/**
 * Grid of what we build (SERVICE_CAPABILITIES), used on the home and services pages.
 *
 * @var bool $showFamily  Show the SymNexus model family behind each capability
 */
?>
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <?php foreach (SERVICE_CAPABILITIES as $c): ?>
        <div class="card flex flex-col h-full">
            <div class="icon-badge mb-5"><?= icon($c['icon'], 'w-5 h-5') ?></div>
            <h3 class="font-sans text-lg font-bold text-gray-900 dark:text-white mb-2"><?= e($c['title']) ?></h3>
            <p class="font-body text-sm leading-relaxed text-gray-600 dark:text-gray-300 flex-grow"><?= e($c['body']) ?></p>
            <?php if (!empty($showFamily)): ?>
                <p class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/40 text-xs font-medium text-teal-700 dark:text-teal-400">SymNexus <?= e($c['family']) ?></p>
            <?php endif; ?>
        </div>
    <?php endforeach; ?>
</div>
