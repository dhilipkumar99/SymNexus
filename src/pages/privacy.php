<?php
$pageTitle = 'Privacy Policy — Symnexus';
$pageMeta  = ['description' => 'How Symnexus collects, uses and protects information you share with us.'];

require SRC_DIR . '/includes/header.php';

partial('legal', [
    'eyebrow'  => 'Legal',
    'title'    => 'Privacy Policy',
    'meta'     => 'Last updated: January 2025',
    'sections' => [
        ['title' => 'Information We Collect',     'body' => 'Symnexus collects information you provide when you contact us, request a demonstration, or use our products. This includes name, email address, organization, and job title. We collect usage data from our software platforms to improve product functionality and reliability.'],
        ['title' => 'How We Use Your Information', 'body' => 'We use collected information to respond to enquiries, provide product demonstrations and evaluation access, improve our platforms, and communicate product updates relevant to your subscription. We do not sell personal information to third parties.'],
        ['title' => 'Data Security',              'body' => 'We implement industry-standard security measures including encryption in transit (TLS 1.3), encryption at rest (AES-256), and access controls aligned with our security policy. Data processed by Symnexus platforms is subject to our data processing agreements and is never used for purposes beyond service delivery.'],
        ['title' => 'Contact',                    'body' => 'For privacy-related enquiries, contact us at {email}.'],
    ],
]);

require SRC_DIR . '/includes/footer.php';
