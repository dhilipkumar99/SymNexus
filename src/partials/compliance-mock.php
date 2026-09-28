<?php
// Schematic representation of the ComplianceCall regulatory dashboard — not a literal screenshot.
$rows = [
    ['Hazard classification — Compound A-114', false, 'Synced today'],
    ['Hazard classification — Compound B-207', true,  'Updated 2 days ago'],
    ['Federal filing checklist',               false, 'Synced today'],
    ['Document control log',                   false, 'Synced today'],
];
?>
<div class="w-full h-full overflow-hidden bg-slate-950 text-left font-body" role="img"
    aria-label="Illustrative ComplianceCall regulatory dashboard interface — live hazard-classification benchmarking with historical change tracking and audit log.">
    <div class="flex items-center gap-1.5 border-b border-white/5 bg-slate-900 px-4 py-2.5">
        <span class="h-2 w-2 rounded-full bg-white/15"></span>
        <span class="h-2 w-2 rounded-full bg-white/15"></span>
        <span class="h-2 w-2 rounded-full bg-white/15"></span>
        <span class="ml-3 font-mono text-[0.6rem] text-white/60">compliancecall — regulatory dashboard</span>
    </div>
    <div class="p-4 sm:p-5">
        <div class="mb-4 flex items-center justify-between">
            <p class="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-white/60">Live Regulatory Benchmark</p>
            <span class="rounded-full bg-teal-400/15 px-2 py-0.5 font-mono text-[0.56rem] text-teal-300">FDA — synced</span>
        </div>
        <ul class="space-y-2">
            <?php foreach ($rows as [$label, $changed, $updated]): ?>
                <li class="flex items-center justify-between gap-3 rounded-lg bg-white/[0.04] px-3 py-2.5">
                    <div class="min-w-0">
                        <p class="truncate text-[0.72rem] text-white/80"><?= e($label) ?></p>
                        <p class="font-mono text-[0.58rem] text-white/60"><?= e($updated) ?></p>
                    </div>
                    <span class="flex-shrink-0 rounded-full px-2 py-0.5 font-mono text-[0.56rem] uppercase tracking-[0.06em] <?= $changed ? 'bg-rose-400/15 text-rose-300' : 'bg-teal-400/15 text-teal-300' ?>">
                        <?= $changed ? 'Changed' : 'Current' ?>
                    </span>
                </li>
            <?php endforeach; ?>
        </ul>
        <div class="mt-4 rounded-lg border border-dashed border-white/10 px-3 py-2.5">
            <p class="font-mono text-[0.58rem] text-white/60">Audit trail: 4 events logged, all attributable</p>
        </div>
    </div>
</div>
