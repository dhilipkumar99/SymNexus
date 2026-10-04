<?php
$pageTitle = 'Pricing — AI Development Engagements | SymNexus';
$pageMeta  = [
    'description' => 'SymNexus AI development engagements, from an AI Opportunity Sprint to a production Pilot Build and Scale & Operate, plus FluorocellAI and ComplianceCall. Custom pricing, quoted to your scope.',
];

$faq = [
    ['q' => 'How is pricing determined?',                         'a' => 'Every engagement is quoted to its scope: the workflow, data volume, number of sites and integrations. You receive a written scope and quote before any build begins.'],
    ['q' => 'Can we start small?',                                'a' => 'Yes. Most teams start with an AI Opportunity Sprint or a single Pilot Build, then scale what works. We prove the model on your own data before you commit to a build.'],
    ['q' => 'What does onboarding look like?',                    'a' => 'It starts with a scoping call with the engineers who would build your system. We then review your workflow and a sample of your data, agree the result we are aiming for, and send a written scope and quote.'],
    ['q' => 'Is pricing billed monthly or annually?',             'a' => 'Project work is quoted per engagement. Ongoing Scale & Operate work and the FluorocellAI and ComplianceCall platforms can be billed monthly or annually.'],
    ['q' => 'Do you work with academic or non-profit institutions?', 'a' => 'Yes. Several of our early deployments are with research labs and academic institutions. Ask us about institutional pricing.'],
    ['q' => 'Is there an evaluation period for FluorocellAI or ComplianceCall?', 'a' => 'Yes. Every platform deployment starts with a structured evaluation in which our team configures it for your workflow and benchmarks it on your own data.'],
    ['q' => 'Can I cancel or change my plan?',                    'a' => 'Cancellation and plan-change terms, including notice period, are set out in your contract. Contact your account lead to review your terms or make a change.'],
];

$faqLd = [
    '@context'   => 'https://schema.org',
    '@type'      => 'FAQPage',
    'mainEntity' => array_map(static fn(array $item): array => [
        '@type'          => 'Question',
        'name'           => $item['q'],
        'acceptedAnswer' => ['@type' => 'Answer', 'text' => $item['a']],
    ], $faq),
];
$pageMeta['jsonld'] = $faqLd;

require SRC_DIR . '/includes/header.php';
?>

<?php partial('page-header', [
    'eyebrow'   => 'Pricing',
    'title'     => 'Quoted to your scope.',
    'highlight' => 'Proven before you commit.',
    'lead'      => 'Every engagement is priced to its workflow, data and integrations. We prove the model on your own data before you commit to a build, and you get a written scope and quote before any work begins.',
]); ?>

<!-- AI development engagements -->
<section class="py-8" aria-labelledby="engagements-title">
    <div class="mb-6 md:mb-8 max-w-2xl">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">AI development</p>
        <h2 id="engagements-title" class="section-title">Engagements.</h2>
        <p class="section-lead text-base">Custom AI systems built for your business. Start at any stage. <a href="/services" class="link-inline">How we work</a>.</p>
    </div>
    <?php partial('service-tiers'); ?>
    <span id="custom" class="block scroll-mt-28" aria-hidden="true"></span>
</section>

<!-- Platforms -->
<section class="py-12" aria-labelledby="plans-title">
    <div class="mb-6 md:mb-8 max-w-2xl">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">Ready-built platforms</p>
        <h2 id="plans-title" class="section-title">FluorocellAI and ComplianceCall.</h2>
        <p class="section-lead text-base">Our own products for life-science labs and FDA-regulated teams, configured to your workflow during a structured evaluation.</p>
    </div>

    <div id="current-products" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <?php foreach (PRODUCTS as $slug => $p): ?>
            <?php if ($p['pricing'] === null) continue; ?>
            <article id="<?= e($slug) ?>" class="card flex flex-col scroll-mt-28" aria-labelledby="<?= e($slug) ?>-title">
                <div class="flex items-baseline justify-between gap-4">
                    <h3 id="<?= e($slug) ?>-title" class="font-sans text-xl font-bold text-gray-900 dark:text-white"><?= e($p['name']) ?></h3>
                    <a href="<?= e($p['href']) ?>" class="text-teal-700 dark:text-teal-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-medium inline-flex items-center group transition-colors flex-shrink-0">
                        Learn more <?= icon('arrow-right', 'w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5') ?>
                    </a>
                </div>
                <p class="mt-2 body-copy text-sm"><?= e($p['pricing']['desc']) ?></p>
                <ul class="mt-4 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 font-sans text-sm font-medium text-gray-700 dark:text-gray-300">
                    <?php foreach ($p['pricing']['features'] as $feature): ?>
                        <li class="flex items-start"><span class="w-2 h-2 mt-1.5 rounded-full bg-brandPrimary mr-2.5 flex-shrink-0" aria-hidden="true"></span><?= e($feature) ?></li>
                    <?php endforeach; ?>
                </ul>
                <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/40 flex flex-wrap items-center justify-between gap-4">
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">Custom pricing, sized to your deployment</p>
                    <a href="/demo?interest=<?= e($slug) ?>" class="btn-secondary">Request a demonstration</a>
                </div>
            </article>
        <?php endforeach; ?>
    </div>
</section>

<!-- FAQ -->
<section class="py-16" aria-labelledby="faq-title">
    <div class="mb-6 md:mb-8">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">Common Questions</p>
        <h2 id="faq-title" class="section-title">Pricing FAQ.</h2>
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
    'title'   => 'Not sure where to start?',
    'body'    => 'Book a 30-minute scoping call. Our engineers will review your workflow and recommend the right engagement before you commit to anything.',
    'primary' => PRIMARY_CTA,
]); ?>

<?php require SRC_DIR . '/includes/footer.php'; ?>
