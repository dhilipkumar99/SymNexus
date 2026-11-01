<?php
$pageTitle = 'Privacy Policy — Symnexus';
$pageMeta  = ['description' => 'How Symnexus collects, uses, shares, retains and protects personal information, and the rights you have over it.'];

require SRC_DIR . '/includes/header.php';

partial('legal', [
    'eyebrow'  => 'Legal',
    'title'    => 'Privacy Policy',
    'meta'     => 'Last updated: October 2026',
    'sections' => [
        [
            'title' => 'Who We Are',
            'body'  => SITE_LEGAL_NAME . ' ("Symnexus", "we", "us") designs and builds software systems for regulated and technical industries. This policy explains how we handle personal information collected through symnexus.co, our communications with you, and our business relationships. It does not cover data our customers process inside a Symnexus platform: that is governed by the customer\'s contract and data processing agreement with us, under which we act as a processor on the customer\'s instructions.',
        ],
        [
            'title' => 'Information We Collect',
            'body'  => 'We collect only what we need to respond to you and run our business:',
            'items' => [
                'Information you give us: your name, work email, organization, job title, phone number and the content of your message when you use our contact or demo request forms, email us, or book a meeting.',
                'Messages to our website assistant: what you type into the chat assistant, when it is available, so it can answer you.',
                'Business contact information: names, work email addresses and job titles of people at organizations we work with or may work with, from you, your colleagues, public professional sources or events.',
                'Technical information: when you visit the site, our hosting provider receives your IP address, browser type and the pages you request, as every web server does. We use cookie-free, aggregate analytics to count visits; they do not identify you or follow you across other websites.',
                'Email engagement: whether you replied to or unsubscribed from an email we sent you.',
            ],
            'after' => 'We do not knowingly collect sensitive personal information (such as health information) through the website, and ask that you do not send it to us through our forms.',
        ],
        [
            'title' => 'How We Use It',
            'body'  => 'We use personal information to:',
            'items' => [
                'respond to inquiries, arrange and run demonstrations and evaluations, and provide the products and services you or your organization have asked for;',
                'manage our customer and prospect relationships, including sending relevant business emails about our products (every such email has an unsubscribe link);',
                'operate, secure and improve our website and platforms, and prevent spam and abuse;',
                'meet legal, accounting and regulatory obligations, and establish or defend legal claims.',
            ],
            'after' => 'Where the EU or UK GDPR applies, we rely on our legitimate interests in running and growing a business-to-business company, on taking steps at your request before entering into a contract, on performing a contract, on legal obligations, and on your consent where we ask for it. We do not use personal information for automated decisions that have legal or similarly significant effects on you.',
        ],
        [
            'title' => 'Cookies and Similar Technologies',
            'body'  => 'The symnexus.co website does not set advertising or tracking cookies. It stores your light or dark theme choice in your browser\'s local storage, and a service worker keeps a copy of pages so the site works offline; both stay on your device. Our employee sign-in at symnexus-team.vercel.app uses a single essential session cookie. Our analytics are cookie-free. Because we use no non-essential cookies, we do not show a cookie banner.',
        ],
        [
            'title' => 'Who We Share It With',
            'body'  => 'We do not sell personal information, and we do not share it for cross-context behavioral advertising. We share it only with service providers (sub-processors) that help us run the business, under contracts that limit their use of it to providing their service to us:',
            'items' => [
                'Vercel Inc. — website and application hosting, and cookie-free web analytics (United States).',
                'Microsoft Corporation (Microsoft 365) — company email, calendars and outbound business email.',
                'Resend — delivery of website form submissions to our inbox (United States).',
                'Neon — database hosting for our internal customer relationship records (United States).',
                'Groq — the language model behind the website assistant, when it is available (United States).',
                'Google (Google Fonts) and Unsplash — fonts and images loaded by the website, which receive your IP address when your browser requests them.',
            ],
            'after' => 'We may also disclose information if required by law, to protect the rights, safety or property of Symnexus or others, or as part of a merger, acquisition or sale of assets, in which case this policy continues to apply to it.',
        ],
        [
            'title' => 'How Long We Keep It',
            'body'  => 'We keep personal information only as long as we need it for the purposes above:',
            'items' => [
                'Inquiries, demo requests and business contact records: for as long as we have an active relationship, then up to three years after our last contact, unless you ask us to delete them sooner.',
                'Unsubscribe requests: we keep the email address on a suppression list indefinitely, so that we never email you again.',
                'Website assistant messages: we do not store chat conversations; they are sent to our model provider only to generate a reply.',
                'Hosting and security logs: kept by our hosting provider for a short period, typically days, for operations and security.',
                'Customer and contract records: for as long as the contract runs and afterwards as required by tax and accounting law (generally up to seven years).',
            ],
        ],
        [
            'title' => 'Your Rights',
            'body'  => 'Depending on where you live, you may have the right to:',
            'items' => [
                'access the personal information we hold about you and receive a copy of it;',
                'correct inaccurate information, or have it deleted;',
                'object to or restrict how we use it, including objecting at any time to business emails;',
                'receive your information in a portable format;',
                'withdraw consent you have given, without affecting earlier processing;',
                'California residents: know what we collect and how we use and disclose it, delete and correct it, and opt out of sale or sharing (we do neither), without discrimination for exercising these rights.',
            ],
            'after' => 'To exercise any of these rights, email {email}. We will confirm your request, may ask for information to verify your identity, and will respond within 30 days (45 days where California law applies). You may use an authorized agent. If you are in the EU or UK, you may also complain to your local data protection authority.',
        ],
        [
            'title' => 'International Transfers',
            'body'  => 'We are based in the United States and our service providers process information in the United States. If you contact us from elsewhere, your information is transferred to and processed in the United States. Where the EU or UK GDPR applies, we rely on appropriate safeguards such as the European Commission\'s Standard Contractual Clauses, or the EU-U.S. Data Privacy Framework where a provider is certified under it.',
        ],
        [
            'title' => 'Data Security',
            'body'  => 'We use encryption in transit (TLS 1.3) and at rest (AES-256), access controls based on least privilege, and audit logging on our internal systems. No method of transmission or storage is completely secure, but we work to protect your information and will notify you and the relevant authorities of a breach where the law requires it. See our Security page for more detail.',
        ],
        [
            'title' => 'Children',
            'body'  => 'Our website and services are intended for businesses and professionals and are not directed to children under 16. We do not knowingly collect personal information from children.',
        ],
        [
            'title' => 'Changes to This Policy',
            'body'  => 'We will update this policy as our practices change and revise the date at the top. If a change materially affects how we use information we already hold, we will tell you directly where we can.',
        ],
        [
            'title' => 'Contact',
            'body'  => 'For privacy questions or requests, contact us at {email} or call ' . SITE_PHONE . '.',
        ],
    ],
]);

require SRC_DIR . '/includes/footer.php';
