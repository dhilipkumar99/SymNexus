<?php
/**
 * Page hero header (reference "About" layout).
 *
 * @var string      $title
 * @var string|null $highlight  Trailing part of the title rendered in the brand colour
 * @var string|null $eyebrow
 * @var string|null $lead
 * @var string|null $sublead
 */
?>
<header class="mb-12 border-b border-gray-200 dark:border-gray-700/60 pb-8 max-w-4xl">
    <?php if (!empty($eyebrow)): ?>
        <p class="badge mb-5"><?= e($eyebrow) ?></p>
    <?php endif; ?>
    <h1 class="font-headline font-bold text-4xl sm:text-5xl text-gray-900 dark:text-white tracking-tight leading-tight mb-4 transition-colors duration-300">
        <?= e($title) ?><?php if (!empty($highlight)): ?> <span class="text-brandPrimary"><?= e($highlight) ?></span><?php endif; ?>
    </h1>
    <?php if (!empty($lead)): ?>
        <p class="font-sans text-lg font-medium text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl transition-colors duration-300"><?= e($lead) ?></p>
    <?php endif; ?>
    <?php if (!empty($sublead)): ?>
        <p class="mt-3 body-copy text-sm max-w-3xl"><?= $sublead /* trusted template HTML */ ?></p>
    <?php endif; ?>
</header>
