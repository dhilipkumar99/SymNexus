<?php

// Option lists shared by the enquiry forms (src/pages/contact.php, demo.php) and
// their server-side validation (src/backend/contact.php) — one source of truth.
const CONTACT_PRODUCTS = [
    'fluorocellai'   => 'FluorocellAI',
    'compliancecall' => 'ComplianceCall',
    'both'           => 'Both products',
    'custom'         => 'Something else — custom system',
];

const CONTACT_ORG_TYPES = [
    'cancer'     => 'Cancer-Research Institute',
    'academic'   => 'Academic Cell-Biology Core',
    'cro'        => 'Contract Research Organization',
    'pharma'     => 'Pharma / Biotech R&D',
    'regulatory' => 'Regulatory Affairs Team',
    'other'      => 'Other',
];
