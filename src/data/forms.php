<?php

// Option lists shared by the enquiry forms (src/pages/contact.php, demo.php) and
// their server-side validation (src/backend/contact.php) — one source of truth.
// Keys double as ?interest= values that preselect the option (see partials/contact-form.php).
const CONTACT_PRODUCTS = [
    'custom'         => 'Custom AI development',
    'sprint'         => 'AI Opportunity Sprint',
    'pilot'          => 'Pilot Build',
    'scale'          => 'Scale & Operate',
    'fluorocellai'   => 'FluorocellAI',
    'compliancecall' => 'ComplianceCall',
    'unsure'         => 'Not sure yet',
];

// No longer shown on the forms; still accepted from older cached pages.
const CONTACT_ORG_TYPES = [
    'cancer'     => 'Cancer-Research Institute',
    'academic'   => 'Academic Cell-Biology Core',
    'cro'        => 'Contract Research Organization',
    'pharma'     => 'Pharma / Biotech R&D',
    'regulatory' => 'Regulatory Affairs Team',
    'other'      => 'Other',
];
