<script lang="ts">
	import { IMG } from '$lib/images';
	import ComplianceMock from '$lib/components/products/ComplianceMock.svelte';
</script>

<svelte:head>
	<title>ComplianceCall — SymNexus</title>
	<meta name="description" content="ComplianceCall: benchmarks pharmaceutical development against federal regulation. Full audit-trail transparency, built in by design for FDA-regulated teams." />
</svelte:head>

<!-- Hero -->
<section class="relative w-full overflow-hidden bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-20">
	<div class="pointer-events-none absolute inset-0" style="background: radial-gradient(ellipse 80% 60% at 15% 0%, rgba(123,143,232,0.12) 0%, transparent 55%)"></div>
	<div class="container-page relative z-10">
		<div style="animation: fade-up 0.9s cubic-bezier(0.23,1.01,0.32,1) 0.1s both;">
			<p class="font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em]" style="color:#7b8fe8;">Regulatory Compliance</p>
			<h1 class="mt-3 font-display text-5xl font-normal italic leading-[1.05] tracking-tight text-white md:text-6xl max-w-3xl">
				ComplianceCall
			</h1>
			<p class="mt-5 max-w-xl font-body text-base leading-relaxed text-slate-300 md:text-lg">
				ComplianceCall benchmarks pharmaceutical development against federal regulation — auditable, always current, and built for the teams who answer to FDA and other regulatory bodies.
			</p>
			<div class="mt-8 flex flex-wrap gap-4">
				<a href="/demo" class="btn-hero-primary">Request Demonstration</a>
				<a href="/compliancecall/pricing" class="btn-hero-secondary">View Pricing</a>
			</div>
		</div>
		<div class="mt-12 max-w-2xl" style="animation: fade-up 0.9s cubic-bezier(0.23,1.01,0.32,1) 0.3s both;">
			<ComplianceMock />
			<p class="mt-3 font-body text-[0.68rem] text-white/25">Illustrative interface preview. Request a demonstration to see the live product.</p>
		</div>
	</div>
</section>

<!-- Overview -->
<section id="overview" class="bg-warm-white py-24 md:py-32">
	<div class="container-page">
		<div class="grid gap-16 md:grid-cols-2 md:gap-24 items-start">
			<div class="reveal">
				<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em]" style="color:#7b8fe8;">Platform Overview</p>
				<h2 class="mt-4 font-display text-3xl font-normal italic leading-snug text-slate-900 md:text-4xl">
					The historical record your auditors ask for, generated automatically.
				</h2>
				<p class="mt-5 font-body text-base leading-relaxed text-slate-500">
					ComplianceCall tracks not just a chemical's current hazard category, but what it used to be and why it changed — full audit-trail transparency built into the platform by design, not bolted on after the fact.
				</p>
				<p class="mt-4 font-body text-sm leading-relaxed text-slate-400">
					Built on the same modular AI stack as FluorocellAI — ingestion, data lake, fine-tuned models, agents, and copilot — letting us extend coverage to new regulatory jurisdictions without rebuilding from scratch.
				</p>
				<div class="mt-8 flex flex-wrap gap-3">
					<a href="/demo" class="btn-primary">Request Demonstration</a>
					<a href="/compliancecall/pricing" class="btn-secondary">View Pricing</a>
				</div>
			</div>
			<!-- Coverage checklist -->
			<div class="reveal rounded-2xl border border-slate-200/60 overflow-hidden" style="background:#0d1320;">
				<div class="border-b border-white/5 px-6 py-4 flex items-center justify-between">
					<span class="font-mono text-[0.6rem] font-medium uppercase tracking-[0.18em] text-white/30">Platform Coverage</span>
				</div>
				<ul class="divide-y divide-white/[0.05]">
					{#each [
						'Live Federal Regulatory Benchmarking',
						'Historical Hazard Category Tracking',
						'Full Audit-Trail Transparency',
						'Document Control — version history so a superseded SOP can never be mistaken for current',
						'FDA Filing Support — submission-ready records, not a scramble before the deadline',
						'Multi-Site Program Management — one compliance record across every site, not one per location',
					] as mod}
						<li class="flex items-center gap-3 px-6 py-3">
							<span class="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border text-[9px] font-bold" style="border-color:#7b8fe8; color:#7b8fe8; background:rgba(123,143,232,0.1);">✓</span>
							<span class="font-body text-[0.78rem] text-white/65">{mod}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>

