<?php

// Custom AI development service, shared by the home, services and pricing pages.

// What we build. `family` names the SymNexus model family behind it (see /products).
const SERVICE_CAPABILITIES = [
    ['icon' => 'users',        'title' => 'AI agents & assistants',        'family' => 'Gen · Decide',
     'body' => 'Assistants that know your business and cite their sources, and agents that route requests, answer account questions and hand exceptions to a person when it matters.'],
    ['icon' => 'document',     'title' => 'Document & data automation',    'family' => 'Extract',
     'body' => 'Read every message, form and filing. Route it, tag it and pull out the fields your team retypes today, with an audit trail behind every result.'],
    ['icon' => 'beaker',       'title' => 'Computer vision',                'family' => 'Vision',
     'body' => 'Find, count and outline what is in every image, from microscopy to product photos and inspection footage. The discipline behind FluorocellAI.'],
    ['icon' => 'clock',        'title' => 'Prediction & forecasting',       'family' => 'Predict · Forecast',
     'body' => 'Churn, lead scoring, demand, maintenance and risk: forward-looking answers from the data you already have, each with the reasons behind it.'],
    ['icon' => 'shield-check', 'title' => 'Monitoring & anomaly detection', 'family' => 'Sentinel',
     'body' => 'Learn what normal looks like in your operations, then flag fraud, failing equipment, bad records and quality issues before a customer sees them.'],
    ['icon' => 'squares',      'title' => 'Matching, voice & decisions',    'family' => 'Match · Voice · Decide',
     'body' => 'Personalisation, record matching, call sentiment and voice verification, and allocation decisions that improve week after week.'],
];

// How an engagement runs.
const SERVICE_PROCESS = [
    ['01', 'Scoping call',           'We learn how your team works today, where the manual effort is, and what a good result would be worth.'],
    ['02', 'Prove it on your data',  'Before you commit to a build, we prove the model on your own data, so the decision rests on evidence, not a sales deck.'],
    ['03', 'Build & integrate',      'Our engineers build the system into your existing tools and workflows, rather than asking your team to adopt a new platform.'],
    ['04', 'Validate with your experts', 'The people who will use it check it against their own judgement before it goes live, with an audit trail behind every result.'],
    ['05', 'Hand off & train',       'We train your team to run the system independently, and stay on to monitor, extend and improve it if you want us to.'],
];

// Productized engagements. Pricing is quoted per engagement.
const SERVICE_TIERS = [
    [
        'id'      => 'sprint',
        'name'    => 'AI Opportunity Sprint',
        'tagline' => 'Find the use case worth building.',
        'body'    => 'A focused engagement to map your workflows, rank where AI pays back first, and prove the top candidate on a sample of your data.',
        'items'   => ['Workflow and data review with your team', 'Ranked shortlist of AI use cases', 'Working prototype on your own data', 'Build plan, scope and quote for the next step'],
    ],
    [
        'id'      => 'pilot',
        'name'    => 'Pilot Build',
        'tagline' => 'Ship one system into production.',
        'body'    => 'We build the chosen system into your tools, validate it with the people who will use it, and measure it against the result we agreed up front.',
        'items'   => ['Production system integrated with your stack', 'Validated by your domain experts before go-live', 'Audit trail and access controls by design', 'Evaluation report against the agreed metric'],
        'featured' => true,
    ],
    [
        'id'      => 'scale',
        'name'    => 'Scale & Operate',
        'tagline' => 'Extend, monitor and hand over.',
        'body'    => 'An ongoing engagement to roll the system out to more teams and sites, add new capabilities, and train your team to run it independently.',
        'items'   => ['Roll-out to further teams, sites and data', 'Monitoring and model improvement', 'New capabilities on the same stack', 'Training so your team runs it independently'],
    ],
];

// Where our engineers trained and worked (shown as plain text, not logos).
const TEAM_PEDIGREE = ['Amazon', 'Zoom', 'ServiceNow', 'NXP Semiconductors', 'Stanford', 'UC Berkeley'];
