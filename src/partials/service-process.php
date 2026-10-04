<?php
/** The five steps of an engagement (SERVICE_PROCESS), used on the home and services pages. */
?>
<ol class="grid grid-cols-1 md:grid-cols-5 gap-4">
    <?php foreach (SERVICE_PROCESS as [$num, $title, $body]): ?>
        <li class="card-inset flex flex-col">
            <span class="font-mono text-xs font-bold text-brandPrimary mb-3"><?= e($num) ?></span>
            <p class="font-sans text-sm font-bold text-gray-900 dark:text-white mb-2"><?= e($title) ?></p>
            <p class="text-xs leading-relaxed text-gray-600 dark:text-gray-300"><?= e($body) ?></p>
        </li>
    <?php endforeach; ?>
</ol>
