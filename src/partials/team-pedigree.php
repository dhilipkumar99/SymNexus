<?php
/** "Our engineers come from…" strip (TEAM_PEDIGREE), shown as text rather than third-party logos. */
?>
<div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-6 border-y border-gray-200/70 dark:border-gray-700/50">
    <p class="flex-shrink-0 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Our engineers come from</p>
    <ul class="flex flex-wrap items-center gap-x-6 gap-y-2">
        <?php foreach (TEAM_PEDIGREE as $name): ?>
            <li class="font-headline text-base sm:text-lg font-bold tracking-tight text-gray-500 dark:text-gray-300"><?= e($name) ?></li>
        <?php endforeach; ?>
    </ul>
</div>
