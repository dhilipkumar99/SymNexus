<script lang="ts">
	// Schematic representation of the FluorocellAI segmentation/ROI view — not a literal screenshot.
	let { compact = false }: { compact?: boolean } = $props();

	const cells = [
		{ x: 18, y: 22, r: 13, flag: false },
		{ x: 42, y: 16, r: 10, flag: false },
		{ x: 63, y: 24, r: 15, flag: true },
		{ x: 82, y: 20, r: 9,  flag: false },
		{ x: 24, y: 48, r: 12, flag: false },
		{ x: 50, y: 52, r: 16, flag: false },
		{ x: 72, y: 46, r: 11, flag: false },
		{ x: 90, y: 55, r: 10, flag: false },
		{ x: 14, y: 76, r: 11, flag: false },
		{ x: 38, y: 80, r: 14, flag: true },
		{ x: 60, y: 74, r: 10, flag: false },
		{ x: 84, y: 78, r: 13, flag: false },
	];
</script>

<div class="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1414]" role="img" aria-label="Illustrative FluorocellAI segmentation and QC audit-trail interface — automated cell detection with region-of-interest overlays and pass/flag counts.">
	<!-- Window chrome -->
	<div class="flex items-center gap-1.5 border-b border-white/5 bg-[#0f1a1a] px-4 py-2.5">
		<span class="h-2 w-2 rounded-full bg-white/15"></span>
		<span class="h-2 w-2 rounded-full bg-white/15"></span>
		<span class="h-2 w-2 rounded-full bg-white/15"></span>
		<span class="ml-3 font-mono text-[0.6rem] text-white/25">fluorocellai — segmentation view</span>
	</div>

	<div class="grid grid-cols-1 {compact ? '' : 'md:grid-cols-[1fr,220px]'}">
		<!-- Segmentation canvas -->
		<div class="relative aspect-[4/3] md:aspect-auto" style="background: radial-gradient(ellipse at 30% 20%, rgba(64,224,208,0.08), transparent 60%), #081010;">
			<svg viewBox="0 0 100 100" class="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
				{#each cells as c}
					<circle cx={c.x} cy={c.y} r={c.r} fill={c.flag ? 'rgba(230,120,120,0.12)' : 'rgba(64,224,208,0.10)'} stroke={c.flag ? '#e67878' : '#40e0d0'} stroke-width="0.6" />
					<circle cx={c.x} cy={c.y} r="1.1" fill={c.flag ? '#e67878' : '#40e0d0'} />
				{/each}
			</svg>
			<div class="absolute left-3 top-3 rounded-md bg-black/40 px-2.5 py-1 font-mono text-[0.62rem] text-white/70 backdrop-blur-sm">
				12 detected · <span class="text-[#e67878]">2 flagged</span>
			</div>
			<div class="absolute bottom-3 right-3 rounded-md bg-black/40 px-2.5 py-1 font-mono text-[0.6rem] text-[#40e0d0] backdrop-blur-sm">
				QC: automatic
			</div>
		</div>

		<!-- Side panel: audit trail -->
		{#if !compact}
			<div class="border-t border-white/5 bg-[#0d1717] p-4 md:border-l md:border-t-0">
				<p class="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-white/30 mb-3">Audit Trail</p>
				<ul class="space-y-2.5">
					{#each [
						{ t: '10:41:02', l: 'Batch ingested', ok: true },
						{ t: '10:41:14', l: 'Segmentation complete', ok: true },
						{ t: '10:41:15', l: '2 cells flagged for review', ok: false },
						{ t: '10:41:16', l: 'Report generated', ok: true },
					] as row}
						<li class="flex items-start gap-2">
							<span class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full" style="background:{row.ok ? '#40e0d0' : '#e67878'};"></span>
							<div>
								<p class="font-mono text-[0.58rem] text-white/25">{row.t}</p>
								<p class="font-body text-[0.68rem] text-white/60 leading-tight">{row.l}</p>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</div>
