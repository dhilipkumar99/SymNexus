<?php
$pageTitle = 'ComplianceCall — Symnexus';
$pageMeta  = [
    'description' => 'ComplianceCall: benchmarks pharmaceutical development against federal regulation. Full audit-trail transparency, built in by design for FDA-regulated teams.',
    'og_image'    => img('complianceDesk', 1200),
    'jsonld'      => [
        '@context'            => 'https://schema.org',
        '@type'               => 'SoftwareApplication',
        'name'                => 'ComplianceCall',
        'applicationCategory' => 'BusinessApplication',
        'operatingSystem'     => 'Web',
        'description'         => 'Benchmarks pharmaceutical development against federal regulation, with full audit-trail transparency.',
        'url'                 => SITE_URL . '/compliancecall',
        'publisher'           => ['@type' => 'Organization', 'name' => SITE_NAME, 'url' => SITE_URL],
    ],
];

$coverage = [
    'Live Federal Regulatory Benchmarking',
    'Historical Hazard Category Tracking',
    'Full Audit-Trail Transparency',
    'Document Control — version history so a superseded SOP can never be mistaken for current',
    'FDA Filing Support — submission-ready records, not a scramble before the deadline',
    'Multi-Site Program Management — one compliance record across every site, not one per location',
];

$capabilities = [
    ['icon' => 'clock',        'title' => 'Historical hazard tracking',    'body' => 'Not just a chemical\'s current hazard category, but what it used to be and why it changed — the record EHS and regulatory auditors ask for.'],
    ['icon' => 'globe',        'title' => 'Live federal regulatory sync',  'body' => 'Benchmarks pharmaceutical development against current federal regulation, so requirements surface automatically rather than at the next review.'],
    ['icon' => 'shield-check', 'title' => 'Full audit-trail transparency', 'body' => 'Every action is logged, attributable, and exportable by design — critical trust infrastructure for teams operating under FDA and other regulatory bodies.'],
    ['icon' => 'document',     'title' => 'Document control',              'body' => 'Version history and access logs mean a superseded SOP can never be mistaken for the current one — the ambiguity that turns into a finding during an audit.'],
    ['icon' => 'cube',         'title' => 'Shared modular AI stack',       'body' => 'Runs on the same ingestion, data lake, and fine-tuned-model architecture as FluorocellAI, letting us extend coverage to new jurisdictions without rebuilding.'],
    ['icon' => 'briefcase',    'title' => 'Built for FDA filings',         'body' => 'ComplianceCall\'s regulatory benchmarking is built for teams filing into the FDA process — the majority of the world\'s pharmaceutical applications.'],
];

$roles = [
    ['role' => 'Pharma & Biotech R&D Teams',      'desc' => 'Maintain a continuously auditable compliance record as development progresses toward FDA filing.'],
    ['role' => 'Regulatory Affairs Teams',        'desc' => 'Benchmark development against current federal regulation automatically, rather than reconstructing history at audit time.'],
    ['role' => 'Chemical Hygiene & EHS Officers', 'desc' => 'Access the historical hazard-category record — not just current status — that EHS audits require.'],
    ['role' => 'Compliance Officers',             'desc' => 'Full audit-trail transparency surfaces gaps proactively, built into the platform rather than reconstructed after the fact.'],
];

require SRC_DIR . '/includes/header.php';
?>

<a href="/about#products" class="inline-flex items-center text-sm font-sans font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-500 transition-colors group mb-8">
    <?= icon('arrow-left', 'w-4 h-4 mr-2 transform group-hover:-translate-x-0.5 transition-transform') ?>
    Back to About
</a>

<?php partial('page-header', [
    'eyebrow' => 'Regulatory Compliance',
    'title'   => 'ComplianceCall',
    'lead'    => 'ComplianceCall benchmarks pharmaceutical development against federal regulation — auditable, always current, and built for the teams who answer to FDA and other regulatory bodies.',
]); ?>

<div class="flex flex-wrap gap-3 -mt-4 mb-12">
    <a href="/demo" class="btn-primary group">Request Demonstration <?= icon('arrow-right', 'w-4 h-4 animate-drop-twice') ?></a>
    <a href="/pricing#compliancecall" class="btn-secondary">View Pricing</a>
</div>

