<?php
$pageTitle = 'About — SymNexus';
$pageMeta  = [
    'description' => 'SymNexus is a Silicon Valley team of engineers and researchers from Amazon, Zoom, ServiceNow, NXP, Stanford and Berkeley, building production AI systems for businesses, including FluorocellAI and ComplianceCall.',
];

$differentiators = [
    ['num' => '01', 'title' => 'Team expertise',        'body' => 'Silicon Valley engineers from NXP Semiconductors, Zoom, Amazon and ServiceNow, plus Stanford- and Berkeley-trained researchers: the systems engineering to deploy AI reliably, and the domain depth to know what it has to get right.'],
    ['num' => '02', 'title' => 'Built around your workflow', 'body' => 'We start from how your team works today and fit AI into it. The people who use each system validate it before it goes live; we never ask them to adapt to a generic tool.'],
    ['num' => '03', 'title' => 'Proven on your data',   'body' => 'We prove the model on your own data before you commit to a build, then train your team to run the system independently.'],
    ['num' => '04', 'title' => 'Flexible architecture', 'body' => 'One modular stack (ingestion, data lake, fine-tuned models, agents and copilot) lets us ship new systems fast and extend them to new sites, data and jurisdictions without rebuilding.'],
    ['num' => '05', 'title' => 'Compliance by design',  'body' => 'Every system ships with an audit trail and access controls built in, not bolted on: a standard we set for customers who answer to the FDA and other regulators.'],
];

$team = [
    ['name' => 'Brent Luker',           'role' => 'Generative AI Software Engineer', 'note' => 'Formerly Zoom'],
    ['name' => 'Sameera Velammuri',     'role' => 'AI/ML Software Engineer',         'note' => 'Formerly Amazon'],
    ['name' => 'Prabhat Jammalamadaka', 'role' => 'Business Development',            'note' => ''],
    ['name' => 'Arshi Saxena',          'role' => 'Product Development & Forward-Deployed Engineering',       'note' => 'Formerly ServiceNow'],
    ['name' => 'Rijul Mahajan',         'role' => 'Front-End Software Engineer',     'note' => 'UC Berkeley'],
    ['name' => 'Varun Singh',           'role' => 'AI/ML Researcher',                'note' => 'Stanford'],
];


require SRC_DIR . '/includes/header.php';
?>

<?php partial('page-header', [
    'eyebrow'   => 'About SymNexus',
    'title'     => 'The team building',
    'highlight' => 'production AI systems.',
    'lead'      => 'We\'re a Silicon Valley team of engineers and researchers who design, build and deploy AI for businesses, from cell-image analysis and pharmaceutical compliance to retail operations, for clients in the United States, Canada and beyond.',
]); ?>

<!-- What we do: narrative + focus card -->
<section class="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12" aria-labelledby="what-we-do">
    <div class="md:col-span-2 space-y-6 body-copy">
        <h2 id="what-we-do" class="font-sans text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            We build AI that experts actually use.
        </h2>
        <p>
            Most software vendors sell a platform and leave the customer to adapt their workflow to it. That works poorly
            when precision and accountability matter — which is why we chose to prove our models first, and train
            businesses to manage these systems independently.
        </p>
        <p>
            At SymNexus, we begin with a deep operational understanding of the domain — a cancer-research lab's
            cell-analysis workflow, a pharmaceutical team's regulatory audit trail — and build software validated by the
            working scientists and compliance professionals who use it.
        </p>
        <div class="flex flex-wrap gap-3 pt-2">
            <a href="/services" class="btn-primary">Our services</a>
            <a href="/research" class="btn-secondary">Case studies</a>
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

<!-- Differentiators -->
<section class="py-16" aria-labelledby="different-title">
    <div class="mb-6 md:mb-8 max-w-2xl">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">Why Teams Choose Us</p>
        <h2 id="different-title" class="section-title">What makes us different.</h2>
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
<section id="team" class="py-12 scroll-mt-28" aria-labelledby="team-title">
    <div class="mb-6 md:mb-8">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">Team</p>
        <h2 id="team-title" class="section-title">The people who build your system.</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <article class="card">
            <h3 class="font-sans text-lg font-bold text-gray-900 dark:text-white">Dhilip Raman</h3>
            <p class="text-xs text-teal-700 dark:text-teal-400 mt-1 font-semibold uppercase tracking-wider">Chief Executive Officer</p>
            <p class="mt-4 body-copy text-sm">Leads operations, client engagements and market entry. Background in clinical research and clinical data management, and neuroscience research at the doctoral level.</p>
            <p class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/40 text-xs leading-relaxed text-gray-500 dark:text-gray-300">Clinical Research Coordinator, Stanford · Clinical Data Manager · Catalent Pharma Solutions</p>
        </article>
        <article class="card">
            <h3 class="font-sans text-lg font-bold text-gray-900 dark:text-white">Jacob Matthew Rajesh</h3>
            <p class="text-xs text-teal-700 dark:text-teal-400 mt-1 font-semibold uppercase tracking-wider">Chief Technical Officer</p>
            <p class="mt-4 body-copy text-sm">Leads technical design and the engineering team, from system architecture to deployment.</p>
            <p class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/40 text-xs leading-relaxed text-gray-500 dark:text-gray-300">Systems engineering · NXP Semiconductors</p>
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

<!-- What we've shipped -->
<section class="py-12" aria-labelledby="shipped-title">
    <div class="mb-6 md:mb-8 max-w-3xl">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">Shipped in production</p>
        <h2 id="shipped-title" class="section-title">What we&rsquo;ve built.</h2>
    </div>

<a href="/products"
    class="group mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-inset hover:border-brandPrimary/60 transition-colors">
    <span>
        <span class="pill mb-2">SymNexus Models</span>
        <span class="block font-sans text-xl font-bold text-gray-900 dark:text-white">Nine model families, 108 ready-made tasks</span>
        <span class="block body-copy text-sm mt-1">Predict, Forecast, Sentinel, Extract, Gen, Vision, Match, Decide and Voice. Find the model closest to your work and we&rsquo;ll configure it to your data.</span>
    </span>
    <span class="btn-primary flex-shrink-0">
        Browse models
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
</section>

<?php partial('cta', [
    'title'     => 'Work with the team that built these.',
    'body'      => 'Book a 30-minute scoping call with the engineers who would build your system.',
    'primary'   => PRIMARY_CTA,
    'secondary' => ['label' => 'Our services', 'href' => '/services'],
]); ?>

<?php require SRC_DIR . '/includes/footer.php'; ?>
