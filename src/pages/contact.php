<?php
$pageTitle = 'Contact — Symnexus';
$pageMeta  = [
    'description' => 'Contact Symnexus to request a product demonstration or discuss your requirements.',
];

require SRC_DIR . '/includes/header.php';
?>

<?php partial('page-header', [
    'eyebrow' => 'Contact',
    'title'   => 'Let\'s discuss',
    'highlight' => 'your requirements.',
    'lead'    => 'We provide structured evaluation access for qualified research and regulatory teams. Domain specialists run every demonstration, not sales staff.',
    'sublead' => 'We also build domain-native software systems well beyond FluorocellAI and ComplianceCall — if you have a custom solution in mind, tell us about it below.',
]); ?>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 pb-8">

    <!-- Sidebar -->
    <aside class="space-y-8">
        <div class="card-inset">
            <div class="flex items-center gap-3 mb-6">
                <div class="text-gray-500 dark:text-teal-400"><?= icon('mail', 'w-5 h-5') ?></div>
                <h2 class="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">Contact Details</h2>
            </div>
            <div class="space-y-5">
                <div>
                    <p class="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1">Email</p>
                    <a href="<?= e(mailto()) ?>" class="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline break-all"><?= e(SITE_EMAIL) ?></a>
                </div>
                <div>
                    <p class="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1">Phone</p>
                    <a href="tel:<?= e(SITE_PHONE_TEL) ?>" class="text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-brandPrimary"><?= e(SITE_PHONE) ?></a>
                </div>
            </div>
        </div>

        <div class="card-inset">
            <h2 class="font-headline font-semibold text-lg text-gray-900 dark:text-white mb-4">What to expect</h2>
            <ul class="space-y-3 font-sans text-sm text-gray-700 dark:text-gray-300">
                <?php foreach ([
                    'Scientific team responds within one business day',
                    'Domain specialists run every demonstration, not sales',
                    'We build every demo around your specific workflow',
                    'Evaluation access for qualified research teams',
                ] as $item): ?>
                    <li class="flex items-start"><span class="w-2 h-2 mt-1.5 rounded-full bg-brandPrimary mr-2.5 flex-shrink-0" aria-hidden="true"></span><?= e($item) ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    </aside>

    <!-- Form -->
    <div class="lg:col-span-2">
        <?php partial('mailto-form', [
            'id'           => 'contact',
            'heading'      => null,
            'subject'      => 'Website enquiry',
            'subjectField' => 'organization',
            'inputs'       => [
                ['firstName',    'First Name',    'text',  true,  'given-name'],
                ['lastName',     'Last Name',     'text',  true,  'family-name'],
                ['email',        'Email Address', 'email', true,  'email'],
                ['phone',        'Phone Number',  'tel',   false, 'tel'],
                ['organization', 'Organization',  'text',  true,  'organization'],
                ['role',         'Your Role',     'text',  false, 'organization-title'],
            ],
            'selects'      => [
                ['name' => 'product', 'label' => 'Product of Interest', 'required' => false, 'options' => [
                    ''               => 'Select a product',
                    'fluorocellai'   => 'FluorocellAI',
                    'compliancecall' => 'ComplianceCall',
                    'multiple'       => 'Both products',
                    'custom'         => 'Something else — custom system',
                ]],
            ],
            'textarea'     => ['name' => 'message', 'label' => 'Message', 'rows' => 5, 'placeholder' => 'Describe your organization, current workflow, and what you\'d like to evaluate...'],
            'submitLabel'  => 'Send Enquiry',
            'footnote'     => null,
            'successTitle' => 'Thank you.',
        ]); ?>
    </div>
</div>

<?php require SRC_DIR . '/includes/footer.php'; ?>
