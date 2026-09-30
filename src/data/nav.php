<?php

// Primary navigation. `match` lists every path prefix that highlights the link.
const NAV_LINKS = [
    ['label' => 'About',    'href' => '/about',    'match' => ['/about']],
    // /solutions lives under Products: a seventh link doesn't fit the desktop pill below ~1300px.
    ['label' => 'Products', 'href' => '/products', 'match' => ['/products', '/solutions', '/fluorocellai', '/compliancecall']],
    ['label' => 'Research', 'href' => '/research', 'match' => ['/research']],
    ['label' => 'Pricing',  'href' => '/pricing',  'match' => ['/pricing']],
    ['label' => 'Careers',  'href' => '/careers',  'match' => ['/careers']],
    ['label' => 'Contact',  'href' => '/contact',  'match' => ['/contact']],
];

const FOOTER_LINKS = [
    ['label' => 'Home',     'href' => '/'],
    ['label' => 'About',    'href' => '/about'],
    ['label' => 'Products', 'href' => '/products'],
    ['label' => 'Solutions', 'href' => '/solutions'],
    ['label' => 'Pricing',  'href' => '/pricing'],
    ['label' => 'Research', 'href' => '/research'],
    ['label' => 'Careers',  'href' => '/careers'],
    ['label' => 'Contact',  'href' => '/contact'],
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
