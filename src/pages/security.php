<?php
$pageTitle = 'Security — Symnexus';
$pageMeta  = ['description' => 'Our commitment to data security across regulated environments.'];

require SRC_DIR . '/includes/header.php';

partial('legal', [
    'eyebrow'  => 'Security',
    'title'    => 'Security Policy',
    'meta'     => 'Our commitment to data security across regulated environments.',
    'sections' => [
        ['title' => 'Compliance Certifications',       'body' => 'Symnexus is pursuing SOC 2 Type II certification, with a target completion aligned to our next major customer cohort. We disclose our current audit status directly to any prospective customer during evaluation — ask your account contact for the latest status and timeline.'],
        ['title' => 'Encryption',                      'body' => 'Data transmitted between clients and Symnexus platforms is encrypted in transit. Data at rest is encrypted using industry-standard methods, with access to encryption keys restricted to authorized systems.'],
        ['title' => 'Access Controls',                 'body' => 'Symnexus platforms implement role-based access control (RBAC) with a principle of least privilege. Multi-factor authentication is available on all platforms.'],
        ['title' => 'Data Residency & Sub-Processors', 'body' => 'Customer data is hosted in U.S. data centers. We maintain a current list of infrastructure and processing sub-processors and will provide it, along with data residency specifics for your deployment, on request during evaluation or contracting.'],
        ['title' => 'Vulnerability Disclosure',        'body' => 'We take security vulnerability reports seriously. If you believe you have identified a security vulnerability in a Symnexus platform, please contact {email} and we will work with you on responsible disclosure and remediation.'],
        ['title' => 'Infrastructure',                  'body' => 'Symnexus infrastructure runs on reputable cloud providers, with monitoring in place for our production environments.'],
        ['title' => 'Incident Response',               'body' => 'In the event of a security incident affecting customer data, we will notify affected customers without undue delay and in no case later than 72 hours after confirmation, consistent with applicable data protection regulations, and will work with you directly on remediation.'],
    ],
]);

require SRC_DIR . '/includes/footer.php';
