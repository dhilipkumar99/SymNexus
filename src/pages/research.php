<?php
$pageTitle = 'Case Studies — SymNexus';
$pageMeta  = [
    'description' => 'AI systems SymNexus has built and deployed: FluorocellAI in a cancer-research lab, and AI inventory monitoring and wholesale-account automation for an overseas retailer.',
];

$entries = [
    [
        'href'      => '/research/fluorocellai-cancer-research-lab',
        'title'     => 'FluorocellAI, in a cancer-research lab.',
        'category'  => 'Case Study',
        'meta'      => 'FluorocellAI',
        'excerpt'   => 'A cancer-research lab\'s cell-analysis workflow, before and after FluorocellAI. FluorocellAI compresses manual review of cells from a week of manual cross-referencing to a same-day first pass.',
        'thumbnail' => ['asset' => 'images/fluorocellai-segmentation-800.webp'],
    ],
    [
        'href'      => '/research/yashara-retail-ai',
        'title'     => 'AI monitoring and wholesale automation for an overseas retailer.',
        'category'  => 'Case Study',
        'meta'      => 'Custom AI system · Yashara',
        'excerpt'   => 'An ethically-sourced goods retailer, two AI systems: one that watches inventory and product quality across the catalog, and one that handles large wholesale accounts and hands exceptions to a person.',
        'thumbnail' => null,
    ],
];

require SRC_DIR . '/includes/header.php';
?>

<div class="w-full max-w-4xl mx-auto py-4">

    <div class="mb-12 border-b border-gray-200 dark:border-gray-700/60 pb-8">
        <p class="badge mb-5">Case Studies</p>
        <h1 class="font-headline text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
            AI we&rsquo;ve built, and what changed.
        </h1>
        <p class="font-body text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl">
            Before-and-after looks at systems our engineers designed, built and deployed, from a cancer-research lab
            to an overseas retailer.
        </p>
    </div>

    <div class="flex flex-col divide-y divide-gray-200 dark:divide-gray-700/60">
        <?php foreach ($entries as $i => $entry): ?>
            <article class="group relative flex flex-col sm:flex-row items-stretch gap-6 <?= $i === 0 ? 'pb-8' : 'py-8' ?>">
                <div class="absolute -inset-x-4 -inset-y-2 z-0 scale-95 bg-gray-200/40 dark:bg-gray-800/30 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 rounded-2xl sm:-inset-x-6" aria-hidden="true"></div>

                <div class="relative z-10 w-full sm:w-[240px] aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900/40 flex-shrink-0">
                    <?php if ($entry['thumbnail'] !== null): ?>
                        <img src="<?= e(asset($entry['thumbnail']['asset'])) ?>" alt="" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                    <?php else: ?>
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-700 to-emerald-900 text-white"><?= icon('globe', 'w-10 h-10 opacity-80') ?></div>
                    <?php endif; ?>
                </div>

                <div class="relative z-10 w-full flex flex-col justify-center">
                    <div class="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-300 font-body">
                        <span class="flex items-center pl-3.5 relative">
                            <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
                                <span class="h-3 w-0.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                            </span>
                            <?= e($entry['meta']) ?>
                        </span>
                        <span class="text-gray-300 dark:text-gray-600" aria-hidden="true">•</span>
                        <span class="badge"><?= e($entry['category']) ?></span>
                    </div>

                    <h2 class="font-headline text-lg md:text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                        <a href="<?= e($entry['href']) ?>">
                            <span class="absolute -inset-x-4 -inset-y-2 z-20 sm:-inset-x-6 rounded-2xl"></span>
                            <span class="relative z-10 group-hover:text-brandPrimary transition-colors duration-200"><?= e($entry['title']) ?></span>
                        </a>
                    </h2>

                    <p class="font-body text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 max-w-3xl"><?= e($entry['excerpt']) ?></p>

                    <div aria-hidden="true" class="flex items-center text-xs md:text-sm font-medium text-teal-700 dark:text-teal-500 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                        Read case study
                        <?= icon('arrow-up-right', 'ml-1 h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200') ?>
                    </div>
                </div>
            </article>
        <?php endforeach; ?>
    </div>

    <!-- The FluorocellAI product card from the About page, with its first image only. -->
    <div class="mt-10">
        <?php partial('product-card', [
            'slug'   => 'fluorocellai',
            'p'      => PRODUCTS['fluorocellai'],
            'slides' => array_slice(PRODUCT_MEDIA['fluorocellai'], 0, 1),
        ]); ?>
    </div>
</div>

<?php partial('cta', [
    'title'     => 'Want results like these on your own data?',
    'body'      => 'Book a 30-minute scoping call with the engineers who built these systems.',
    'primary'   => PRIMARY_CTA,
    'secondary' => ['label' => 'Our services', 'href' => '/services'],
]); ?>

<?php require SRC_DIR . '/includes/footer.php'; ?>
