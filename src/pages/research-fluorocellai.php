<?php
$pageTitle = 'Case Study: FluorocellAI in a Cancer-Research Lab — SymNexus';
$pageMeta  = [
    'description' => 'A cancer-research lab\'s cell-analysis workflow, before and after FluorocellAI: from roughly three to four days of manual review to same-day turnaround.',
    'og_type'     => 'article',
    'og_image'    => SITE_URL . asset('images/fluorocellai-segmentation.webp'),
    'jsonld'      => [
        '@context'         => 'https://schema.org',
        '@type'            => 'Article',
        'headline'         => 'FluorocellAI, in a cancer-research lab.',
        'description'      => 'A cancer-research lab\'s cell-analysis workflow, before and after FluorocellAI.',
        'image'            => SITE_URL . asset('images/fluorocellai-segmentation.webp'),
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
        <a href="/research" class="inline-flex items-center text-sm font-sans font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-500 transition-colors group">
            <?= icon('arrow-left', 'w-4 h-4 mr-2 transform group-hover:-translate-x-0.5 transition-transform') ?>
            All case studies
        </a>
    </div>

    <div class="mb-8 border-b border-gray-200 dark:border-gray-700/60 pb-8">
        <div class="mb-4 flex flex-wrap items-center gap-2 text-xs font-sans text-gray-600 dark:text-gray-300 font-medium">
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

    <figure class="mb-10">
        <div class="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-black shadow-xl">
            <img src="<?= e(asset('images/fluorocellai-segmentation.webp')) ?>" alt="FluorocellAI segmentation output: fluorescent cell nuclei, each outlined by an automatically detected boundary" class="w-full h-full object-cover" fetchpriority="high">
        </div>
        <figcaption class="mt-3 text-xs text-gray-500 dark:text-gray-400">FluorocellAI output: every nucleus detected and outlined automatically.</figcaption>
    </figure>

    <dl class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        <?php foreach ([['Client', 'Cancer-research lab'], ['Built', 'Computer vision · QC · audit trail'], ['Result', '3–4 days → same day']] as [$k, $v]): ?>
            <div class="card-inset p-4">
                <dt class="font-mono text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400"><?= e($k) ?></dt>
                <dd class="mt-1 font-sans text-sm font-bold text-gray-900 dark:text-white"><?= e($v) ?></dd>
            </div>
        <?php endforeach; ?>
    </dl>

    <article class="font-body text-base leading-relaxed text-gray-600 dark:text-gray-300 space-y-6">
        <h2 class="font-headline text-2xl font-bold tracking-tight text-gray-900 dark:text-white">The challenge</h2>
        <p>
            The lab's cell-analysis workflow ran on manual cross-referencing: after slide prep and imaging, researchers
            counted cells by hand, re-counted for QC, then wrote up the results. A single analysis took roughly three
            to four days, and every hour spent counting was an hour not spent on the research itself.
        </p>

        <h2 class="font-headline text-2xl font-bold tracking-tight text-gray-900 dark:text-white pt-4">What we built</h2>
        <p>
            FluorocellAI: fine-tuned models that segment and count cells automatically, with automatic QC and an audit
            trail behind every result, validated by working cell biologists. A REST API connects it to the lab's
            existing pipeline, so slide prep and imaging stay exactly as they were.
        </p>
        <h2 class="font-headline text-2xl font-bold tracking-tight text-gray-900 dark:text-white pt-4">Before FluorocellAI</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <?php foreach ($before as [$label, $value]): ?>
                <div class="rounded-xl bg-white dark:bg-slate-800/60 border border-gray-200/80 dark:border-slate-700/50 p-4 text-center">
                    <p class="text-[0.7rem] text-gray-500 dark:text-gray-300"><?= e($label) ?></p>
                    <p class="mt-1 font-sans text-sm font-bold text-gray-900 dark:text-white"><?= e($value) ?></p>
                </div>
            <?php endforeach; ?>
        </div>

        <h2 class="font-headline text-2xl font-bold tracking-tight text-gray-900 dark:text-white pt-4">With FluorocellAI</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <?php foreach ($after as [$label, $value]): ?>
                <div class="rounded-xl bg-brandPrimary/10 border border-brandPrimary/30 p-4 text-center">
                    <p class="text-[0.7rem] text-teal-800 dark:text-teal-300"><?= e($label) ?></p>
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
        'title'   => 'Have a manual process like this one?',
        'body'    => 'Book a 30-minute scoping call with the engineers who built FluorocellAI, or request a FluorocellAI demonstration on your own images.',
        'primary' => PRIMARY_CTA,
        'secondary' => ['label' => 'About FluorocellAI', 'href' => '/fluorocellai'],
    ]); ?>
</div>

<?php require SRC_DIR . '/includes/footer.php'; ?>
