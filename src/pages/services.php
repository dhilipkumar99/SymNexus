<?php
$pageTitle = 'AI Development Services — SymNexus';
$pageMeta  = [
    'description' => 'Custom AI development from a Silicon Valley engineering team: AI agents, document automation, computer vision, forecasting and monitoring, proven on your own data and built into your workflow.',
];

$faq = [
    ['q' => 'What kinds of companies do you work with?',
     'a' => 'Businesses with a real process that AI can take on: research labs and pharmaceutical teams, retailers and wholesalers, and operations, finance, sales and service teams. We have shipped systems in regulated science and overseas retail, and we build for many other industries.'],
    ['q' => 'Do you build on our existing tools and cloud?',
     'a' => 'Yes. We build each system into the tools and workflows your team already uses rather than asking you to adopt a new platform, and we discuss your stack and hosting requirements on the scoping call.'],
    ['q' => 'How do we know it will work before we commit?',
     'a' => 'We prove the model on your own data before you commit to a build, and the people who will use the system validate it before it goes live.'],
    ['q' => 'What happens after launch?',
     'a' => 'We train your team to run the system independently. If you want us to, we stay on to monitor it, improve the models and add new capabilities.'],
    ['q' => 'How do you handle our data?',
     'a' => 'Customer data is hosted in U.S. data centers, encrypted in transit and at rest, with role-based access control. Every system we ship has an audit trail by design. See our security page for details, and ask us for anything specific on the scoping call.'],
    ['q' => 'Who owns the code and models?',
     'a' => 'Ownership of code, models and data is agreed in your contract before any work starts. Tell us your requirements on the scoping call and we will build them into the proposal.'],
    ['q' => 'How is an engagement priced?',
     'a' => 'Every engagement is quoted to its scope: the workflow, data volume, number of sites and integrations. You receive a written scope and quote before any build begins.'],
    ['q' => 'Can you take over or extend an existing AI project?',
     'a' => 'Yes. Tell us what is in place today and what is not working, and we will assess it on the scoping call.'],
];

$pageMeta['jsonld'] = [
    '@context' => 'https://schema.org',
    '@graph'   => [
        [
            '@type'       => 'Service',
            'name'        => 'Custom AI software development',
            'serviceType' => 'AI software development',
            'provider'    => ['@type' => 'Organization', 'name' => SITE_NAME, 'url' => SITE_URL],
            'areaServed'  => 'Worldwide',
            'description' => $pageMeta['description'],
            'url'         => SITE_URL . '/services',
            'hasOfferCatalog' => [
                '@type'           => 'OfferCatalog',
                'name'            => 'AI development engagements',
                'itemListElement' => array_map(static fn(array $t): array => [
                    '@type'       => 'Offer',
                    'itemOffered' => ['@type' => 'Service', 'name' => $t['name'], 'description' => $t['body']],
                ], SERVICE_TIERS),
            ],
        ],
        [
            '@type'      => 'FAQPage',
            'mainEntity' => array_map(static fn(array $item): array => [
                '@type'          => 'Question',
                'name'           => $item['q'],
                'acceptedAnswer' => ['@type' => 'Answer', 'text' => $item['a']],
            ], $faq),
        ],
    ],
];

require SRC_DIR . '/includes/header.php';
?>

<?php partial('page-header', [
    'eyebrow'   => 'AI Development Services',
    'title'     => 'We build the AI.',
    'highlight' => 'Your team runs it.',
    'lead'      => 'SymNexus designs, builds and deploys custom AI systems for businesses: scoped with your team, proven on your own data, built into your existing workflow, and handed over so you can run it independently.',
]); ?>

<div class="flex flex-wrap gap-3 -mt-4 mb-12">
    <a href="<?= e(PRIMARY_CTA['href']) ?>" data-cta="services-hero" class="btn-primary group"><?= e(PRIMARY_CTA['label']) ?> <?= icon('arrow-right', 'w-4 h-4 animate-drop-twice') ?></a>
    <a href="/research" class="btn-secondary">See case studies</a>
