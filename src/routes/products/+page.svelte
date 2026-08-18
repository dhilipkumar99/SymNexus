<script lang="ts">
	import FluorocellMock from '$lib/components/products/FluorocellMock.svelte';
	import ComplianceMock from '$lib/components/products/ComplianceMock.svelte';
</script>

<svelte:head>
	<title>Products — SymNexus</title>
	<meta name="description" content="FluorocellAI: AI-automated cell image analysis. ComplianceCall: live pharmaceutical compliance tracking against federal regulation. Two products, explained." />
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden bg-slate-950 pt-40 pb-20 md:pt-52 md:pb-24">
	<div class="aurora opacity-35" aria-hidden="true"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
	<div class="container-page relative z-10">
		<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose/80">Products</p>
		<h1 class="mt-4 font-display text-5xl font-normal italic leading-[1.05] tracking-tight text-white md:text-6xl max-w-2xl">
			Built for two workflows where a wrong answer has consequences.
		</h1>
		<p class="mt-5 max-w-xl font-body text-base leading-relaxed text-slate-400 md:text-lg">
			FluorocellAI automates cell image analysis for research labs. ComplianceCall tracks pharmaceutical development against federal regulation. No suite, no bundle — pick the one that matches your workflow.
		</p>
	</div>
</section>

<!-- FluorocellAI deep-dive -->
<section class="bg-warm-white py-24 md:py-32">
	<div class="container-page">
		<div class="grid gap-14 md:grid-cols-5 md:gap-20 items-start">
			<div class="reveal md:col-span-3">
				<p class="font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em]" style="color:#40e0d0;">Imaging & Cell Analysis</p>
				<h2 class="mt-3 font-display text-4xl font-normal italic leading-tight text-slate-900 md:text-5xl">FluorocellAI</h2>
				<p class="mt-5 font-body text-sm leading-relaxed text-slate-500 md:text-base">
					FluorocellAI automates cell identification, counting, and analysis for cell and cancer research labs — the same visual-detection discipline our platform applies wherever manual, error-prone inspection is the bottleneck.
				</p>
				<p class="mt-4 font-body text-sm leading-relaxed text-slate-400">
					A cell-analysis workflow that once took three to four days of manual cross-referencing — slide prep, manual counting, manual QC, and write-up — compresses to a same-day first pass. Slide prep and imaging stay unchanged; automated segmentation and counting run in minutes instead of days, with automatic QC and an audit trail behind every result.
				</p>
				<ul class="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
					{#each [
						'Automated segmentation & counting, in minutes',
						'Automatic QC / built-in audit trail',
						'Same-day reporting, unchanged slide prep',
						'Validated by working cell biologists',
						'Fine-tuned models on proprietary annotated data',
						'REST API for lab pipeline integration',
					] as feat}
						<li class="flex items-center gap-2 font-body text-xs text-slate-400">
							<span class="h-1.5 w-1.5 flex-shrink-0 rounded-full" style="background:#40e0d0;"></span>
							{feat}
						</li>
					{/each}
				</ul>
				<div class="mt-8 flex flex-wrap gap-3">
					<a href="/fluorocellai" class="btn-primary">View FluorocellAI</a>
					<a href="/demo"      class="btn-secondary">Request Evaluation</a>
				</div>
			</div>
			<div class="reveal md:col-span-2 space-y-4">
				<FluorocellMock />
				<div class="rounded-2xl border border-slate-200/60 overflow-hidden bg-white">
					<div class="border-b border-slate-100 px-6 py-4">
						<span class="font-mono text-[0.6rem] font-medium uppercase tracking-[0.18em] text-slate-300">Before / After</span>
					</div>
					<div class="grid grid-cols-2 divide-x divide-slate-100">
						<div class="px-5 py-6">
							<p class="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-slate-400 mb-3">Before</p>
							<ul class="space-y-3 font-body text-xs text-slate-500">
								<li>Manual counting: 1–2 days</li>
								<li>Manual QC / re-count: ~1 day</li>
								<li>Reporting: ~1 day</li>
							</ul>
						</div>
						<div class="px-5 py-6">
							<p class="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-teal-600 mb-3">With FluorocellAI</p>
							<ul class="space-y-3 font-body text-xs text-slate-700">
								<li>Automated counting: minutes</li>
								<li>QC / audit trail: automatic</li>
								<li>Reporting: same day</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Divider -->
<div class="border-t border-slate-200/60"></div>

<!-- ComplianceCall deep-dive -->
<section class="bg-paper py-24 md:py-32">
	<div class="container-page">
		<div class="grid gap-14 md:grid-cols-5 md:gap-20 items-start">
			<div class="reveal md:col-span-3 md:order-2">
				<p class="font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em]" style="color:#7b8fe8;">Regulatory Compliance</p>
				<h2 class="mt-3 font-display text-4xl font-normal italic leading-tight text-slate-900 md:text-5xl">ComplianceCall</h2>
				<p class="mt-5 font-body text-sm leading-relaxed text-slate-500 md:text-base">
					ComplianceCall benchmarks pharmaceutical development against federal regulation, unified in a single, continuously auditable platform — built for the teams who answer to FDA and other regulatory bodies.
				</p>
				<p class="mt-4 font-body text-sm leading-relaxed text-slate-400">
					The platform tracks not just a chemical's current hazard category, but what it used to be and why it changed — the historical record regulatory and EHS auditors ask for. Full audit-trail transparency is built in by design, not bolted on after the fact.
				</p>
				<ul class="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
					{#each [
						'Live federal regulatory benchmarking',
						'Full audit-trail transparency by design',
						'Historical hazard category tracking',
						'Built for FDA-regulated development teams',
						'One modular AI stack shared with FluorocellAI',
						'REST API for compliance workflow integration',
					] as feat}
						<li class="flex items-center gap-2 font-body text-xs text-slate-400">
							<span class="h-1.5 w-1.5 flex-shrink-0 rounded-full" style="background:#7b8fe8;"></span>
							{feat}
						</li>
					{/each}
				</ul>
				<div class="mt-8 flex flex-wrap gap-3">
					<a href="/compliancecall" class="btn-primary">View ComplianceCall</a>
					<a href="/demo"        class="btn-secondary">Request Demonstration</a>
				</div>
			</div>
			<div class="reveal md:col-span-2 md:order-1">
				<ComplianceMock />
			</div>
		</div>
	</div>
</section>

<!-- CTA -->
<section class="relative overflow-hidden bg-slate-950 py-24 md:py-32">
	<div class="aurora opacity-25" aria-hidden="true"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent"></div>
	<div class="container-page relative z-10 text-center">
		<div class="reveal">
			<h2 class="font-display text-3xl font-normal italic text-white md:text-4xl">Ready to see these on your own data?</h2>
			<p class="mx-auto mt-4 max-w-md font-body text-sm leading-relaxed text-slate-400">Our scientific and engineering staff conduct demonstrations tailored to your specific workflow — not a generic product tour.</p>
			<div class="mt-8 flex flex-wrap justify-center gap-4">
				<a href="/demo" class="btn-hero-primary">Request a Demonstration</a>
				<a href="/pricing" class="btn-hero-secondary">View Pricing</a>
			</div>
		</div>
	</div>
</section>
