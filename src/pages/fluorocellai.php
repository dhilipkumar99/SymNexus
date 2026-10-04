<?php
$pageTitle = 'FluorocellAI — SymNexus';
$pageMeta  = [
    'description' => 'FluorocellAI: AI-automated cell identification, counting, and analysis for cell and cancer research labs. A same-day first pass, without changing how you prepare or image samples.',
    'og_image'    => img('fluoroCells', 1200),
    'jsonld'      => [
        '@context'            => 'https://schema.org',
        '@type'               => 'SoftwareApplication',
        'name'                => 'FluorocellAI',
        'applicationCategory' => 'BusinessApplication',
        'operatingSystem'     => 'Web',
        'description'         => 'AI-automated cell identification, counting, and analysis for cell and cancer research labs.',
        'url'                 => SITE_URL . '/fluorocellai',
        'publisher'           => ['@type' => 'Organization', 'name' => SITE_NAME, 'url' => SITE_URL],
    ],
];

$pipeline = [
    ['01', 'Slide Prep & Imaging',   'Unchanged — FluorocellAI works with your existing imaging setup'],
    ['02', 'Automated Segmentation', 'Cell identification and counting, in minutes rather than days'],
    ['03', 'Automated QC',           'Audit trail generated automatically behind every result'],
    ['04', 'Reporting',              'Same-day write-up, ready for downstream analysis'],
];

$capabilities = [
    ['icon' => 'squares',      'title' => 'Automated segmentation & counting', 'body' => 'Cell identification and counting that took one to two days manually now runs in minutes, matching expert-level annotation.'],
    ['icon' => 'shield-check', 'title' => 'Automatic QC & audit trail',        'body' => 'Every result carries an automatic QC pass and a built-in audit trail — no separate manual re-count step required.'],
    ['icon' => 'clock',        'title' => 'Same-day reporting',                'body' => 'Write-up and reporting generate automatically, ready for downstream analysis the same day imaging completes.'],
    ['icon' => 'beaker',       'title' => 'Unchanged slide prep',              'body' => 'FluorocellAI works with your existing imaging setup — slide prep and imaging are not disrupted by adoption.'],
    ['icon' => 'database',     'title' => 'Compounding proprietary data',      'body' => 'Every deployment adds annotated microscopy data back into our proprietary dataset, a compounding advantage a generic tool cannot replicate.'],
    ['icon' => 'users',        'title' => 'Validated by working scientists',   'body' => 'We build it in close collaboration with cancer-research labs and academic cell-biology cores, instead of shipping it generic and adapting it after the fact.'],
];

$useCases = [
    ['role' => 'Cancer-Research Institutes',  'img' => 'labEquipment',    'desc' => 'Compress cell-analysis turnaround from days to a same-day first pass, without changing established imaging protocols.'],
    ['role' => 'Academic Cell-Biology Cores', 'img' => 'microscopeSetup', 'desc' => 'Offer AI-assisted counting and analysis as a core facility service, integrated into existing lab workflows.'],
    ['role' => 'CROs & Pharma/Biotech R&D',   'img' => 'labSamples',      'desc' => 'Scale cell-analysis throughput across client programs without proportionally scaling headcount.'],
    ['role' => 'Regulatory Affairs Teams',    'img' => 'phytoplankton',   'desc' => 'Rely on automatic QC and a built-in audit trail for cell-analysis data that supports regulatory submissions.'],
];

require SRC_DIR . '/includes/header.php';
?>

<a href="/about#products" class="inline-flex items-center text-sm font-sans font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-500 transition-colors group mb-8">
    <?= icon('arrow-left', 'w-4 h-4 mr-2 transform group-hover:-translate-x-0.5 transition-transform') ?>
    Back to About
</a>

<?php partial('page-header', [
    'eyebrow' => 'Imaging & Cell Analysis',
    'title'   => 'FluorocellAI',
    'lead'    => 'AI-automated cell identification, counting, and analysis for cell and cancer research labs. A workflow that took roughly three to four days manually compresses to same-day turnaround — without changing how the lab prepares or images its samples.',
]); ?>

<div class="flex flex-wrap gap-3 -mt-4 mb-12">
    <a href="/demo?interest=fluorocellai" class="btn-primary group">Request a demonstration <?= icon('arrow-right', 'w-4 h-4 animate-drop-twice') ?></a>
    <a href="/pricing#fluorocellai" class="btn-secondary">View Pricing</a>
</div>

<div class="relative w-full max-w-4xl aspect-[16/7] rounded-3xl overflow-hidden shadow-2xl border border-white/5 mb-16">
    <img src="<?= e(img('fluoroCells', 1600)) ?>" alt="Fluorescence microscopy of cells, the kind FluorocellAI analyzes" class="w-full h-full object-cover" fetchpriority="high">
    <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
</div>

