<?php

// Employee messaging (team/, a separate Vercel project).
const TEAM_LOGIN_URL = 'https://symnexus-team.vercel.app/login';

// Primary navigation. `match` lists every path prefix that highlights the link.
// Careers and Team login live in the footer only.
const NAV_LINKS = [
    ['label' => 'Services',     'href' => '/services', 'match' => ['/services']],
    ['label' => 'Case Studies', 'href' => '/research', 'match' => ['/research']],
    ['label' => 'Models',       'href' => '/products', 'match' => ['/products']],
    // FluorocellAI and ComplianceCall are presented on the About page.
    ['label' => 'About',        'href' => '/about',    'match' => ['/about', '/fluorocellai', '/compliancecall']],
    ['label' => 'Pricing',      'href' => '/pricing',  'match' => ['/pricing']],
    ['label' => 'Contact',      'href' => '/contact',  'match' => ['/contact']],
];

// The one primary call to action, used in the header and across pages.
const PRIMARY_CTA = ['label' => 'Book a scoping call', 'href' => '/demo'];

const FOOTER_LINKS = [
    ['label' => 'Home',         'href' => '/'],
    ['label' => 'Services',     'href' => '/services'],
    ['label' => 'Case Studies', 'href' => '/research'],
    ['label' => 'Models',       'href' => '/products'],
    ['label' => 'About',        'href' => '/about'],
    ['label' => 'Pricing',      'href' => '/pricing'],
    ['label' => 'Careers',      'href' => '/careers'],
    ['label' => 'Contact',      'href' => '/contact'],
    ['label' => 'Team login',   'href' => TEAM_LOGIN_URL],
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
