<?php
/**
 * Closing call-to-action panel.
 *
 * @var string      $title
 * @var string      $body
 * @var string|null $note       Trusted template HTML (may contain links)
 * @var array       $primary    ['label' => ..., 'href' => ...]
 * @var array|null  $secondary  ['label' => ..., 'href' => ...]
 */
?>
<section class="py-12">
    <div class="card-inset p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div class="max-w-2xl">
            <h2 class="font-sans text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-3"><?= e($title) ?></h2>
            <p class="body-copy text-sm md:text-base"><?= e($body) ?></p>
            <?php if (!empty($note)): ?>
                <p class="mt-3 body-copy text-xs md:text-sm text-gray-500 dark:text-gray-500"><?= $note ?></p>
            <?php endif; ?>
        </div>
        <div class="flex flex-wrap gap-3 flex-shrink-0">
            <a href="<?= e($primary['href']) ?>" class="btn-primary group">
                <?= e($primary['label']) ?>
                <?= icon('arrow-right', 'w-4 h-4 animate-drop-twice') ?>
            </a>
            <?php if (!empty($secondary)): ?>
                <a href="<?= e($secondary['href']) ?>" class="btn-secondary"><?= e($secondary['label']) ?></a>
            <?php endif; ?>
        </div>
    </div>
</section>
