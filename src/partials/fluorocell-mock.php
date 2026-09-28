<?php
// Schematic representation of the FluorocellAI segmentation/ROI view — not a literal screenshot.
$cells = [
    [18, 22, 13, false], [42, 16, 10, false], [63, 24, 15, true],  [82, 20, 9, false],
    [24, 48, 12, false], [50, 52, 16, false], [72, 46, 11, false], [90, 55, 10, false],
    [14, 76, 11, false], [38, 80, 14, true],  [60, 74, 10, false], [84, 78, 13, false],
];
$audit = [
    ['10:41:02', 'Batch ingested', true],
    ['10:41:14', 'Segmentation complete', true],
    ['10:41:15', '2 cells flagged for review', false],
    ['10:41:16', 'Report generated', true],
];
?>
<div class="w-full h-full overflow-hidden bg-slate-950 text-left font-body" role="img"
    aria-label="Illustrative FluorocellAI segmentation and QC audit-trail interface — automated cell detection with region-of-interest overlays and pass/flag counts.">
    <div class="flex items-center gap-1.5 border-b border-white/5 bg-slate-900 px-4 py-2.5">
        <span class="h-2 w-2 rounded-full bg-white/15"></span>
        <span class="h-2 w-2 rounded-full bg-white/15"></span>
        <span class="h-2 w-2 rounded-full bg-white/15"></span>
        <span class="ml-3 font-mono text-[0.6rem] text-white/30">fluorocellai — segmentation view</span>
    </div>
    <div class="grid grid-cols-[1fr,150px] sm:grid-cols-[1fr,190px] h-[calc(100%-33px)] min-h-[220px]">
        <div class="relative bg-[radial-gradient(ellipse_at_30%_20%,rgba(0,150,136,0.18),transparent_60%)]">
            <svg viewBox="0 0 100 100" class="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
                <?php foreach ($cells as [$x, $y, $r, $flag]): ?>
                    <circle cx="<?= $x ?>" cy="<?= $y ?>" r="<?= $r ?>" fill="<?= $flag ? 'rgba(244,63,94,0.14)' : 'rgba(45,212,191,0.10)' ?>" stroke="<?= $flag ? '#fb7185' : '#2dd4bf' ?>" stroke-width="0.6" />
                    <circle cx="<?= $x ?>" cy="<?= $y ?>" r="1.1" fill="<?= $flag ? '#fb7185' : '#2dd4bf' ?>" />
                <?php endforeach; ?>
            </svg>
            <div class="absolute left-3 top-3 rounded-md bg-black/50 px-2.5 py-1 font-mono text-[0.62rem] text-white/80 backdrop-blur-sm">
                12 detected · <span class="text-rose-400">2 flagged</span>
            </div>
            <div class="absolute bottom-3 left-3 rounded-md bg-black/50 px-2.5 py-1 font-mono text-[0.6rem] text-teal-300 backdrop-blur-sm">
                QC: automatic
            </div>
        </div>
        <div class="border-l border-white/5 bg-slate-900/70 p-4">
            <p class="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-white/40 mb-3">Audit Trail</p>
            <ul class="space-y-2.5">
                <?php foreach ($audit as [$t, $label, $ok]): ?>
                    <li class="flex items-start gap-2">
                        <span class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full <?= $ok ? 'bg-teal-400' : 'bg-rose-400' ?>"></span>
                        <div>
                            <p class="font-mono text-[0.58rem] text-white/30"><?= e($t) ?></p>
                            <p class="text-[0.68rem] text-white/70 leading-tight"><?= e($label) ?></p>
                        </div>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>
</div>