</div>

<?php partial('team-pedigree'); ?>

<!-- Capabilities -->
<section class="py-12" aria-labelledby="capabilities-title">
    <div class="mb-6 md:mb-8 max-w-3xl">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">Capabilities</p>
        <h2 id="capabilities-title" class="section-title">What we build.</h2>
        <p class="section-lead">Text, vision, voice and tabular models, engineered by our team and configured to your task. Browse <a href="/products" class="link-inline">nine model families and 108 ready-made tasks</a> for examples.</p>
    </div>
    <?php partial('service-capabilities', ['showFamily' => true]); ?>
</section>

<!-- Process -->
<section class="py-12" aria-labelledby="process-title">
    <div class="mb-6 md:mb-8 max-w-3xl">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">Process</p>
        <h2 id="process-title" class="section-title">How an engagement runs.</h2>
        <p class="section-lead">The engineers on your first call are the ones who build your system. No hand-off to a delivery team you&rsquo;ve never met.</p>
    </div>
    <?php partial('service-process'); ?>
</section>

<!-- Engagements -->
<section class="py-12" aria-labelledby="engagements-title">
    <div class="mb-6 md:mb-8 max-w-3xl">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">Engagements</p>
        <h2 id="engagements-title" class="section-title">Start small. Scale what works.</h2>
        <p class="section-lead">Each engagement is quoted to its scope, and you can start at any stage.</p>
    </div>
    <?php partial('service-tiers'); ?>
</section>

<!-- Proof -->
<section class="py-12" aria-labelledby="proof-title">
    <div class="card-inset p-8 sm:p-10">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">Proof</p>
        <h2 id="proof-title" class="section-title mb-6">Systems we&rsquo;ve shipped.</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <?php foreach ([
                ['FluorocellAI', 'Cancer-research labs', 'Cell analysis from 3–4 days of manual review to a same-day first pass.', '/research/fluorocellai-cancer-research-lab'],
                ['ComplianceCall', 'FDA-regulated pharma teams', 'Live benchmarking against federal regulation, with full audit-trail history.', '/compliancecall'],
                ['Yashara', 'Retail & wholesale, overseas', 'AI inventory and quality monitoring, plus wholesale-account automation.', '/research/yashara-retail-ai'],
            ] as [$name, $who, $what, $href]): ?>
                <a href="<?= e($href) ?>" class="group block">
                    <p class="font-sans text-lg font-bold text-gray-900 dark:text-white group-hover:text-brandPrimary transition-colors"><?= e($name) ?></p>
                    <p class="text-xs font-medium text-teal-700 dark:text-teal-400 mt-1"><?= e($who) ?></p>
                    <p class="mt-2 body-copy text-sm"><?= e($what) ?></p>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- FAQ -->
<section class="py-12" aria-labelledby="faq-title">
    <div class="mb-6 md:mb-8">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">Common Questions</p>
        <h2 id="faq-title" class="section-title">Before you book a call.</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
        <?php foreach ($faq as $item): ?>
            <div class="card p-6">
                <h3 class="font-sans text-sm font-bold text-gray-900 dark:text-white"><?= e($item['q']) ?></h3>
                <p class="mt-2 body-copy text-sm"><?= e($item['a']) ?></p>
            </div>
        <?php endforeach; ?>
    </div>
</section>

<?php partial('cta', [
    'title'     => 'Tell us what you want AI to do.',
    'body'      => 'Book a 30-minute scoping call with the engineers who would build it. You\'ll leave with a shortlist of where AI pays back first, whether or not you work with us.',
    'primary'   => PRIMARY_CTA,
    'secondary' => ['label' => 'Engagements & pricing', 'href' => '/pricing'],
]); ?>

<?php require SRC_DIR . '/includes/footer.php'; ?>
