<?php
/**
 * Product card (About page grid; FluorocellAI also on /research).
 *
 * @var string     $slug    Key in PRODUCTS; also the card's id
 * @var array      $p       PRODUCTS[$slug]
 * @var array|null $slides  Carousel slides (see carousel.php); null for none
 * @var string     $class   Extra classes on the card, e.g. grid spans
 */
?>
<article id="<?= e($slug) ?>"
    class="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-800 flex flex-col justify-between transition-all duration-200 hover:shadow-lg <?= e($class ?? '') ?>">

    <?php if (!empty($slides)): ?>
        <?php partial('carousel', ['label' => $p['name'] . ' media', 'slides' => $slides]); ?>
    <?php endif; ?>

    <div class="p-6 sm:p-8 flex-grow flex flex-col justify-between">
        <div>
            <div class="flex justify-between items-center gap-3 mb-3">
                <span class="pill"><?= e($p['category']) ?></span>
                <?php if ($p['pricing'] !== null): ?>
                    <span class="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/40 rounded border border-emerald-500/20">Currently offering</span>
                <?php else: ?>
                    <span class="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-slate-800 rounded border border-gray-300/40 dark:border-slate-700/40">Custom system</span>
                <?php endif; ?>
            </div>

            <h2 class="text-2xl font-bold text-brandNeutral dark:text-white mb-3 font-headline"><?= e($p['name']) ?></h2>
            <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4"><?= e($p['overview']) ?></p>

            <div class="mb-5 bg-gray-50 dark:bg-slate-800/40 p-3 rounded-lg border-l-4 border-brandPrimary">
                <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed"><?= e($p['detail']) ?></p>
            </div>

            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 font-sans text-xs font-medium text-gray-700 dark:text-gray-300">
                <?php foreach ($p['features'] as $feature): ?>
                    <li class="flex items-start"><span class="w-1.5 h-1.5 mt-1.5 rounded-full bg-brandPrimary mr-2 flex-shrink-0" aria-hidden="true"></span><?= e($feature) ?></li>
                <?php endforeach; ?>
            </ul>

            <?php if ($slug === 'fluorocellai'): ?>
                <div class="mt-6 grid grid-cols-2 rounded-lg border border-gray-100 dark:border-slate-800 divide-x divide-gray-100 dark:divide-slate-800 text-xs">
                    <div class="p-4">
                        <p class="font-mono text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-300 mb-3">Before</p>
                        <ul class="space-y-2 text-gray-500 dark:text-gray-300">
                            <li>Manual counting: 1–2 days</li>
                            <li>Manual QC / re-count: ~1 day</li>
                            <li>Reporting: ~1 day</li>
                        </ul>
                    </div>
                    <div class="p-4">
                        <p class="font-mono text-[10px] uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-3">With FluorocellAI</p>
                        <ul class="space-y-2 text-gray-700 dark:text-gray-200">
                            <li>Automated counting: minutes</li>
                            <li>QC / audit trail: automatic</li>
                            <li>Reporting: same day</li>
                        </ul>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <div class="px-6 sm:px-8 py-4 bg-gray-50 dark:bg-slate-800/20 border-t border-gray-100 dark:border-slate-800 flex flex-wrap justify-between items-center gap-4">
        <a href="/demo" class="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brandPrimary dark:hover:text-brandPrimary transition-colors">
            <?= e($p['cta']) ?>
        </a>
        <a href="<?= e($p['href']) ?>" <?= $p['external'] ? 'target="_blank" rel="noopener noreferrer"' : '' ?>
            class="inline-flex items-center text-sm font-semibold text-brandPrimary hover:underline group">
            <?= $p['external'] ? e($p['link']) : 'View ' . e($p['name']) ?>
            <?= icon($p['external'] ? 'arrow-up-right' : 'arrow-right', 'w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-0.5' . ($p['external'] ? ' group-hover:-translate-y-0.5' : '')) ?>
        </a>
    </div>
</article>
