<?php
$pageTitle = 'SymNexus — Custom AI Software Development | Silicon Valley Engineers';
$pageMeta  = [
    'description' => SITE_DESCRIPTION,
];

// Shipped systems, presented as proof of the service.
$proof = [
    [
        'category' => 'Life sciences · Computer vision',
        'name'     => 'FluorocellAI',
        'outcome'  => '3–4 days of manual cell review → a same-day first pass',
        'body'     => 'Automated segmentation, counting and QC for cancer-research labs, with an audit trail behind every result and no change to how the lab prepares its slides.',
        'image'    => ['images/fluorocellai-segmentation-800.webp', 800, 'FluorocellAI segmentation output: fluorescent cell nuclei, each outlined by an automatically detected boundary', 'object-cover'],
        'links'    => [['Read the case study', '/research/fluorocellai-cancer-research-lab'], ['Product', '/fluorocellai']],
    ],
    [
        'category' => 'Pharma · Regulatory compliance',
        'name'     => 'ComplianceCall',
        'outcome'  => 'A continuously auditable record, instead of reconstructing history at audit time',
        'body'     => 'Benchmarks pharmaceutical development against current federal regulation and tracks what each chemical\'s hazard category used to be, and why it changed.',
        'image'    => ['images/compliancecall-dashboard-900.webp', 900, 'ComplianceCall dashboard: compliance audit readiness by framework, vulnerability response and security operations panels', 'object-contain bg-white'],
        'links'    => [['Product', '/compliancecall']],
    ],
    [
        'category' => 'Retail & wholesale · Agents and monitoring',
        'name'     => 'Yashara',
        'outcome'  => 'Inventory and quality issues flagged before they reach a customer',
        'body'     => 'For an ethically-sourced goods retailer operating overseas: AI monitoring across the catalog, plus an AI layer that handles large wholesale accounts and escalates exceptions to a person.',
        'image'    => null,
        'links'    => [['Read the case study', '/research/yashara-retail-ai']],
    ],
];

$why = [
    ['icon' => 'users',        'title' => 'Senior engineers only',          'body' => 'The engineers who scope your project are the ones who build it: Silicon Valley engineers from Amazon, Zoom, ServiceNow and NXP, with Stanford- and Berkeley-trained researchers.'],
    ['icon' => 'check',        'title' => 'Proven on your data first',      'body' => 'We prove the model on your own data before you commit to a build, so you decide on evidence rather than a demo of someone else\'s data.'],
    ['icon' => 'squares',      'title' => 'Built around your workflow',     'body' => 'We fit AI into the tools and processes your team already uses, and the people who use it validate it before it goes live.'],
    ['icon' => 'shield-check', 'title' => 'Production-grade and auditable', 'body' => 'Every system ships with an audit trail and access controls by design, a standard we built for FDA-regulated customers, and we train your team to run it independently.'],
];

require SRC_DIR . '/includes/header.php';
?>

<!-- HERO -->
<p class="badge mb-5 self-start">Custom AI software development</p>
<h1 class="font-sans text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight max-w-4xl transition-colors duration-300">
    Production AI systems, built around <span class="text-brandPrimary">how your business already works.</span>
</h1>

<p class="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-10 transition-colors duration-300">
    SymNexus is a Silicon Valley engineering team that designs, builds and deploys AI for businesses: agents,
    document automation, computer vision and forecasting. We prove it on your own data before you commit, then
    build it into your workflow.
</p>

<div class="flex flex-wrap items-center gap-x-6 gap-y-4 mb-12">
    <a href="<?= e(PRIMARY_CTA['href']) ?>" data-cta="home-hero" class="btn-primary group">
        <?= e(PRIMARY_CTA['label']) ?>
        <?= icon('arrow-right', 'w-4 h-4 animate-drop-twice') ?>
    </a>
    <a href="/research" class="btn-secondary">See our work</a>
    <a href="/video" data-film-trigger data-no-spa class="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-brandPrimary transition-colors">
        <span class="flex h-8 w-8 items-center justify-center rounded-full bg-teal-700 text-white" aria-hidden="true"><?= icon('play', 'w-3.5 h-3.5') ?></span>
        Watch the 1-minute overview
    </a>
</div>

<?php partial('team-pedigree'); ?>

<div class="mt-12">
    <?php partial('logo-frame'); ?>
</div>

<!-- WHAT WE BUILD -->
<section class="panel mt-6" aria-labelledby="build-title">
    <div class="mb-6 md:mb-8 max-w-3xl">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">What we build</p>
        <h2 id="build-title" class="section-title">AI that does real work inside your business.</h2>
        <p class="section-lead">From a single assistant to a system that runs across every site, we engineer each one around your data, your tools and the people who will use it.</p>
    </div>

    <?php partial('service-capabilities'); ?>

    <div class="mt-10">
        <a href="/services" class="link-arrow group">
            How we work and what an engagement includes
            <?= icon('chevron-right', 'w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform') ?>
        </a>
    </div>
</section>

