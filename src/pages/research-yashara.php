<?php
$pageTitle = 'Case Study: AI Monitoring & Wholesale Automation for Yashara — SymNexus';
$pageMeta  = [
    'description' => 'How SymNexus built two AI systems for Yashara, an ethically-sourced goods retailer: inventory and quality monitoring across the catalog, and an AI layer for large wholesale accounts.',
    'og_type'     => 'article',
    'jsonld'      => [
        '@context'         => 'https://schema.org',
        '@type'            => 'Article',
        'headline'         => 'AI monitoring and wholesale automation for an overseas retailer.',
        'description'      => 'Two AI systems built for Yashara, an ethically-sourced South East Asian goods retailer.',
        'author'           => ['@type' => 'Organization', 'name' => SITE_NAME, 'url' => SITE_URL],
        'publisher'        => ['@type' => 'Organization', 'name' => SITE_NAME, 'url' => SITE_URL],
        'mainEntityOfPage' => SITE_URL . '/research/yashara-retail-ai',
    ],
];

$systems = [
    [
        'icon'  => 'shield-check',
        'title' => 'Inventory & quality monitoring',
        'body'  => 'An AI monitoring system watches inventory and product quality across Yashara\'s handcrafted goods catalog, learning what normal looks like and flagging inconsistencies before they reach a customer.',
        'items' => ['Automated inventory & quality monitoring', 'Anomaly flagging across the goods catalog'],
    ],
    [
        'icon'  => 'users',
        'title' => 'Wholesale-account agent',
        'body'  => 'A second AI layer handles interfacing for large wholesale accounts: routing orders, answering account-specific questions, and surfacing exceptions to a person when it matters.',
        'items' => ['AI-driven large-account interfacing', 'Exception routing to a human when needed'],
    ],
];

require SRC_DIR . '/includes/header.php';
?>

<div class="w-full max-w-3xl mx-auto py-4">

    <div class="mb-8">
        <a href="/research" class="inline-flex items-center text-sm font-sans font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-500 transition-colors group">
            <?= icon('arrow-left', 'w-4 h-4 mr-2 transform group-hover:-translate-x-0.5 transition-transform') ?>
            All case studies
        </a>
    </div>

    <div class="mb-8 border-b border-gray-200 dark:border-gray-700/60 pb-8">
        <div class="mb-4 flex flex-wrap items-center gap-2 text-xs font-sans text-gray-600 dark:text-gray-300 font-medium">
            <span class="flex items-center pl-3.5 relative">
                <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
                    <span class="h-3 w-0.5 rounded-full bg-teal-500"></span>
                </span>
                Custom AI system
            </span>
            <span class="text-gray-300 dark:text-gray-600" aria-hidden="true">•</span>
            <span class="badge">Case Study</span>
        </div>
        <h1 class="font-headline text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
            AI monitoring and wholesale automation for an overseas retailer.
        </h1>
    </div>

    <dl class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        <?php foreach ([['Client', 'Yashara, ethically-sourced goods retail'], ['Built', 'Anomaly detection · AI agent'], ['Deployed', 'Overseas, by our Silicon Valley team']] as [$k, $v]): ?>
            <div class="card-inset p-4">
                <dt class="font-mono text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400"><?= e($k) ?></dt>
                <dd class="mt-1 font-sans text-sm font-bold text-gray-900 dark:text-white"><?= e($v) ?></dd>
            </div>
        <?php endforeach; ?>
    </dl>

    <article class="font-body text-base leading-relaxed text-gray-600 dark:text-gray-300 space-y-6">
        <h2 class="font-headline text-2xl font-bold tracking-tight text-gray-900 dark:text-white">The challenge</h2>
        <p>
            Yashara sells ethically-sourced, handcrafted goods from South East Asia. Handcrafted means every item
            varies, and a catalog like that is hard to keep consistent: inventory and quality issues are easy to miss
            until a customer finds them. At the same time, large wholesale accounts expect fast, account-specific
            answers on orders.
        </p>

        <h2 class="font-headline text-2xl font-bold tracking-tight text-gray-900 dark:text-white pt-4">What we built</h2>
        <p>
            Our Silicon Valley engineering team built two AI systems around how Yashara already operates, and deployed
            them overseas.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
            <?php foreach ($systems as $sys): ?>
                <div class="card p-6">
                    <div class="icon-badge mb-4"><?= icon($sys['icon'], 'w-5 h-5') ?></div>
                    <h3 class="font-sans text-base font-bold text-gray-900 dark:text-white mb-2"><?= e($sys['title']) ?></h3>
                    <p class="text-sm leading-relaxed"><?= e($sys['body']) ?></p>
                    <ul class="mt-4 space-y-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
                        <?php foreach ($sys['items'] as $item): ?>
                            <li class="flex items-start"><span class="text-brandPrimary mr-2 flex-shrink-0"><?= icon('check', 'w-3.5 h-3.5') ?></span><?= e($item) ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endforeach; ?>
        </div>

        <h2 class="font-headline text-2xl font-bold tracking-tight text-gray-900 dark:text-white pt-4">Why it matters</h2>
        <p>
            The same approach we use in regulated science, applied to retail: AI fitted into the existing operation
            rather than a new platform to learn, with people kept in the loop for the decisions that need them.
            Inconsistencies get flagged before they reach a customer, and wholesale accounts get answers without
            waiting on a person for every routine question.
        </p>

        <p class="text-sm">
            <a href="https://yashara.org/" target="_blank" rel="noopener noreferrer" class="link-inline inline-flex items-center">Visit Yashara <?= icon('arrow-up-right', 'w-3.5 h-3.5 ml-1') ?></a>
        </p>
    </article>

    <?php partial('cta', [
        'title'     => 'Running operations that could use the same?',
        'body'      => 'Book a 30-minute scoping call with the engineers who built Yashara\'s systems.',
        'primary'   => PRIMARY_CTA,
        'secondary' => ['label' => 'Our services', 'href' => '/services'],
    ]); ?>
</div>

<?php require SRC_DIR . '/includes/footer.php'; ?>