<!-- Pull quote -->
<section class="relative overflow-hidden border-y border-slate-200/60 bg-slate-950 py-16 md:py-20">
	<div class="container-page relative z-10">
		<blockquote class="reveal max-w-2xl font-display text-xl font-normal italic leading-relaxed text-white md:text-2xl">
			&ldquo;It tells us not just what a chemical's current hazard category is, but what it used to be and why it changed. That historical record is exactly what our EHS auditors ask for.&rdquo;
		</blockquote>
		<p class="reveal mt-4 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-white/40">Dr. S. Okonkwo — Chemical Hygiene Officer, Research University · ComplianceCall pilot customer</p>
	</div>
</section>

<!-- Capabilities -->
<section class="bg-paper py-24 md:py-32">
	<div class="container-page">
		<div class="reveal mb-12">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em]" style="color:#7b8fe8;">Key Capabilities</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">Designed for every role in the pharmaceutical compliance chain.</h2>
		</div>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each [
				{title:'Historical hazard tracking',   body:'Not just a chemical\'s current hazard category, but what it used to be and why it changed — the record EHS and regulatory auditors ask for.'},
				{title:'Live federal regulatory sync',   body:'Benchmarks pharmaceutical development against current federal regulation, so requirements surface automatically rather than at the next review.'},
				{title:'Full audit-trail transparency',  body:'Every action is logged, attributable, and exportable by design — critical trust infrastructure for teams operating under FDA and other regulatory bodies.'},
				{title:'Document control', body:'Version history and access logs mean a superseded SOP can never be mistaken for the current one — the ambiguity that turns into a finding during an audit.'},
				{title:'Shared modular AI stack',       body:'Runs on the same ingestion, data lake, and fine-tuned-model architecture as FluorocellAI, letting us extend coverage to new jurisdictions without rebuilding.'},
				{title:'Built for FDA filings',       body:'ComplianceCall\'s regulatory benchmarking is built for teams filing into the FDA process — the majority of the world\'s pharmaceutical applications.'},
			] as feat, i}
				<div class="reveal rounded-2xl border border-slate-200/60 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style="transition-delay:{i*50}ms;">
					<div class="mb-3 h-0.5 w-8 rounded-full" style="background:#7b8fe8;"></div>
					<h3 class="font-heading text-sm font-semibold text-slate-900">{feat.title}</h3>
					<p class="mt-2 font-body text-sm leading-relaxed text-slate-400">{feat.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Who uses it -->
<section class="bg-warm-white border-t border-slate-200/60 py-24 md:py-28">
	<div class="container-page">
		<div class="reveal mb-12">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em]" style="color:#7b8fe8;">Who Uses ComplianceCall</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">Built for every pharmaceutical compliance role.</h2>
		</div>
		<div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
			{#each [
				{role:'Pharma & Biotech R&D Teams', desc:'Maintain a continuously auditable compliance record as development progresses toward FDA filing.'},
				{role:'Regulatory Affairs Teams',         desc:'Benchmark development against current federal regulation automatically, rather than reconstructing history at audit time.'},
				{role:'Chemical Hygiene & EHS Officers',             desc:'Access the historical hazard-category record — not just current status — that EHS audits require.'},
				{role:'Compliance Officers',desc:'Full audit-trail transparency surfaces gaps proactively, built into the platform rather than reconstructed after the fact.'},
			] as uc, i}
				<div class="reveal rounded-2xl border border-slate-200/60 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style="transition-delay:{i*60}ms;">
					<div class="mb-3 h-1 w-6 rounded-full" style="background:#7b8fe8;"></div>
					<h3 class="font-heading text-sm font-semibold text-slate-900">{uc.role}</h3>
					<p class="mt-2 font-body text-xs leading-relaxed text-slate-400">{uc.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA -->
<section class="relative overflow-hidden bg-slate-950 py-24 md:py-32">
	<img src={IMG.complianceDesk} alt="" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover opacity-15" loading="lazy" />
	<div class="pointer-events-none absolute inset-0" style="background: radial-gradient(ellipse 70% 60% at 5% 90%, rgba(123,143,232,0.15) 0%, transparent 55%)"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 to-transparent"></div>
	<div class="container-page relative z-10">
		<div class="reveal flex flex-wrap items-center justify-between gap-10">
			<div class="max-w-xl">
				<h2 class="font-display text-3xl font-normal italic text-white md:text-4xl">Speak with a compliance specialist.</h2>
				<p class="mt-4 font-body text-sm leading-relaxed text-slate-400">ComplianceCall demonstrations are conducted by domain specialists, not sales staff. We review your current compliance posture before the call so the conversation is immediately relevant to your work.</p>
			</div>
			<div class="flex flex-wrap gap-4">
				<a href="/demo" class="btn-hero-primary">Request Demonstration</a>
				<a href="/compliancecall/pricing" class="btn-hero-secondary">View Pricing</a>
			</div>
		</div>
	</div>
</section>
