<?php
$pageTitle = 'About — Symnexus';
$pageMeta  = [
    'description' => 'FluorocellAI, ComplianceCall and custom AI systems from Symnexus — a Silicon Valley team of engineers and researchers building domain-native software for regulated and technical industries.',
    'og_image'    => img('scientistScope', 1200),
];

$differentiators = [
    ['num' => '01', 'title' => 'Team expertise',        'body' => 'Silicon Valley engineers from NXP Semiconductors, Zoom, Amazon, and ServiceNow, plus Berkeley- and Stanford-trained researchers, led by a neuroscience Ph.D. researcher and a Berkeley-trained operator — built for both the hardware/deployment side and the regulated-science domain side of this problem, and for deploying that engineering to clients operating overseas.'],
    ['num' => '02', 'title' => 'Unique wedge',          'body' => 'We build domain-native software, and the working scientists and compliance professionals who use it validate it — we don\'t adapt generic enterprise technology after the fact for the lab.'],
    ['num' => '03', 'title' => 'Proprietary data',      'body' => 'Every deployment adds annotated microscopy data and mapped regulatory precedent across FDA — a compounding dataset a generic tool cannot replicate.'],
    ['num' => '04', 'title' => 'Flexible architecture', 'body' => 'One modular software stack — ingestion, data lake, fine-tuned models, agents, and copilot — powers both products today and lets us add new regulatory jurisdictions or imaging modalities without rebuilding from scratch.'],
    ['num' => '05', 'title' => 'Compliance by design',  'body' => 'We build full audit-trail transparency into every Symnexus platform by design, rather than bolt it on — critical trust infrastructure for customers operating under FDA and other regulatory bodies.'],
];

$team = [
    ['name' => 'Brent Luker',           'role' => 'Generative AI Software Engineer', 'note' => 'Formerly Zoom'],
    ['name' => 'Sameera Velammuri',     'role' => 'AI/ML Software Engineer',         'note' => 'Formerly Amazon'],
    ['name' => 'Prabhat Jammalamadaka', 'role' => 'Business Development',            'note' => ''],
    ['name' => 'Arshi Saxena',          'role' => 'Product Development & FDE',       'note' => 'Formerly ServiceNow'],
    ['name' => 'Rijul Mahajan',         'role' => 'Front-End Software Engineer',     'note' => 'UC Berkeley'],
    ['name' => 'Varun Singh',           'role' => 'AI/ML Researcher',                'note' => 'Stanford'],
];


require SRC_DIR . '/includes/header.php';
?>

<?php partial('page-header', [
    'eyebrow' => 'Products',
    'title'   => 'AI Agents to',
    'highlight' => 'Maximize Efficiency',
    'lead'    => 'SymNexus employs a team of Silicon Valley educated and trained machine learning engineers to develop custom AI solutions for high-throughput industries, using the latest AI/ML models produced in the Bay Area. SymNexus has built two large-scale products for industries in the United States and Canada; it is now building out solutions globally.',
]); ?>

<a href="/products"
    class="group mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-inset hover:border-brandPrimary/60 transition-colors">
    <span>
        <span class="pill mb-2">SymNexus tasks</span>
        <span class="block font-sans text-xl font-bold text-gray-900 dark:text-white">108 ready-made tasks for every department</span>
        <span class="block body-copy text-sm mt-1">Predict, Forecast, Sentinel, Extract, Gen, Vision, Match, Decide and Voice. Find the task that fits your work and plan a project in minutes.</span>
    </span>
    <span class="btn-primary flex-shrink-0">
        Browse tasks
        <?= icon('arrow-right', 'w-4 h-4 animate-drop-twice') ?>
    </span>
</a>

<div id="products" class="grid grid-cols-1 md:grid-cols-2 gap-8 scroll-mt-28">
    <?php foreach (PRODUCTS as $slug => $p): ?>
        <?php partial('product-card', [
            'slug'   => $slug,
            'p'      => $p,
            'slides' => PRODUCT_MEDIA[$slug] ?? null,
            'class'  => isset(PRODUCT_MEDIA[$slug]) ? '' : 'md:col-span-2',
        ]); ?>
    <?php endforeach; ?>
</div>

<!-- About Symnexus -->
<header class="mt-20 mb-12 border-b border-gray-200 dark:border-gray-700/60 pb-8 max-w-4xl" aria-labelledby="about-title">
    <p class="badge mb-5">About Symnexus</p>
    <h2 id="about-title" class="font-headline font-bold text-4xl sm:text-5xl text-gray-900 dark:text-white tracking-tight leading-tight mb-4">
        The team building <span class="text-brandPrimary">domain-native software systems.</span>
    </h2>
    <p class="font-sans text-lg font-medium text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">We&rsquo;re a Silicon Valley team of engineers and researchers building software systems for regulated and technical industries — from cell image analysis and pharmaceutical compliance to monitoring and account intelligence for other fields entirely, deployed for clients operating globally.</p>
</header>