<figure class="max-w-4xl mb-16">
    <div class="rounded-2xl overflow-hidden shadow-2xl border border-gray-200/60 dark:border-white/10 bg-slate-950">
        <img src="<?= e(asset('images/compliancecall-dashboard.webp')) ?>"
            data-lightbox role="button" tabindex="0" data-lightbox-src="<?= e(asset('images/compliancecall-dashboard.webp')) ?>"
            data-lightbox-alt="ComplianceCall dashboard"
            srcset="<?= e(asset('images/compliancecall-dashboard-900.webp')) ?> 900w, <?= e(asset('images/compliancecall-dashboard.webp')) ?> 1952w"
            sizes="(min-width: 1024px) 896px, 92vw" width="1952" height="1008" fetchpriority="high" decoding="async"
            alt="ComplianceCall dashboard: compliance audit readiness by framework, vulnerability response and security operations panels"
            class="w-full h-auto cursor-zoom-in">
    </div>
</figure>

<!-- Overview -->
<section id="overview" class="grid grid-cols-1 lg:grid-cols-5 gap-12 py-12" aria-labelledby="overview-title">
    <div class="lg:col-span-3 space-y-5 body-copy">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">Platform Overview</p>
        <h2 id="overview-title" class="section-title">The historical record your auditors ask for, generated automatically.</h2>
        <p>
            ComplianceCall tracks not just a chemical's current hazard category, but what it used to be and why it
            changed — we build full audit-trail transparency into the platform by design, rather than bolt it on after
            the fact.
        </p>
        <p class="text-sm">
            Built on the same modular AI stack as FluorocellAI — ingestion, data lake, fine-tuned models, agents, and
            copilot — letting us extend coverage to new regulatory jurisdictions without rebuilding from scratch.
        </p>
    </div>

    <div class="lg:col-span-2 card-inset h-fit">
        <div class="flex items-center gap-3 mb-6">
            <div class="text-gray-500 dark:text-teal-400"><?= icon('shield-check', 'w-5 h-5') ?></div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">Platform Coverage</h3>
        </div>
        <ul class="space-y-3">
            <?php foreach ($coverage as $item): ?>
                <li class="flex items-start gap-3">
                    <span class="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-brandPrimary/40 bg-brandPrimary/10 text-brandPrimary"><?= icon('check', 'w-3 h-3') ?></span>
                    <span class="text-sm leading-relaxed text-gray-700 dark:text-gray-300"><?= e($item) ?></span>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
</section>

<!-- Pull quote -->
<figure class="my-8 max-w-3xl border-l-4 border-brandPrimary bg-white dark:bg-slate-800/40 rounded-r-2xl p-6 sm:p-8 shadow-sm">
    <blockquote class="font-headline text-xl md:text-2xl font-medium leading-relaxed text-gray-900 dark:text-white">
        &ldquo;It tells us not just what a chemical's current hazard category is, but what it used to be and why it changed. That historical record is exactly what our EHS auditors ask for.&rdquo;
    </blockquote>
    <figcaption class="mt-4 font-mono text-[11px] uppercase tracking-widest text-gray-500 dark:text-gray-300">Dr. S. Okonkwo — Chemical Hygiene Officer, Research University · ComplianceCall pilot customer</figcaption>
</figure>

<!-- Capabilities -->
<section class="py-16" aria-labelledby="capabilities-title">
    <div class="mb-6 md:mb-8 max-w-3xl">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">Key Capabilities</p>
        <h2 id="capabilities-title" class="section-title">Designed for every role in the pharmaceutical compliance chain.</h2>
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

<!-- Who uses it -->
<section class="py-12" aria-labelledby="roles-title">
    <div class="mb-6 md:mb-8">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">Who Uses ComplianceCall</p>
        <h2 id="roles-title" class="section-title">Built for every pharmaceutical compliance role.</h2>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:-mx-8">
        <?php foreach ($roles as $r): ?>
            <article class="card-ghost p-6 flex flex-col">
                <div class="mb-4 h-1 w-8 rounded-full bg-brandPrimary" aria-hidden="true"></div>
                <h3 class="font-sans text-sm font-bold text-gray-900 dark:text-white"><?= e($r['role']) ?></h3>
                <p class="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300"><?= e($r['desc']) ?></p>
            </article>
        <?php endforeach; ?>
    </div>
</section>

<?php partial('cta', [
    'title'     => 'Speak with a compliance specialist.',
    'body'      => 'Domain specialists run every ComplianceCall demonstration, not sales staff. We review your current compliance posture before the call so the conversation is immediately relevant to your work.',
    'note'      => 'Not a regulatory workflow? We build domain-native software systems for many industries — <a href="/contact" class="link-inline">reach out</a> to discuss a custom system.',
    'primary'   => ['label' => 'Request Demonstration', 'href' => '/demo'],
    'secondary' => ['label' => 'View Pricing', 'href' => '/pricing#compliancecall'],
]); ?>

<?php require SRC_DIR . '/includes/footer.php'; ?>
