<?php
/**
 * Products: the nine SymNexus(x) products and their tasks, with the same task buttons as the
 * product sites. Each task links to its page on the product site (<base>/tasks/<slug>), which
 * opens the project questionnaire.
 *
 * The catalog is GENERATED from ModelsCore. When ModelsCore tasks change, run
 * `npm run sync:modelscore` (re-exports src/data/modelscore.php and the icons in
 * public/assets/images/tasks/), then `npm run build`. Don't edit the task list here.
 * Production links need SYMNEXUS_<WORD>_URL set (see .env.example); unset, they go to localhost.
 * Never render a product's `repo`: it names model types.
 *
 * Every section is rendered server-side, so the page works without JavaScript; site.js only
 * narrows it to one product and filters tasks ([data-solutions]).
 */
require_once SRC_DIR . '/includes/modelscore.php';

$products  = modelscore_products();
$taskCount = array_sum(array_map(static fn (array $p): int => count($p['tasks']), $products));

$depts = [];
foreach ($products as $p) {
    foreach ($p['tasks'] as $t) {
        $depts[$t['dept']] = ($depts[$t['dept']] ?? 0) + 1;
    }
}
arsort($depts);

$pageTitle = 'SymNexus Models — AI for Every Department | SymNexus';
$pageMeta  = [
    'description' => 'Nine SymNexus AI model families and ' . $taskCount . ' ready-made tasks, from customer churn and demand forecasting to document extraction and computer vision, configured by our engineers to your data.',
];

require SRC_DIR . '/includes/header.php';
?>

<?php partial('page-header', [
    'eyebrow'   => 'SymNexus Models',
    'title'     => 'AI models for',
    'highlight' => 'every department.',
    'lead'      => 'Nine model families and ' . $taskCount . ' ready-made tasks. Pick the one closest to your work, and our engineers configure it to your data and build it into your workflow.',
]); ?>

<section class="mb-10 max-w-4xl" aria-label="Our offering">
    <p class="body-copy">
        Text, vision, voice and tabular models, designed by our Silicon Valley engineering team and configured to your
        task. Search by department below. Don&rsquo;t see your use case? These are starting points, not limits:
        <a href="/services" class="link-inline">we build custom AI systems</a> too.
    </p>
    <div class="flex flex-wrap gap-3 mt-6">
        <a href="<?= e(PRIMARY_CTA['href']) ?>?interest=custom" data-cta="models-hero" class="btn-primary group"><?= e(PRIMARY_CTA['label']) ?> <?= icon('arrow-right', 'w-4 h-4 animate-drop-twice') ?></a>
    </div>
</section>