<!-- What we do: narrative + focus card -->
<section class="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12" aria-labelledby="what-we-do">
    <div class="md:col-span-2 space-y-6 body-copy">
        <h2 id="what-we-do" class="font-sans text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            We build software domain experts actually use.
        </h2>
        <p>
            Most software vendors sell a platform and leave the customer to adapt their workflow to it. That works poorly
            when precision and accountability matter — which is why we chose to prove our models first, and train
            businesses to manage these systems independently.
        </p>
        <p>
            At Symnexus, we begin with a deep operational understanding of the domain — a cancer-research lab's
            cell-analysis workflow, a pharmaceutical team's regulatory audit trail — and build software validated by the
            working scientists and compliance professionals who use it.
        </p>
        <div class="flex flex-wrap gap-3 pt-2">
            <a href="/products" class="btn-primary">Explore SymNexus tasks</a>
            <a href="/research" class="btn-secondary">Our research</a>
        </div>
    </div>

    <div class="md:col-span-1 card-inset h-fit">
        <h3 class="font-headline font-semibold text-xl text-gray-900 dark:text-white mb-4">What makes us different</h3>
        <ul class="space-y-2 font-sans text-sm font-medium text-gray-700 dark:text-gray-300">
            <?php foreach ($differentiators as $d): ?>
                <li class="flex items-center"><span class="w-2 h-2 rounded-full bg-brandPrimary mr-2 flex-shrink-0" aria-hidden="true"></span><?= e($d['title']) ?></li>
            <?php endforeach; ?>
        </ul>
    </div>
</section>

<!-- Image strip -->
<div class="grid grid-cols-2 md:grid-cols-3 gap-6 py-6">
    <?php foreach ([['labEquipment', 'Laboratory equipment and scientific instruments', '-rotate-1'], ['phytoplankton', 'Microscopic biological organisms', 'rotate-1'], ['cellGrowth', 'Cell cultures growing in laboratory conditions', '-rotate-1']] as $i => [$key, $alt, $rotate]): ?>
        <div class="<?= $i === 2 ? 'hidden md:block' : '' ?> transform <?= $rotate ?> shadow-xl rounded-3xl overflow-hidden border border-white/5 aspect-[4/3]">
            <img src="<?= e(img($key, 800)) ?>" alt="<?= e($alt) ?>" loading="lazy" decoding="async" class="w-full h-full object-cover transition-transform duration-700 hover:scale-105">
        </div>
    <?php endforeach; ?>
</div>

<!-- Differentiators -->
<section class="py-16" aria-labelledby="different-title">
    <div class="mb-6 md:mb-8 max-w-2xl">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">Why Teams Choose Us</p>
        <h2 id="different-title" class="section-title">What makes our software different.</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <?php foreach ($differentiators as $d): ?>
            <div class="card flex gap-5">
                <div class="flex-shrink-0 font-mono text-2xl font-medium text-gray-500 dark:text-gray-300 leading-none"><?= e($d['num']) ?></div>
                <div>
                    <h3 class="font-sans text-base font-bold text-gray-900 dark:text-white"><?= e($d['title']) ?></h3>
                    <p class="mt-2 font-body text-sm leading-relaxed text-gray-600 dark:text-gray-300"><?= e($d['body']) ?></p>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</section>

<!-- Team -->
<section class="py-12" aria-labelledby="team-title">
    <div class="mb-6 md:mb-8">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">Team</p>
        <h2 id="team-title" class="section-title">Leadership</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <article class="card">
            <h3 class="font-sans text-lg font-bold text-gray-900 dark:text-white">Dhilip Raman</h3>
            <p class="text-xs text-teal-700 dark:text-teal-400 mt-1 font-semibold uppercase tracking-wider">Chief Executive Officer</p>
            <p class="mt-4 body-copy text-sm">Ph.D. student, Neuroscience. Leads operations, contracts, and market entry.</p>
            <p class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/40 text-xs leading-relaxed text-gray-500 dark:text-gray-300">Previously: Clinical Research Coordinator (Stanford); Clinical Data Manager; Catalent Pharma Solutions.</p>
        </article>
        <article class="card">
            <h3 class="font-sans text-lg font-bold text-gray-900 dark:text-white">Jacob Matthew Rajesh</h3>
            <p class="text-xs text-teal-700 dark:text-teal-400 mt-1 font-semibold uppercase tracking-wider">Chief Technical Officer</p>
            <p class="mt-4 body-copy text-sm">Leads technical design and engineering teams.</p>
            <p class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/40 text-xs leading-relaxed text-gray-500 dark:text-gray-300">Currently: NXP Semiconductor Engineer.</p>
        </article>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:-mx-8">
        <?php foreach ($team as $member): ?>
            <div class="card-ghost p-6">
                <h4 class="font-sans text-sm font-bold text-gray-900 dark:text-white"><?= e($member['name']) ?></h4>
                <p class="mt-1 font-body text-sm text-gray-600 dark:text-gray-300"><?= e($member['role']) ?></p>
                <?php if ($member['note'] !== ''): ?>
                    <p class="mt-3"><span class="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs px-2.5 py-0.5 rounded font-mono border border-gray-200/40 dark:border-slate-700/40"><?= e($member['note']) ?></span></p>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
    </div>
</section>

<?php partial('cta', [
    'title'     => 'Ready to see these on your own data?',
    'body'      => 'Our scientific and engineering staff build every demonstration around your specific workflow, skipping the generic product tour.',
    'primary'   => ['label' => 'Request a Demonstration', 'href' => '/demo'],
    'secondary' => ['label' => 'View Pricing', 'href' => '/pricing'],
]); ?>

<?php require SRC_DIR . '/includes/footer.php'; ?>
