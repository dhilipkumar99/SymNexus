<script lang="ts">
	import { IMG } from '$lib/images';
	import FluorocellMock from '$lib/components/products/FluorocellMock.svelte';
	import ComplianceMock from '$lib/components/products/ComplianceMock.svelte';

	const products = [
		{
			slug: 'fluorocellai',
			tag: 'Imaging & Cell Analysis',
			name: 'FluorocellAI',
			accentHex: '#40e0d0',
			desc: 'Upload your microscopy images. Get automated cell counts, segmentation, and a QC audit trail back the same day — instead of a week of manual review.',
		},
		{
			slug: 'compliancecall',
			tag: 'Regulatory Compliance',
			name: 'ComplianceCall',
			accentHex: '#7b8fe8',
			desc: 'A live dashboard that benchmarks your pharmaceutical development against current federal regulation, with full history and audit trail built in.',
		},
	];

	const stats = [
		{ value: '3–4 days → same-day', label: 'FluorocellAI turnaround', sub: 'Manual review compressed to a same-day first pass' },
		{ value: '2',    label: 'Products in production', sub: 'FluorocellAI and ComplianceCall' },
		{ value: '5+ yrs', label: 'Experience per engineer', sub: 'Building custom-deployed AI for clients' },
	];

	const testimonials = [
		{ quote: 'A cancer-research lab\'s cell-analysis workflow that took three to four days of manual review now compresses to a same-day first pass — without changing how we prepare or image our samples.', name: 'Cancer-research lab', role: 'FluorocellAI pilot customer · name withheld at customer\'s request' },
		{ quote: 'It tells us not just what a chemical\'s current hazard category is, but what it used to be and why it changed. That historical record is exactly what our EHS auditors ask for.', name: 'Dr. S. Okonkwo', role: 'Chemical Hygiene Officer, Research University · ComplianceCall pilot customer' },
	];
</script>

<svelte:head>
	<title>SymNexus — AI Software for Cell Image Analysis & Pharma Compliance</title>
	<meta name="description" content="SymNexus builds two products: FluorocellAI, AI-automated cell image analysis for research labs, and ComplianceCall, live pharmaceutical compliance tracking against federal regulation." />
	<link rel="canonical" href="https://symnexus.co/" />
</svelte:head>

<!-- ═══ HERO — plain statement of what we sell, mockups visible immediately ═══ -->
<section class="relative overflow-hidden bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-24">
	<div class="aurora opacity-20" aria-hidden="true"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950"></div>

	<div class="container-page relative z-10">
		<div class="max-w-3xl" style="animation: fade-up 0.9s cubic-bezier(0.23,1.01,0.32,1) 0.1s both;">
			<p class="font-mono text-[0.7rem] font-medium uppercase tracking-[0.2em] text-crystal-rose/80 mb-5">SymNexus Ltd. — Software</p>
			<h1 class="font-display text-4xl font-normal italic leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
				AI software for cell image analysis and pharmaceutical compliance.
			</h1>
			<p class="mt-5 max-w-xl font-body text-base leading-relaxed text-slate-300 md:text-lg">
				We build two products: <strong class="text-white font-semibold">FluorocellAI</strong>, which automates cell counting and analysis for research labs, and <strong class="text-white font-semibold">ComplianceCall</strong>, which tracks pharmaceutical development against federal regulation in real time.
			</p>
			<div class="mt-8 flex flex-wrap items-center gap-4">
				<a href="/demo"     class="btn-hero-primary">Request a demonstration</a>
				<a href="/products" class="btn-hero-secondary">See both products</a>
			</div>
		</div>

		<!-- Product mockups, above the fold -->
		<div class="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2" style="animation: fade-up 0.9s cubic-bezier(0.23,1.01,0.32,1) 0.3s both;">
			<a href="/fluorocellai" class="group block">
				<FluorocellMock compact />
				<p class="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-white/40 group-hover:text-[#40e0d0] transition-colors">FluorocellAI — segmentation view →</p>
			</a>
			<a href="/compliancecall" class="group block">
				<ComplianceMock compact />
				<p class="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-white/40 group-hover:text-[#7b8fe8] transition-colors">ComplianceCall — regulatory dashboard →</p>
			</a>
		</div>
		<p class="mt-3 font-body text-[0.68rem] text-white/25">Illustrative interface previews. Request a demonstration to see the live product.</p>
	</div>
