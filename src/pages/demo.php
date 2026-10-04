<?php
$pageTitle = 'Book a Scoping Call — SymNexus';
$pageMeta  = [
    'description' => 'Book a 30-minute scoping call with the SymNexus engineers who would build your AI system, or request a demonstration of FluorocellAI or ComplianceCall.',
];

$steps = [
    ['01', 'Tell us what you want to build', 'Four fields and a few sentences. No sales sequence; an engineer reads it.'],
    ['02', '30-minute scoping call',         'We reply within one business day to set a time. The engineers who would build your system join the call.'],
    ['03', 'A shortlist you can use',        'You leave with where AI pays back first in your workflow, whether or not you work with us.'],
    ['04', 'Proof on your data',             'If there\'s a fit, we prove the model on your own data and send a written scope and quote.'],
];

require SRC_DIR . '/includes/header.php';
?>

<?php partial('page-header', [
    'eyebrow'   => 'Book a scoping call',
    'title'     => 'Tell us what you want',
    'highlight' => 'AI to do.',
    'lead'      => 'A 30-minute call with the engineers who would build it: for a custom AI system, or a demonstration of FluorocellAI or ComplianceCall on your own workflow.',
]); ?>

<div class="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 pb-8">

    <!-- Form -->
    <div class="lg:col-span-3 lg:order-2">
        <?php partial('contact-form', [
            'form'         => 'demo',
            'withSubject'  => false,
            'heading'      => null,
            'inputs'       => [
                ['firstName',    'First name', 'text',  true, 'given-name'],
                ['lastName',     'Last name',  'text',  true, 'family-name'],
                ['email',        'Work email', 'email', true, 'email'],
                ['organization', 'Company',    'text',  true, 'organization'],
            ],
            'selects'      => [
                ['name' => 'product', 'label' => 'Interested in', 'required' => false, 'options' => ['' => 'Choose one (optional)'] + CONTACT_PRODUCTS],
            ],
            'textarea'     => ['name' => 'message', 'label' => 'What do you want to build?', 'rows' => 4, 'placeholder' => 'e.g. "We re-key 2,000 supplier invoices a month" or "We want to predict which customers will churn."'],
            'submitLabel'  => 'Book my scoping call',
            'footnote'     => 'We reply within one business day. No automated sales sequences.',
        ]); ?>
    </div>

    <!-- Process + context -->
    <div class="lg:col-span-2 lg:order-1 space-y-8">
        <div class="card-inset">
            <div class="flex items-center gap-3 mb-2">
                <div class="text-gray-500 dark:text-teal-400"><?= icon('clock', 'w-5 h-5') ?></div>
                <h2 class="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">What happens next</h2>
            </div>
            <ol>
                <?php foreach ($steps as $i => [$num, $title, $body]): ?>
                    <li class="flex gap-4 py-4 <?= $i < count($steps) - 1 ? 'border-b border-gray-100 dark:border-gray-700/40' : '' ?>">
                        <span class="flex-shrink-0 font-mono text-xs font-bold text-brandPrimary mt-0.5"><?= e($num) ?></span>
                        <div>
                            <p class="text-sm font-semibold text-gray-900 dark:text-white"><?= e($title) ?></p>
                            <p class="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-300"><?= e($body) ?></p>
                        </div>
                    </li>
                <?php endforeach; ?>
            </ol>
        </div>

        <div class="card-inset">
            <h2 class="font-headline font-semibold text-lg text-gray-900 dark:text-white mb-4">Who you&rsquo;ll talk to</h2>
            <p class="body-copy text-sm mb-4">Engineers and researchers, not sales staff.</p>
            <?php partial('team-pedigree'); ?>
            <p class="mt-4 text-sm text-gray-600 dark:text-gray-300">
                Rather talk now? <a href="tel:<?= e(SITE_PHONE_TEL) ?>" class="link-inline"><?= e(SITE_PHONE) ?></a>
                or <a href="<?= e(mailto('Scoping call')) ?>" class="link-inline"><?= e(SITE_EMAIL) ?></a>
            </p>
        </div>
    </div>
</div>

<?php require SRC_DIR . '/includes/footer.php'; ?>
