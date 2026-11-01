<?php

// Employee messaging (team/, a separate Vercel project).
const TEAM_LOGIN_URL = 'https://app.symnexus.co/login';

// Company profiles: shown in the footer and as JSON-LD sameAs once a URL is set.
const SOCIAL_LINKS = [
    ['label' => 'LinkedIn',    'icon' => 'linkedin', 'href' => ''],
    ['label' => 'YouTube',     'icon' => 'youtube',  'href' => ''],
    ['label' => 'X (Twitter)', 'icon' => 'x',        'href' => ''],
];

/** SOCIAL_LINKS entries that have a URL. */
function social_links(): array
{
    return array_values(array_filter(SOCIAL_LINKS, static fn(array $l): bool => $l['href'] !== ''));
}

// Primary navigation. `match` lists every path prefix that highlights the link.
const NAV_LINKS = [
    // FluorocellAI and ComplianceCall are presented on the About page.
    ['label' => 'About',    'href' => '/about',    'match' => ['/about', '/fluorocellai', '/compliancecall']],
    ['label' => 'Products', 'href' => '/products', 'match' => ['/products']],
    ['label' => 'Research', 'href' => '/research', 'match' => ['/research']],
    ['label' => 'Pricing',  'href' => '/pricing',  'match' => ['/pricing']],
    ['label' => 'Careers',  'href' => '/careers',  'match' => ['/careers']],
    ['label' => 'Contact',  'href' => '/contact',  'match' => ['/contact']],
];

const FOOTER_LINKS = [
    ['label' => 'Home',     'href' => '/'],
    ['label' => 'About',    'href' => '/about'],
    ['label' => 'Products', 'href' => '/products'],
    ['label' => 'Pricing',  'href' => '/pricing'],
    ['label' => 'Research', 'href' => '/research'],
    ['label' => 'Careers',  'href' => '/careers'],
    ['label' => 'Contact',  'href' => '/contact'],
    ['label' => 'Team login', 'href' => TEAM_LOGIN_URL],
];

const LEGAL_LINKS = [
    ['label' => 'Privacy',  'href' => '/privacy'],
    ['label' => 'Terms',    'href' => '/terms'],
    ['label' => 'Security', 'href' => '/security'],
];

function nav_is_active(array $link): bool
{
    foreach ($link['match'] as $prefix) {
        if (is_active($prefix)) {
            return true;
        }
    }
    return false;
}