</section>

<!-- ═══ STATS BAND ═══ -->
<section class="border-b border-slate-200/60 bg-paper">
	<div class="container-page">
		<div class="grid grid-cols-1 divide-y divide-slate-200/60 md:grid-cols-3 md:divide-y-0 md:divide-x">
			{#each stats as s, i}
				<div class="reveal px-6 py-8 text-center" style="transition-delay:{i*60}ms;">
					<p class="font-display text-3xl font-normal italic text-slate-900">{s.value}</p>
					<p class="mt-1 font-heading text-sm font-semibold text-slate-700">{s.label}</p>
					<p class="mt-0.5 font-body text-xs text-slate-400">{s.sub}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ═══ PRODUCTS — short overview, links to full deep-dive pages ═══ -->
<section id="products" class="bg-warm-white py-20 md:py-28">
	<div class="container-page">
		<div class="reveal mb-12">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">What We Sell</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic leading-tight text-slate-900 md:text-4xl">
				Two products. Two regulated workflows.
			</h2>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each products as p, i}
				<div class="reveal flex flex-col rounded-2xl border border-slate-200/60 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" style="transition-delay:{i*80}ms;">
					<span class="font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em]" style="color:{p.accentHex};">{p.tag}</span>
					<h3 class="mt-2 font-display text-2xl font-normal italic text-slate-900">{p.name}</h3>
					<p class="mt-3 font-body text-sm leading-relaxed text-slate-500 flex-1">{p.desc}</p>
					<div class="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
						<a href="/{p.slug}" class="font-heading text-[0.72rem] font-semibold uppercase tracking-[0.1em] transition-colors duration-200" style="color:{p.accentHex};">
							See how it works →
						</a>
						<a href="/{p.slug}/pricing" class="font-body text-xs text-slate-300 underline-offset-2 hover:text-slate-500 hover:underline transition-colors">
							Pricing
						</a>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ═══ TESTIMONIALS ═══ -->
<section class="border-t border-slate-200/60 bg-paper py-20 md:py-28">
	<div class="container-page">
		<div class="reveal mb-12">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">From Pilot Customers</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">What our early customers say.</h2>
		</div>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-4xl">
			{#each testimonials as t, i}
				<div class="reveal flex flex-col rounded-2xl border border-slate-200/60 bg-white p-7" style="transition-delay:{i*80}ms;">
					<blockquote class="flex-1 font-display text-base font-normal italic leading-relaxed text-slate-700">
						&ldquo;{t.quote}&rdquo;
					</blockquote>
					<div class="mt-6 border-t border-slate-100 pt-4">
						<p class="font-heading text-[0.8rem] font-semibold text-slate-900">{t.name}</p>
						<p class="font-body text-[0.7rem] text-slate-400">{t.role}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ═══ CTA ═══ -->
<section class="relative overflow-hidden bg-slate-950 py-24 md:py-28">
	<div class="aurora opacity-20" aria-hidden="true"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/40"></div>
	<div class="container-page relative z-10">
		<div class="reveal max-w-2xl">
			<h2 class="font-display text-3xl font-normal italic leading-tight text-white md:text-4xl">
				See FluorocellAI or ComplianceCall on your own data.
			</h2>
			<p class="mt-4 font-body text-sm leading-relaxed text-slate-400 md:text-base">
				Every demonstration is conducted by the people who build the product, tailored to your workflow — not a generic sales tour.
			</p>
			<div class="mt-8 flex flex-wrap gap-4">
				<a href="/demo"     class="btn-hero-primary">Request a demonstration</a>
				<a href="/pricing"  class="btn-hero-secondary">View pricing</a>
			</div>
		</div>
	</div>
</section>