<!-- SHIPPED IN PRODUCTION -->
<section class="panel mt-10" aria-labelledby="proof-title">
    <div class="mb-6 md:mb-8 max-w-3xl">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">Shipped in production</p>
        <h2 id="proof-title" class="section-title">Systems we&rsquo;ve built and deployed.</h2>
        <p class="section-lead">In cancer-research labs, FDA-regulated pharmaceutical teams and overseas retail, for clients in the United States, Canada and beyond.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <?php foreach ($proof as $p): ?>
            <article class="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-800 flex flex-col">
                <?php if ($p['image'] !== null): ?>
                    <?php [$src, $w, $alt, $fit] = $p['image']; ?>
                    <img src="<?= e(asset($src)) ?>" alt="<?= e($alt) ?>" width="<?= (int) $w ?>" height="<?= (int) round($w * 9 / 16) ?>" loading="lazy" decoding="async"
                        class="w-full aspect-video <?= e($fit) ?> border-b border-gray-100 dark:border-slate-800">
                <?php else: ?>
                    <div class="w-full aspect-video flex items-center justify-center bg-gradient-to-br from-teal-700 to-emerald-900 text-white border-b border-gray-100 dark:border-slate-800" aria-hidden="true">
                        <?= icon('globe', 'w-14 h-14 opacity-80') ?>
                    </div>
                <?php endif; ?>
                <div class="p-6 flex flex-col flex-grow">
                    <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2"><?= e($p['category']) ?></p>
                    <h3 class="font-sans text-xl font-bold text-gray-900 dark:text-white mb-3"><?= e($p['name']) ?></h3>
                    <p class="font-sans text-sm font-semibold text-gray-900 dark:text-white mb-3"><?= e($p['outcome']) ?></p>
                    <p class="font-body text-sm leading-relaxed text-gray-600 dark:text-gray-300 flex-grow"><?= e($p['body']) ?></p>
                    <div class="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-200/60 dark:border-gray-700/40">
                        <?php foreach ($p['links'] as $i => [$label, $href]): ?>
                            <a href="<?= e($href) ?>" class="<?= $i === 0 ? 'text-teal-700 dark:text-teal-400 font-semibold' : 'text-gray-600 dark:text-gray-300 font-medium' ?> hover:text-emerald-600 dark:hover:text-emerald-400 text-sm inline-flex items-center transition-colors">
                                <?= e($label) ?>
                                <?php if ($i === 0): ?><?= icon('arrow-right', 'w-3.5 h-3.5 ml-1') ?><?php endif; ?>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </div>
            </article>
        <?php endforeach; ?>
    </div>
</section>

<!-- HOW WE WORK -->
<section class="panel mt-10" aria-labelledby="process-title">
    <div class="mb-6 md:mb-8 max-w-3xl">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">How we work</p>
        <h2 id="process-title" class="section-title">From first call to a system your team runs.</h2>
    </div>
    <?php partial('service-process'); ?>
</section>

<!-- WHY SYMNEXUS + LEADERSHIP -->
<section class="panel mt-10" aria-labelledby="why-title">
    <div class="mb-6 md:mb-8 max-w-3xl">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">Why SymNexus</p>
        <h2 id="why-title" class="section-title">Senior Silicon Valley engineers, without big-consultancy overhead.</h2>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 items-start">
        <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <?php foreach ($why as $card): ?>
                <div class="card flex flex-col h-full">
                    <div class="icon-badge mb-5"><?= icon($card['icon'], 'w-5 h-5') ?></div>
                    <h3 class="font-sans text-lg font-bold text-gray-900 dark:text-white mb-2"><?= e($card['title']) ?></h3>
                    <p class="font-body text-sm leading-relaxed text-gray-600 dark:text-gray-300 flex-grow"><?= e($card['body']) ?></p>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="card-inset">
            <div class="flex items-center gap-3 mb-6">
                <div class="text-gray-500 dark:text-teal-400"><?= icon('briefcase', 'w-5 h-5') ?></div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">The team</h3>
            </div>

            <ul class="space-y-4 mb-6">
                <?php foreach ([
                    ['Dhilip Raman', 'Chief Executive Officer', 'Clinical research & data · Stanford, Catalent'],
                    ['Jacob Matthew Rajesh', 'Chief Technical Officer', 'Systems engineering · NXP Semiconductors'],
                    ['Brent Luker', 'Generative AI Engineer', 'Formerly Zoom'],
                    ['Sameera Velammuri', 'AI/ML Engineer', 'Formerly Amazon'],
                    ['Arshi Saxena', 'Product & Forward-Deployed Engineering', 'Formerly ServiceNow'],
                ] as [$name, $role, $note]): ?>
                    <li class="flex flex-col">
                        <span class="text-sm font-semibold text-gray-900 dark:text-white leading-tight"><?= e($name) ?></span>
                        <span class="text-xs text-teal-700 dark:text-teal-400 mt-0.5 font-medium"><?= e($role) ?></span>
                        <span class="text-xs text-gray-500 dark:text-gray-400 mt-0.5"><?= e($note) ?></span>
                    </li>
                <?php endforeach; ?>
            </ul>

            <a href="/about#team"
                class="group w-full inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium py-3 px-4 bg-gray-100 hover:bg-gray-200/80 dark:bg-neutral-800/60 dark:hover:bg-neutral-800 dark:text-zinc-200 border border-gray-300/60 dark:border-gray-700/50 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200">
                Meet the whole team
                <?= icon('arrow-right', 'w-3.5 h-3.5 animate-drop-twice') ?>
            </a>
        </div>
    </div>
</section>

<?php partial('cta', [
    'title'     => 'Have a process that should be running on AI?',
    'body'      => 'Book a 30-minute scoping call with the engineers who would build it. You\'ll leave with a shortlist of where AI pays back first, whether or not you work with us.',
    'primary'   => PRIMARY_CTA,
    'secondary' => ['label' => 'See engagements & pricing', 'href' => '/pricing'],
]); ?>

<?php require SRC_DIR . '/includes/footer.php'; ?>
