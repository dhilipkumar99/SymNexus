<?php
$pageTitle = 'Pricing — Symnexus';
$pageMeta  = [
    'description' => 'Symnexus pricing for FluorocellAI and ComplianceCall. We size every deployment to your workflow — contact us for a quote.',
];

$faq = [
    ['q' => 'Is there an evaluation period?',                          'a' => 'Every engagement begins with a structured evaluation, during which our team works with you to configure the platform for your specific workflow. Evaluation access is granted after a brief qualification conversation.'],
    ['q' => 'How is pricing determined?',                              'a' => 'We size pricing to the scope of your deployment — number of sites, data volume, and workflow complexity. We prove the model on your data first, then discuss a plan sized to your organization.'],
    ['q' => 'Is pricing billed monthly or annually?',                  'a' => 'Both options are available and discussed as part of your pricing conversation.'],
    ['q' => 'Do you work with academic or non-profit institutions?',   'a' => 'Yes — several of our early deployments are with research labs and academic institutions. Contact us to discuss institutional pricing.'],
    ['q' => 'What if my field isn\'t FluorocellAI or ComplianceCall?', 'a' => 'Those are our current products, not the limit of what we build. We design domain-native software systems for other technical and regulated fields — reach out to discuss your workflow.'],
    ['q' => 'What does onboarding look like?',                         'a' => 'Domain specialists run every demonstration, not sales staff, and we build each demo around your specific workflow before we discuss terms.'],
    ['q' => 'Can I cancel or change my plan?',                         'a' => 'Cancellation and plan-change terms, including notice period, are set out in your contract. Reach out to your account contact to review your specific terms or initiate a change.'],
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
    'eyebrow' => 'Pricing',
    'title'   => 'Sized to',
    'highlight' => 'your deployment.',
    'lead'    => 'Our Silicon Valley engineering team designs and builds domain-native software systems across a range of technical and regulated fields, deployed for clients operating globally. Every engagement begins with an evaluation tailored to your workflow — we prove the model on your data before we talk pricing.',
]); ?>

<!-- Products -->
<section class="py-8" aria-labelledby="plans-title">
    <div class="mb-6 md:mb-8 max-w-2xl">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">Currently Offering</p>
        <h2 id="plans-title" class="section-title">Two regulated workflows, and counting.</h2>
        <p class="section-lead text-base">Pricing for the systems we've already built for research labs and pharmaceutical teams. If your field isn't listed, that's the point — we build custom.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Current products -->
        <article id="current-products" class="card flex flex-col">
            <div class="flex items-center gap-3 mb-6">
                <div class="icon-badge"><?= icon('cube', 'w-5 h-5') ?></div>
                <h3 class="font-sans text-sm font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">Current Products</h3>
            </div>
            <p class="font-sans text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Contact us for pricing</p>

            <div class="mt-6 flex-1 divide-y divide-gray-100 dark:divide-gray-700/40">
                <?php foreach (PRODUCTS as $slug => $p): ?>
                    <?php if ($p['pricing'] === null) continue; ?>
                    <section id="<?= e($slug) ?>" class="py-5 first:pt-0 last:pb-0" aria-labelledby="<?= e($slug) ?>-title">
                        <div class="flex items-baseline justify-between gap-4">
                            <h4 id="<?= e($slug) ?>-title" class="font-sans text-base font-bold text-gray-900 dark:text-white"><?= e($p['name']) ?></h4>
                            <a href="<?= e($p['href']) ?>" class="text-teal-700 dark:text-teal-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-medium inline-flex items-center group transition-colors flex-shrink-0">
                                Learn more <?= icon('arrow-right', 'w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5') ?>
                            </a>
                        </div>
                        <p class="mt-2 body-copy text-sm"><?= e($p['pricing']['desc']) ?></p>
                        <ul class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 font-sans text-sm font-medium text-gray-700 dark:text-gray-300">
                            <?php foreach ($p['pricing']['features'] as $feature): ?>
                                <li class="flex items-start"><span class="w-2 h-2 mt-1.5 rounded-full bg-brandPrimary mr-2.5 flex-shrink-0" aria-hidden="true"></span><?= e($feature) ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </section>
                <?php endforeach; ?>
            </div>

            <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/40">
                <a href="/demo" class="btn-primary">Request a Demonstration</a>
            </div>
        </article>

        <!-- Custom-built AI tools -->
        <article id="custom" class="card flex flex-col">
            <div class="flex items-center gap-3 mb-6">
                <div class="icon-badge"><?= icon('squares', 'w-5 h-5') ?></div>
                <h3 class="font-sans text-sm font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">Custom Built AI Tools</h3>
            </div>
            <p class="font-sans text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Contact us for pricing</p>
            <p class="mt-3 body-copy text-sm">
                We design and build domain-native software systems for other technical and regulated fields too — imaging,
                laboratory workflows, compliance, and beyond. Tell us what you're working on and we'll size a system to fit.
            </p>
            <ul class="mt-6 flex-1 space-y-2.5 font-sans text-sm font-medium text-gray-700 dark:text-gray-300">
                <?php foreach ([
                    'Built around how your team already works',
                    'Proven on your own data before we talk pricing',
                    'Validated by the domain experts who use it',
                    'Full audit-trail transparency by design',
                    'Your team trained to run the system independently',
                ] as $feature): ?>
                    <li class="flex items-start"><span class="w-2 h-2 mt-1.5 rounded-full bg-brandPrimary mr-2.5 flex-shrink-0" aria-hidden="true"></span><?= e($feature) ?></li>
                <?php endforeach; ?>
            </ul>
            <p class="mt-6 text-sm text-gray-600 dark:text-gray-300">
                Recent example: AI inventory monitoring and wholesale-account automation for
                <a href="/products#yashara" class="link-inline">Yashara</a>.
            </p>
            <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/40">
                <a href="/contact" class="btn-primary">Discuss a custom system</a>
            </div>
        </article>
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
    'title'   => 'Not sure which plan is right for you?',
    'body'    => 'Our scientific team will review your workflow and recommend the right plan before you commit to anything.',
    'primary' => ['label' => 'Request a Demonstration', 'href' => '/demo'],
]); ?>

<?php require SRC_DIR . '/includes/footer.php'; ?>