<!-- Overview -->
<section id="overview" class="grid grid-cols-1 lg:grid-cols-5 gap-12 py-12" aria-labelledby="overview-title">
    <div class="lg:col-span-3 space-y-5 body-copy">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">Platform Overview</p>
        <h2 id="overview-title" class="section-title">The accuracy you couldn't achieve manually, at same-day turnaround.</h2>
        <p>
            FluorocellAI slots into the workflow your lab already runs — slide prep and imaging stay unchanged. What used
            to be one to two days of manual counting and annotation, plus a further day each of manual QC and reporting,
            becomes minutes of automated segmentation and counting with an automatic QC and audit trail behind it. Manual
            counts also drift — between technicians, and within the same technician across a long session — which is
            exactly what a reviewer questions first; automated segmentation returns the same count on the same slide
            every time.
        </p>
        <p class="text-sm">
            We build it on our proprietary machine learning models, and working cell biologists validate it — we don't
            ship it generic and adapt it after the fact. Every deployment adds annotated microscopy data back into our
            proprietary dataset, compounding accuracy over time.
        </p>
    </div>

    <div class="lg:col-span-2 card-inset h-fit">
        <div class="flex items-center gap-3 mb-6">
            <div class="text-gray-500 dark:text-teal-400"><?= icon('squares', 'w-5 h-5') ?></div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">Analysis Pipeline</h3>
        </div>
        <ol class="space-y-5">
            <?php foreach ($pipeline as [$step, $title, $detail]): ?>
                <li class="flex items-start gap-4">
                    <span class="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brandPrimary text-[0.65rem] font-bold text-white dark:text-slate-950"><?= e($step) ?></span>
                    <div>
                        <p class="text-sm font-semibold text-gray-900 dark:text-white"><?= e($title) ?></p>
                        <p class="mt-0.5 text-xs leading-relaxed text-gray-500 dark:text-gray-300"><?= e($detail) ?></p>
                    </div>
                </li>
            <?php endforeach; ?>
        </ol>
    </div>
</section>

<!-- Pull quote -->
<figure class="my-8 max-w-3xl border-l-4 border-brandPrimary bg-white dark:bg-slate-800/40 rounded-r-2xl p-6 sm:p-8 shadow-sm">
    <blockquote class="font-headline text-xl md:text-2xl font-medium leading-relaxed text-gray-900 dark:text-white">
        &ldquo;A workflow that took roughly three to four days manually compresses to same-day turnaround — without changing how the lab prepares or images its samples.&rdquo;
    </blockquote>
    <figcaption class="mt-4 font-mono text-[11px] uppercase tracking-widest text-gray-500 dark:text-gray-300">Cancer-research lab — FluorocellAI pilot customer</figcaption>
</figure>

<!-- Capabilities -->
<section class="py-16" aria-labelledby="capabilities-title">
    <div class="mb-6 md:mb-8 max-w-3xl">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">Capabilities</p>
        <h2 id="capabilities-title" class="section-title">Built for every fluorescence microscopy workflow.</h2>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <?php foreach ($capabilities as $c): ?>
            <div class="card flex flex-col h-full">
                <div class="icon-badge mb-6"><?= icon($c['icon'], 'w-5 h-5') ?></div>
                <h3 class="font-sans text-lg font-bold text-gray-900 dark:text-white mb-2"><?= e($c['title']) ?></h3>
                <p class="font-body text-gray-600 dark:text-gray-300 text-sm leading-relaxed"><?= e($c['body']) ?></p>
            </div>
        <?php endforeach; ?>
    </div>
</section>

<!-- Use cases -->
<section class="py-12" aria-labelledby="usecases-title">
    <div class="mb-6 md:mb-8">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">Use Cases</p>
        <h2 id="usecases-title" class="section-title">Who uses FluorocellAI.</h2>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <?php foreach ($useCases as $uc): ?>
            <article class="group bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-800 transition-all duration-200 hover:shadow-lg">
                <div class="relative h-36 overflow-hidden">
                    <img src="<?= e(img($uc['img'], 600)) ?>" alt="" loading="lazy" decoding="async" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div class="p-5">
                    <h3 class="font-sans text-sm font-bold text-gray-900 dark:text-white"><?= e($uc['role']) ?></h3>
                    <p class="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300"><?= e($uc['desc']) ?></p>
                </div>
            </article>
        <?php endforeach; ?>
    </div>
</section>

<?php partial('cta', [
    'title'     => 'Begin your FluorocellAI evaluation.',
    'body'      => 'We tailor every evaluation to your imaging modality, cell type, and existing pipeline. Our scientific team guides the process from installation to your first publication-quality output.',
    'note'      => 'Working in a different domain entirely? We build custom AI systems well beyond imaging. <a href="/services" class="link-inline">See our AI development services</a>.',
    'primary'   => ['label' => 'Request a demonstration', 'href' => '/demo?interest=fluorocellai'],
    'secondary' => ['label' => 'View Pricing', 'href' => '/pricing#fluorocellai'],
]); ?>

<?php require SRC_DIR . '/includes/footer.php'; ?>
