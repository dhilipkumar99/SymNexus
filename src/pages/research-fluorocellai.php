<?php
$pageTitle = 'FluorocellAI, in a cancer-research lab — Symnexus Research';
$pageMeta  = [
    'description' => 'A cancer-research lab\'s cell-analysis workflow, before and after FluorocellAI: from roughly three to four days of manual review to same-day turnaround.',
    'og_type'     => 'article',
    'og_image'    => img('fluoroCells', 1200),
    'jsonld'      => [
        '@context'         => 'https://schema.org',
        '@type'            => 'Article',
        'headline'         => 'FluorocellAI, in a cancer-research lab.',
        'description'      => 'A cancer-research lab\'s cell-analysis workflow, before and after FluorocellAI.',
        'image'            => img('fluoroCells', 1200),
        'author'           => ['@type' => 'Organization', 'name' => SITE_NAME, 'url' => SITE_URL],
        'publisher'        => ['@type' => 'Organization', 'name' => SITE_NAME, 'url' => SITE_URL],
        'mainEntityOfPage' => SITE_URL . '/research/fluorocellai-cancer-research-lab',
    ],
];

$before = [['Slide prep & imaging', 'Same'], ['Manual counting', '1–2 days'], ['Manual QC / re-count', '~1 day'], ['Reporting & write-up', '~1 day']];
$after  = [['Slide prep & imaging', 'Unchanged'], ['Automated counting', 'Minutes'], ['Automated QC', 'Automatic'], ['Reporting', 'Same day']];

require SRC_DIR . '/includes/header.php';
?>

<div class="w-full max-w-3xl mx-auto py-4">

    <div class="mb-8">
        <a href="/research" class="inline-flex items-center text-sm font-sans font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 transition-colors group">
            <?= icon('arrow-left', 'w-4 h-4 mr-2 transform group-hover:-translate-x-0.5 transition-transform') ?>
            Back to Research
        </a>
    </div>

    <div class="mb-8 border-b border-gray-200 dark:border-gray-700/60 pb-8">
        <div class="mb-4 flex flex-wrap items-center gap-2 text-xs font-sans text-gray-500 dark:text-gray-400 font-medium">
            <span class="flex items-center pl-3.5 relative">
                <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
                    <span class="h-3 w-0.5 rounded-full bg-teal-500"></span>
                </span>
                FluorocellAI
            </span>
            <span class="text-gray-300 dark:text-gray-600" aria-hidden="true">•</span>
            <span class="badge">Case Study</span>
        </div>
        <h1 class="font-headline text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
            FluorocellAI, in a cancer-research lab.
        </h1>
    </div>

    <div class="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-slate-900 mb-10 shadow-xl">
        <img src="<?= e(img('fluoroCells', 1600)) ?>" alt="Fluorescence microscopy of cells, the kind FluorocellAI analyzes" class="w-full h-full object-cover" fetchpriority="high">
    </div>

    <article class="font-body text-base leading-relaxed text-gray-600 dark:text-gray-400 space-y-6">
        <p>
            A cancer-research lab's cell-analysis workflow, before and after FluorocellAI. FluorocellAI compresses manual
            review of cells from a week of manual cross-referencing to a same-day first pass.
        </p>

        <h2 class="font-headline text-2xl font-bold tracking-tight text-gray-900 dark:text-white pt-4">Before FluorocellAI</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <?php foreach ($before as [$label, $value]): ?>
                <div class="rounded-xl bg-white dark:bg-slate-800/60 border border-gray-200/80 dark:border-slate-700/50 p-4 text-center">
                    <p class="text-[0.7rem] text-gray-500 dark:text-gray-400"><?= e($label) ?></p>
                    <p class="mt-1 font-sans text-sm font-bold text-gray-900 dark:text-white"><?= e($value) ?></p>
                </div>
            <?php endforeach; ?>
        </div>

        <h2 class="font-headline text-2xl font-bold tracking-tight text-gray-900 dark:text-white pt-4">With FluorocellAI</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <?php foreach ($after as [$label, $value]): ?>
                <div class="rounded-xl bg-brandPrimary/10 border border-brandPrimary/30 p-4 text-center">
                    <p class="text-[0.7rem] text-teal-700 dark:text-teal-300"><?= e($label) ?></p>
                    <p class="mt-1 font-sans text-sm font-bold text-teal-900 dark:text-white"><?= e($value) ?></p>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="bg-gray-50 dark:bg-slate-800/40 p-4 rounded-lg border-l-4 border-brandPrimary">
            <p class="text-gray-700 dark:text-gray-300">
                <strong class="font-semibold text-gray-900 dark:text-white">Net effect:</strong> a workflow that took roughly
                three to four days manually compresses to same-day turnaround — without changing how the lab prepares or
                images its samples.
            </p>
        </div>
    </article>

    <?php partial('cta', [
        'title'   => 'Want to see this on your own data?',
        'body'    => 'Request a Demonstration and we\'ll walk through FluorocellAI or ComplianceCall using your own workflow as the basis.',
        'primary' => ['label' => 'Request a Demonstration', 'href' => '/demo'],
        'secondary' => ['label' => 'About FluorocellAI', 'href' => '/fluorocellai'],
    ]); ?>
</div>

<?php require SRC_DIR . '/includes/footer.php'; ?>
