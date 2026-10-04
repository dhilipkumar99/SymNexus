<?php
$pageTitle = 'Terms of Use — SymNexus';
$pageMeta  = ['description' => 'The terms that govern use of SymNexus platforms and this website.'];

require SRC_DIR . '/includes/header.php';

partial('legal', [
    'eyebrow'  => 'Legal',
    'title'    => 'Terms of Use',
    'meta'     => 'Last updated: January 2025',
    'sections' => [
        ['title' => 'Acceptance of Terms',     'body' => 'By accessing or using any SymNexus platform or website, you agree to be bound by these terms. If you are accessing our platforms on behalf of an organization, you represent that you have the authority to bind that organization to these terms.'],
        ['title' => 'License and Permitted Use', 'body' => 'SymNexus grants you a limited, non-exclusive, non-transferable license to use our platforms for their intended scientific and research purposes. You may not reverse engineer, resell, or redistribute our software or its outputs without written authorization.'],
        ['title' => 'Intellectual Property',   'body' => 'All SymNexus platforms, documentation, and associated intellectual property remain the exclusive property of Symnexus Ltd. Your data remains yours — we assert no ownership over data processed through our platforms.'],
        ['title' => 'Contact',                 'body' => 'For terms-related enquiries, contact us at {email}.'],
    ],
]);

require SRC_DIR . '/includes/footer.php';
