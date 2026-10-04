<?php
$pageTitle = 'Contact — SymNexus';
$pageMeta  = [
    'description' => 'Contact SymNexus about a custom AI development project, FluorocellAI or ComplianceCall. Email, phone, or send us a message.',
];

require SRC_DIR . '/includes/header.php';
?>

<?php partial('page-header', [
    'eyebrow' => 'Contact',
    'title'   => 'Let\'s talk about',
    'highlight' => 'what you\'re building.',
    'lead'    => 'Whether it\'s a custom AI system, FluorocellAI or ComplianceCall, an engineer reads every message and replies within one business day.',
    'sublead' => 'Ready to scope a project? <a href="/demo" class="link-inline">Book a scoping call</a> instead.',
]); ?>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 pb-8">

    <!-- Sidebar -->
    <div class="space-y-8">
        <div class="card-inset">
            <div class="flex items-center gap-3 mb-6">
                <div class="text-gray-500 dark:text-teal-400"><?= icon('mail', 'w-5 h-5') ?></div>
                <h2 class="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">Contact Details</h2>
            </div>
            <div class="space-y-5">
                <div>
                    <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-300 mb-1">Email</p>
                    <a href="<?= e(mailto()) ?>" class="text-sm font-semibold text-teal-700 dark:text-teal-400 hover:underline break-all"><?= e(SITE_EMAIL) ?></a>
                </div>
                <div>
                    <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-300 mb-1">Phone</p>
                    <a href="tel:<?= e(SITE_PHONE_TEL) ?>" class="text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-brandPrimary"><?= e(SITE_PHONE) ?></a>
                </div>
            </div>
        </div>

        <div class="card-inset">
            <h2 class="font-headline font-semibold text-lg text-gray-900 dark:text-white mb-4">What to expect</h2>
            <ul class="space-y-3 font-sans text-sm text-gray-700 dark:text-gray-300">
                <?php foreach ([
                    'An engineer replies within one business day',
                    'Engineers and researchers, not sales staff',
                    'We prove the model on your own data first',
                    'No automated sales sequences',
                ] as $item): ?>
                    <li class="flex items-start"><span class="w-2 h-2 mt-1.5 rounded-full bg-brandPrimary mr-2.5 flex-shrink-0" aria-hidden="true"></span><?= e($item) ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>

    <!-- Form -->
    <div class="lg:col-span-2">
        <?php partial('contact-form', [
            'form'         => 'contact',
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
            'textarea'     => ['name' => 'message', 'label' => 'Message', 'rows' => 5, 'placeholder' => 'Tell us what you\'re working on and how we can help.'],
            'submitLabel'  => 'Send message',
            'footnote'     => 'We reply within one business day.',
        ]); ?>
    </div>
</div>

<?php require SRC_DIR . '/includes/footer.php'; ?>
