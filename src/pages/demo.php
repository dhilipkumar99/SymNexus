<?php
$pageTitle = 'Request a Demonstration — Symnexus';
$pageMeta  = [
    'description' => 'Request a tailored demonstration of FluorocellAI or ComplianceCall. Domain specialists run every demonstration, not sales staff.',
    'og_image'    => img('scientistScope', 1200),
];

$steps = [
    ['01', 'Submit this form',            'Describe your organization type and the workflow you want to evaluate.'],
    ['02', 'Qualification call (15 min)', 'A member of our scientific team reviews your context and confirms a good fit.'],
    ['03', 'Tailored demonstration',      'A domain specialist walks through the platform using your workflow as the basis, skipping the generic tour.'],
    ['04', 'Evaluation access',           'Qualified teams receive full platform access for a structured evaluation period. We support you through it.'],
];

require SRC_DIR . '/includes/header.php';
?>

<?php partial('page-header', [
    'eyebrow' => 'Request a Demonstration',
    'title'   => 'See it in the context of',
    'highlight' => 'your workflow.',
    'lead'    => 'Every demonstration is conducted by a domain specialist and built around your workflow — your imaging modality, your cell type, your regulatory structure. Not a scripted product walkthrough.',
    'sublead' => 'Not evaluating FluorocellAI or ComplianceCall? We build domain-native software systems for many industries — tell us what you have in mind below.',
]); ?>

<div class="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 pb-8">

    <!-- Process + context -->
    <div class="lg:col-span-2 space-y-8">
        <div class="card-inset">
            <div class="flex items-center gap-3 mb-2">
                <div class="text-gray-500 dark:text-teal-400"><?= icon('clock', 'w-5 h-5') ?></div>
                <h2 class="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">How it works</h2>
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

        <div class="transform -rotate-1 shadow-xl rounded-3xl overflow-hidden border border-white/5 aspect-[16/9]">
            <img src="<?= e(img('labEquipment', 900)) ?>" alt="Laboratory research equipment" loading="lazy" decoding="async" class="w-full h-full object-cover">
        </div>

        <div class="card-inset">
            <h2 class="font-headline font-semibold text-lg text-gray-900 dark:text-white mb-4">Typical evaluation outcomes</h2>
            <ul class="space-y-3 font-sans text-sm text-gray-700 dark:text-gray-300">
                <?php foreach ([
                    'Segmentation accuracy benchmarks on your own imaging data',
                    'Integration guidance into your existing lab pipeline',
                    'A regulatory-benchmarking gap analysis against current federal requirements',
                    'Pricing recommendation matched to your deployment',
                ] as $item): ?>
                    <li class="flex items-start"><span class="w-2 h-2 mt-1.5 rounded-full bg-brandPrimary mr-2.5 flex-shrink-0" aria-hidden="true"></span><?= e($item) ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>

    <!-- Form -->
    <div class="lg:col-span-3">
        <?php partial('contact-form', [
            'form'         => 'demo',
            'withSubject'  => false,
            'heading'      => 'Tell us about your work.',
            'inputs'       => [
                ['firstName',    'First Name',    'text',  true,  'given-name'],
                ['lastName',     'Last Name',     'text',  true,  'family-name'],
                ['email',        'Email Address', 'email', true,  'email'],
                ['phone',        'Phone Number',  'tel',   false, 'tel'],
                ['organization', 'Organization',  'text',  true,  'organization'],
                ['role',         'Your Role',     'text',  false, 'organization-title'],
            ],
            'selects'      => [
                ['name' => 'product', 'label' => 'Product of Interest', 'required' => true, 'options' => ['' => 'Select a product'] + CONTACT_PRODUCTS],
                ['name' => 'labType', 'label' => 'Organization Type', 'required' => false, 'options' => ['' => 'Select type'] + CONTACT_ORG_TYPES],
            ],
            'textarea'     => ['name' => 'message', 'label' => 'Describe your workflow', 'rows' => 4, 'placeholder' => 'What are you imaging / what regulatory challenges are you facing? The more specific, the more useful our demonstration will be.'],
            'submitLabel'  => 'Request Demonstration',
            'footnote'     => 'We respond within one business day. No automated sales sequences.',
        ]); ?>
    </div>
</div>

<?php require SRC_DIR . '/includes/footer.php'; ?>
