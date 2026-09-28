<footer class="w-full text-gray-500 dark:text-zinc-500 pt-16 mt-auto">
    <div
        class="flex flex-col lg:flex-row items-center justify-between gap-6 text-xs font-medium tracking-wide border-t border-gray-200/60 dark:border-gray-700/40 pt-6">

        <nav aria-label="Footer" class="flex flex-wrap justify-center gap-x-4 gap-y-2 text-gray-600 dark:text-zinc-400">
            <?php foreach (FOOTER_LINKS as $i => $link): ?>
                <?php if ($i > 0): ?><span class="text-gray-300 dark:text-zinc-700 select-none" aria-hidden="true">/</span><?php endif; ?>
                <a href="<?= e($link['href']) ?>"
                    class="hover:text-brandPrimary dark:hover:text-white transition-colors duration-200"><?= e($link['label']) ?></a>
            <?php endforeach; ?>
            <span class="text-gray-300 dark:text-zinc-700 select-none" aria-hidden="true">/</span>
            <a href="<?= e(mailto()) ?>"
                class="hover:text-brandPrimary dark:hover:text-white transition-colors duration-200">Email</a>
        </nav>

        <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <?php foreach (LEGAL_LINKS as $link): ?>
                <a href="<?= e($link['href']) ?>"
                    class="text-gray-600 dark:text-zinc-400 hover:text-brandPrimary dark:hover:text-white transition-colors duration-200"><?= e($link['label']) ?></a>
            <?php endforeach; ?>
            <span class="text-gray-600 dark:text-zinc-400">&copy; <?= date('Y') ?> <?= e(SITE_LEGAL_NAME) ?></span>
        </div>

    </div>
</footer>

<?php if (is_spa_request()) {
    // SPA fragment ends here; the persistent shell below is already on the page.
    return;
} ?>
            </div>
        </section>
    </main>

    <!-- Global lightbox (media carousels) -->
    <div id="global-lightbox" role="dialog" aria-modal="true" aria-label="Media preview"
        class="hidden fixed inset-0 bg-brandNeutral/95 z-[99999] items-center justify-center p-4 backdrop-blur-sm select-none">
        <button type="button" data-lightbox-close aria-label="Close preview"
            class="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <?= icon('x-mark', 'w-6 h-6') ?>
        </button>
        <div id="lightbox-content" class="w-full max-w-5xl max-h-[85vh] flex items-center justify-center"></div>
    </div>

    <?php if (chat_enabled()) {
        partial('chat-widget');
    } ?>

    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('/sw.js').catch(function (err) {
                    console.warn('[Service Worker] Registration failed:', err);
                });
            });
        }
    </script>
</body>

</html>