<div id="solutions-browser" data-solutions class="mb-8">

    <nav aria-label="SymNexus models" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-6">
        <a href="#solutions-browser" data-product-pill data-product="all"
            class="mc-pill mc-focus flex flex-col items-center justify-center text-center rounded-xl border-2 px-3 py-3 min-h-[64px] bg-white dark:bg-[#3a3d48] text-gray-900 dark:text-white transition-all duration-200">
            <span class="font-sans font-semibold text-sm sm:text-base leading-tight">All tasks</span>
            <span class="mt-0.5 text-xs opacity-75"><?= e($taskCount) ?> tasks</span>
        </a>
        <?php foreach ($products as $p): ?>
            <a href="#<?= e($p['key']) ?>" data-product-pill data-product="<?= e($p['key']) ?>"
                style="--mc-light: <?= e(mc_rgb($p['colors']['primary'])) ?>; --mc-dark: <?= e(mc_rgb($p['colors']['primary_dark'])) ?>; --mc-accent: <?= e(mc_rgb($p['colors']['accent'])) ?>;"
                class="mc-product mc-pill mc-focus flex flex-col items-center justify-center text-center rounded-xl border-2 px-3 py-3 min-h-[64px] bg-white dark:bg-[#3a3d48] text-gray-900 dark:text-white transition-all duration-200">
                <span class="font-sans font-semibold text-sm sm:text-base leading-tight">SymNexus<span class="mc-text-gradient"><?= e($p['word']) ?></span></span>
                <span class="mt-0.5 text-xs opacity-75"><?= e(count($p['tasks'])) ?> tasks</span>
            </a>
        <?php endforeach; ?>
    </nav>

    <!-- Search and department filters: shown only once site.js is running. -->
    <div data-solutions-controls class="hidden mb-8">
        <label for="solutions-search" class="sr-only">Search tasks</label>
        <div class="relative max-w-xl mb-3">
            <?= icon('magnifying-glass', 'w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none') ?>
            <input id="solutions-search" type="search" data-solutions-search autocomplete="off" spellcheck="false"
                placeholder="Search tasks, e.g. churn, invoices, defects"
                class="form-field pl-10">
        </div>
        <div role="group" aria-label="Filter by department" class="flex flex-wrap gap-2">
            <?php foreach ($depts as $dept => $n): ?>
                <button type="button" data-dept-chip="<?= e($dept) ?>" aria-pressed="false"
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors bg-white dark:bg-[#3a3d48] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:border-brandPrimary hover:text-brandPrimary aria-pressed:bg-teal-700 aria-pressed:text-white aria-pressed:border-teal-700 aria-pressed:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brandPrimary">
                    <?= e($dept) ?> <span class="opacity-60 font-medium"><?= e($n) ?></span>
                </button>
            <?php endforeach; ?>
        </div>
        <p data-solutions-status class="mt-4 text-sm text-gray-500 dark:text-gray-400" aria-live="polite"></p>
    </div>

    <?php foreach ($products as $p):
        $base = modelscore_base($p); ?>
        <section id="<?= e($p['key']) ?>" data-product-section aria-labelledby="<?= e($p['key']) ?>-title"
            class="mc-product mb-16 last:mb-0"
            style="--mc-light: <?= e(mc_rgb($p['colors']['primary'])) ?>; --mc-dark: <?= e(mc_rgb($p['colors']['primary_dark'])) ?>; --mc-accent: <?= e(mc_rgb($p['colors']['accent'])) ?>;">

            <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
                <div class="max-w-3xl">
                    <h2 id="<?= e($p['key']) ?>-title" class="font-headline font-bold text-3xl text-gray-900 dark:text-white mb-2">SymNexus<span class="mc-text-gradient"><?= e($p['word']) ?></span></h2>
                    <p class="font-sans text-lg font-medium text-gray-800 dark:text-gray-100 mb-2"><?= e($p['tagline']) ?></p>
                    <p class="body-copy text-sm"><?= e($p['lead']) ?></p>
                </div>
                <div class="flex flex-wrap gap-2 flex-shrink-0">
                    <a href="<?= e($base . '/') ?>"
                        class="mc-task mc-focus inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 text-sm font-semibold bg-white dark:bg-[#3a3d48] text-gray-900 dark:text-white transition-colors">
                        Visit <?= e($p['name']) ?>
                        <?= icon('arrow-right', 'w-4 h-4') ?>
                    </a>
                </div>
            </div>

            <div class="rounded-2xl bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-gray-700/50 p-3 sm:p-4">
                <div class="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <?php foreach ($p['tasks'] as $i => $t): ?>
                        <a href="<?= e($base . $t['path']) ?>" data-task data-dept="<?= e($t['dept']) ?>"
                            data-search="<?= e(mb_strtolower($t['title'] . ' ' . $t['dept'] . ' ' . $t['sub'] . ' ' . $p['word'])) ?>"
                            class="mc-task <?= $i === 0 ? 'mc-selected' : '' ?> bg-white dark:bg-[#3a3d48] text-gray-900 dark:text-white mc-focus group flex flex-col items-center justify-center text-center rounded-xl border-2 px-4 py-4 min-h-[88px] transition-all duration-200">
                            <span class="mb-2 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                                <img src="<?= e(asset('images/tasks/' . $t['icon'])) ?>" alt="" width="40" height="40" class="w-9 h-9 object-contain" loading="lazy" decoding="async">
                            </span>
                            <span class="font-sans font-semibold text-base sm:text-lg leading-snug"><?= e($t['title']) ?></span>
                            <span class="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400"><?= e($t['dept']) ?> · <?= e($t['sub']) ?></span>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>
    <?php endforeach; ?>

    <div data-solutions-empty class="hidden card text-center">
        <p class="font-sans font-semibold text-gray-900 dark:text-white mb-2" data-solutions-empty-text>No tasks match.</p>
        <p class="body-copy text-sm mb-5">Try another word, or tell us about your project and we'll point you to the right task.</p>
        <div class="flex flex-wrap justify-center gap-3">
            <button type="button" data-solutions-all class="btn-primary hidden">Search all tasks</button>
            <button type="button" data-solutions-clear class="btn-secondary">Clear filters</button>
        </div>
    </div>
</div>

<?php partial('cta', [
    'title'     => 'Not sure which model fits?',
    'body'      => 'Tell us what you are trying to predict, find or automate. Our engineers will map it to the right model and prove it on your own data.',
    'primary'   => ['label' => PRIMARY_CTA['label'], 'href' => PRIMARY_CTA['href'] . '?interest=custom'],
    'secondary' => ['label' => 'Our services', 'href' => '/services'],
]); ?>

<?php require SRC_DIR . '/includes/footer.php'; ?>
