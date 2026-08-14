<script lang="ts">
	// Schematic representation of the ComplianceCall regulatory dashboard — not a literal screenshot.
	let { compact = false }: { compact?: boolean } = $props();

	const rows = [
		{ label: 'Hazard classification — Compound A-114', status: 'current', updated: 'Synced today' },
		{ label: 'Hazard classification — Compound B-207', status: 'changed', updated: 'Updated 2 days ago' },
		{ label: 'Federal filing checklist', status: 'current', updated: 'Synced today' },
		{ label: 'Document control log', status: 'current', updated: 'Synced today' },
	];
</script>

<div class="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d16]" role="img" aria-label="Illustrative ComplianceCall regulatory dashboard interface — live hazard-classification benchmarking with historical change tracking and audit log.">
	<div class="flex items-center gap-1.5 border-b border-white/5 bg-[#12121f] px-4 py-2.5">
		<span class="h-2 w-2 rounded-full bg-white/15"></span>
		<span class="h-2 w-2 rounded-full bg-white/15"></span>
		<span class="h-2 w-2 rounded-full bg-white/15"></span>
		<span class="ml-3 font-mono text-[0.6rem] text-white/25">compliancecall — regulatory dashboard</span>
	</div>

	<div class="p-4 {compact ? '' : 'md:p-5'}">
		<div class="mb-4 flex items-center justify-between">
			<p class="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-white/30">Live Regulatory Benchmark</p>
			<span class="rounded-full bg-[#7b8fe8]/15 px-2 py-0.5 font-mono text-[0.56rem] text-[#7b8fe8]">FDA — synced</span>
		</div>
		<ul class="space-y-2">
			{#each rows as row}
				<li class="flex items-center justify-between gap-3 rounded-lg bg-white/[0.03] px-3 py-2.5">
					<div class="min-w-0">
						<p class="truncate font-body text-[0.72rem] text-white/75">{row.label}</p>
						<p class="font-mono text-[0.58rem] text-white/25">{row.updated}</p>
					</div>
					<span
						class="flex-shrink-0 rounded-full px-2 py-0.5 font-mono text-[0.56rem] uppercase tracking-[0.06em]"
						style={row.status === 'changed' ? 'background:rgba(230,120,120,0.15); color:#e67878;' : 'background:rgba(123,143,232,0.15); color:#7b8fe8;'}
					>
						{row.status === 'changed' ? 'Changed' : 'Current'}
					</span>
				</li>
			{/each}
		</ul>
		{#if !compact}
			<div class="mt-4 rounded-lg border border-dashed border-white/10 px-3 py-2.5">
				<p class="font-mono text-[0.58rem] text-white/30">Audit trail: 4 events logged, all attributable</p>
			</div>
		{/if}
	</div>
</div>
