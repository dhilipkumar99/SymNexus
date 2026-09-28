<?php

// Verified Unsplash image URLs. Use img() to request a specific width.
const IMG = [
    // Microscopy / cells
    'fluoroHero'      => 'https://images.unsplash.com/photo-1630959305606-3123a081dada',
    'fluoroCells'     => 'https://images.unsplash.com/photo-1572884267966-02340ebc90ac',
    'purpleCells'     => 'https://images.unsplash.com/photo-1576086213369-97a306d36557',
    'phytoplankton'   => 'https://images.unsplash.com/photo-1562156194-215edc144205',
    'cellGrowth'      => 'https://images.unsplash.com/photo-1716833323054-c0ea772156ad',

    // Lab environments
    'scientistScope'  => 'https://images.unsplash.com/photo-1631816285219-c6af3851e360',
    'labEquipment'    => 'https://images.unsplash.com/photo-1507413245164-6160d8298b31',
    'labGlassware'    => 'https://images.unsplash.com/photo-1614308459036-779d0dfe51ff',
    'microscopeSetup' => 'https://images.unsplash.com/photo-1518152006812-edab29b069ac',
    'labSamples'      => 'https://images.unsplash.com/photo-1605781231474-f60dea478e8a',
    'darkLab'         => 'https://images.unsplash.com/photo-1639775425635-fd86a889f2a7',

    // Compliance / documents / data
    'complianceDesk'  => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
    'labTeam'         => 'https://images.unsplash.com/photo-1579154204601-01588f351e67',
    'pipette'         => 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69',
    'labWork'         => 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120',
    'plantCell'       => 'https://images.unsplash.com/photo-1567016432779-094069958ea5',
    'techCircuit'     => 'https://images.unsplash.com/photo-1518770660439-4636190af475',
];

function img(string $key, int $width = 1200): string
{
    return IMG[$key] . '?w=' . $width . '&q=80&auto=format&fit=crop';
}
