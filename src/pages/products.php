<?php
$pageTitle = 'Products — Symnexus';
$pageMeta  = [
    'description' => 'FluorocellAI: AI-automated cell image analysis. ComplianceCall: live pharmaceutical compliance tracking against federal regulation. Plus custom systems built for other fields, like Yashara\'s retail operations.',
    'og_image'    => img('fluoroCells', 1200),
];

$media = [
    'fluorocellai' => [
        ['asset' => 'images/fluorocellai-segmentation.webp', 'small' => 'images/fluorocellai-segmentation-800.webp', 'width' => 1494, 'smallWidth' => 800,
         'alt' => 'FluorocellAI segmentation output: fluorescent cell nuclei, each outlined by an automatically detected boundary'],
        ['img' => 'fluoroCells', 'alt' => 'Fluorescence microscopy of cells, the kind FluorocellAI analyzes'],
        ['img' => 'fluoroHero',  'alt' => 'Fluorescent-stained cells under a microscope'],
    ],
    'compliancecall' => [
        ['asset' => 'images/compliancecall-dashboard.webp', 'small' => 'images/compliancecall-dashboard-900.webp', 'width' => 1952, 'smallWidth' => 900, 'fit' => 'object-contain',
         'alt' => 'ComplianceCall dashboard: compliance audit readiness by framework, vulnerability response and security operations panels'],
        ['img' => 'complianceDesk', 'alt' => 'Compliance documents and data reviewed at a desk'],
    ],
];

require SRC_DIR . '/includes/header.php';
?>

<?php partial('page-header', [
    'eyebrow' => 'Products',
    'title'   => 'AI Agents to',
    'highlight' => 'Maximize Efficiency',
    'lead'    => 'SymNexus employs a team of Silicon Valley educated and trained machine learning engineers to develop custom AI solutions for high-throughput industries, using the latest AI/ML models produced in the Bay Area. SymNexus has built two large-scale products for industries in the United States and Canada; it is now building out solutions globally.',
]); ?>

<a href="/solutions"
    class="group mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-inset hover:border-brandPrimary/60 transition-colors">
    <span>
        <span class="pill mb-2">SymNexus product family</span>
        <span class="block font-sans text-xl font-bold text-gray-900 dark:text-white">Nine products, ready-made tasks for every department</span>
        <span class="block body-copy text-sm mt-1">Predict, Forecast, Sentinel, Extract, Gen, Vision, Match, Decide and Voice. Find the task that fits your work and plan a project in minutes.</span>
    </span>
    <span class="btn-primary flex-shrink-0">
        Browse solutions
        <?= icon('arrow-right', 'w-4 h-4 animate-drop-twice') ?>
    </span>
</a>

<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <?php foreach (PRODUCTS as $slug => $p): ?>
        <article id="<?= e($slug) ?>"
            class="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-800 flex flex-col justify-between transition-all duration-200 hover:shadow-lg <?= isset($media[$slug]) ? '' : 'md:col-span-2' ?>">

            <?php if (isset($media[$slug])): ?>
                <?php partial('carousel', ['label' => $p['name'] . ' media', 'slides' => $media[$slug]]); ?>
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
    <?php endforeach; ?>
</div>


<?php partial('cta', [
    'title'     => 'Ready to see these on your own data?',
    'body'      => 'Our scientific and engineering staff build every demonstration around your specific workflow, skipping the generic product tour.',
    'primary'   => ['label' => 'Request a Demonstration', 'href' => '/demo'],
    'secondary' => ['label' => 'View Pricing', 'href' => '/pricing'],
]); ?>

<?php require SRC_DIR . '/includes/footer.php'; ?>
