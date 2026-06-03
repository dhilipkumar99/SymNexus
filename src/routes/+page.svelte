<script lang="ts">
	import { IMG } from '$lib/images';

	const products = [
		{
			slug: 'fluorocellai',
			tag: 'Imaging & Cell Analysis',
			name: 'FluorocellAI',
			accentHex: '#40e0d0',
			shadowRgb: '64,224,208',
			desc: 'High-throughput AI cell labeling and segmentation, integrating natively with ImageJ, Fiji, OMERO, and CellProfiler. Institutional-grade accuracy — accessible to a single-investigator R01 budget.',
			features: ['Transformer + CNN ensemble model', 'DAPI / GFP / RFP multi-channel', '>10,000 cells/hr batch throughput', '3D confocal & light-sheet support'],
			img: IMG.fluoroHero,
		},
		{
			slug: 'compliancecall',
			tag: 'Regulatory Compliance',
			name: 'ComplianceCall',
			accentHex: '#7b8fe8',
			shadowRgb: '123,143,232',
			desc: 'End-to-end CLIA compliance management — personnel credentialing, QC scheduling, document control with e-signatures, and live Federal Register integration in a single auditable platform.',
			features: ['21 integrated CLIA modules', 'Live FDA & Federal Register sync', 'Multi-lab consulting accounts', 'DTag prevention & survey prep'],
			img: IMG.complianceDesk,
		},
	];

	const stats = [
		{ value: '>10k',  label: 'Cells/hour', sub: 'FluorocellAI throughput' },
		{ value: '21',    label: 'CLIA modules', sub: 'ComplianceCall coverage' },
		{ value: '<3 hr', label: 'From 4 days', sub: 'Screening time reduction' },
		{ value: '0',     label: 'D-Tags cited', sub: 'In customer surveys' },
	];

	const principles = [
		{ num: 'I',   title: 'Domain specificity over generality',           body: 'A cell biologist\'s segmentation workflow and a compliance officer\'s audit trail are not variations on the same problem. We build each platform as if it were the only thing we make.' },
		{ num: 'II',  title: 'Institutional durability over rapid iteration', body: 'Laboratory workflows cannot be interrupted by disruptive UI redesigns or breaking API changes. We version everything, deprecate nothing without multi-year notice.' },
		{ num: 'III', title: 'Affordable by design',                          body: 'Institutional-grade software should not be the exclusive province of institutions with eight-figure IT budgets. We price against the NIH R01 budget.' },
	];

	const testimonials = [
		{ quote: 'We reduced manual cell counting time for a 384-well screen from four days to under three hours. The segmentation accuracy was indistinguishable from expert manual annotation in our internal benchmarking.', name: 'Dr. M. Kowalski', role: 'Senior Research Scientist, Cell Biology — Academic Medical Center' },
		{ quote: 'The CLIA Federal Register integration alone is worth the subscription. Our last survey was the first in six years where no documentation deficiencies were cited. The DTag prevention module flagged three issues before the inspector arrived.', name: 'R. Patel, MT(ASCP)', role: 'Technical Consultant — Independent Laboratory Consulting Practice' },
		{ quote: 'PuroChem is the only tool we\'ve found that tells us not just what a chemical\'s current hazard category is, but what it used to be and why it changed. That historical record is exactly what our EHS auditors ask for.', name: 'Dr. S. Okonkwo', role: 'Chemical Hygiene Officer — Research University' },
	];
</script>

<svelte:head>
	<title>Yashara Biosciences — Life Sciences Software Infrastructure</title>
	<meta name="description" content="Precision software infrastructure for research biology and biochemistry. FluorocellAI and ComplianceCall — built from first principles for the laboratory." />
	<link rel="canonical" href="https://yashara.us/" />
</svelte:head>

<!-- ═══ HERO — full-viewport dark with aurora + image layer ═══ -->
<section class="relative h-svh w-full overflow-hidden bg-slate-950">
	<!-- Background image — purple fluorescence cells -->
	<img
		src={IMG.purpleCells}
		alt=""
		aria-hidden="true"
		class="absolute inset-0 h-full w-full object-cover opacity-30"
		loading="eager"
	/>
	<!-- Aurora layer -->
	<div class="aurora" aria-hidden="true"></div>
	<!-- Gradient scrim -->
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/20"></div>

	<!-- Content anchored bottom-left -->
	<div class="relative z-10 flex h-full flex-col justify-end px-6 pb-20 md:pb-28 md:px-[max(3rem,calc((100vw-72rem)/2+1.5rem))]">
		<div style="animation: fade-up 0.9s cubic-bezier(0.23,1.01,0.32,1) 0.1s both;">
			<p class="font-mono text-[0.7rem] font-medium uppercase tracking-[0.2em] text-crystal-rose/80 mb-5">Yashara Biosciences</p>
			<h1 class="font-display text-5xl font-normal italic leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl max-w-4xl">
				Precision software infrastructure<br class="hidden sm:block" /> for the life sciences.
			</h1>
		</div>
		<p class="mt-5 max-w-xl font-body text-base leading-relaxed text-slate-300 md:text-lg" style="animation: fade-up 0.9s cubic-bezier(0.23,1.01,0.32,1) 0.25s both;">
			We build rigorous, scalable computational tools for biologists, biochemists, and laboratory compliance teams — purpose-engineered for the demands of the laboratory, not repurposed from the enterprise.
		</p>
		<div class="mt-8 flex flex-wrap items-center gap-4" style="animation: fade-up 0.9s cubic-bezier(0.23,1.01,0.32,1) 0.38s both;">
			<a href="/demo"     class="btn-hero-primary">Request a demonstration</a>
			<a href="/products" class="btn-hero-secondary">Explore our platforms</a>
		</div>
		<div class="mt-6" style="animation: fade-up 0.9s cubic-bezier(0.23,1.01,0.32,1) 0.5s both;">
			<a href="/research" class="btn-ghost-dark">
				<span class="font-display italic text-lg text-crystal-blush">Y</span>
				Built from first principles, for the laboratory
				<span class="text-white/40">→</span>
			</a>
		</div>
	</div>
</section>

<!-- ═══ STATS BAND ═══ -->
<section class="border-b border-slate-200/60 bg-paper">
	<div class="container-page">
		<div class="grid grid-cols-2 divide-x divide-y divide-slate-200/60 md:grid-cols-4 md:divide-y-0">
			{#each stats as s, i}
				<div class="reveal px-6 py-10 text-center md:px-10" style="transition-delay:{i*60}ms;">
					<p class="font-display text-4xl font-normal italic text-slate-900">{s.value}</p>
					<p class="mt-1 font-heading text-sm font-semibold text-slate-700">{s.label}</p>
					<p class="mt-0.5 font-body text-xs text-slate-400">{s.sub}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ═══ MISSION ═══ -->
<section class="bg-warm-white py-24 md:py-32">
	<div class="container-page">
		<div class="grid gap-16 md:grid-cols-2 md:gap-24 items-center">
			<div class="reveal">
				<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">Our Founding Premise</p>
				<h2 class="mt-4 font-display text-3xl font-normal italic leading-snug text-slate-900 md:text-4xl lg:text-5xl">
					Scientific software built to the standard of the laboratory itself.
				</h2>
				<p class="mt-6 font-body text-base leading-relaxed text-slate-500">
					Too many tools in the life sciences ecosystem were designed for generic enterprise markets and subsequently adapted — imperfectly — for laboratory use. The result is software that demands the investigator adapt to its limitations rather than the reverse.
				</p>
				<p class="mt-4 font-body text-sm leading-relaxed text-slate-400">
					Every product we release is designed in close collaboration with working biologists, biochemists, and laboratory compliance professionals. We do not release a product until its domain experts consider it complete.
				</p>
				<div class="mt-8 flex flex-wrap gap-3">
					<a href="/about" class="btn-primary">Our story →</a>
					<a href="/research" class="btn-secondary">Read our research</a>
				</div>
			</div>
			<div class="reveal overflow-hidden rounded-2xl">
				<img
					src={IMG.scientistScope}
					alt="Researcher working at a microscope in a dimly lit laboratory"
					class="h-full w-full object-cover aspect-[4/3] transition-transform duration-700 hover:scale-105"
					loading="lazy"
				/>
			</div>
		</div>
	</div>
</section>

<!-- ═══ PULL QUOTE ═══ -->
<section class="relative overflow-hidden border-y border-slate-200/60 bg-slate-950 py-20 md:py-28">
	<img
		src={IMG.fluoroCells}
		alt=""
		aria-hidden="true"
		class="absolute inset-0 h-full w-full object-cover opacity-20"
		loading="lazy"
	/>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/50"></div>
	<div class="container-page relative z-10">
		<blockquote class="reveal max-w-3xl font-display text-2xl font-normal italic leading-relaxed text-white md:text-3xl lg:text-4xl">
			&ldquo;The highest cost in laboratory science is not the instrument or the reagent — it is the time lost to tools that were not built for the work.&rdquo;
		</blockquote>
	</div>
</section>

<!-- ═══ PRODUCT SUITE ═══ -->
<section id="products" class="bg-warm-white py-24 md:py-32">
	<div class="container-page">
		<div class="reveal mb-14">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">Product Suite</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic leading-tight text-slate-900 md:text-4xl lg:text-5xl">
				Distinct disciplines.<br />One standard of rigour.
			</h2>
			<p class="mt-4 max-w-xl font-body text-sm leading-relaxed text-slate-400">
				Each platform addresses a distinct domain of laboratory operations — sharing a common design philosophy: exactitude over convenience, transparency over opacity, durability over novelty.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each products as p, i}
				<div
					class="reveal group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
					style="transition-delay:{i*80}ms;"
				>
					<!-- Image (clicking navigates to product page) -->
					<a href="/{p.slug}" class="relative h-56 overflow-hidden block">
						<img
							src={p.img}
							alt="{p.name} platform"
							class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
							loading="lazy"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
						<div class="absolute bottom-0 left-0 right-0 p-5">
							<span class="font-mono text-[0.6rem] font-medium uppercase tracking-[0.18em]" style="color:{p.accentHex};">{p.tag}</span>
							<h3 class="mt-1 font-display text-2xl font-normal italic text-white">{p.name}</h3>
						</div>
						<div class="absolute left-0 right-0 top-0 h-[3px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" style="background:{p.accentHex};"></div>
					</a>

					<!-- Body -->
					<div class="flex flex-col flex-1 p-6">
						<p class="font-body text-sm leading-relaxed text-slate-500">{p.desc}</p>
						<ul class="mt-5 space-y-2">
							{#each p.features as feat}
								<li class="flex items-center gap-2.5 font-body text-xs text-slate-400">
									<span class="h-1.5 w-1.5 flex-shrink-0 rounded-full" style="background:{p.accentHex};"></span>
									{feat}
								</li>
							{/each}
						</ul>
						<div class="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
							<a href="/{p.slug}" class="font-heading text-[0.72rem] font-semibold uppercase tracking-[0.1em] transition-colors duration-200" style="color:{p.accentHex};">
								View platform →
							</a>
							<a href="/{p.slug}/pricing" class="font-body text-xs text-slate-300 underline-offset-2 hover:text-slate-500 hover:underline transition-colors">
								Pricing
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-8 text-center reveal">
			<a href="/pricing" class="btn-secondary">Compare plans & pricing →</a>
		</div>
	</div>
</section>

<!-- ═══ SPLIT FEATURE — FluorocellAI deep image ═══ -->
<section class="border-t border-slate-200/60 bg-paper py-0 overflow-hidden">
	<div class="grid md:grid-cols-2 min-h-[520px]">
		<!-- Image half -->
		<div class="relative overflow-hidden min-h-[320px] md:min-h-0">
			<img
				src={IMG.fluoroCells}
				alt="Fluorescence microscopy — cellular imaging at high magnification"
				class="absolute inset-0 h-full w-full object-cover"
				loading="lazy"
			/>
			<div class="absolute inset-0 bg-gradient-to-r from-transparent to-paper/60 hidden md:block"></div>
		</div>
		<!-- Text half -->
		<div class="reveal flex flex-col justify-center px-8 py-16 md:px-16">
			<p class="font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em]" style="color:#40e0d0;">FluorocellAI</p>
			<h2 class="mt-3 font-display text-3xl font-normal italic leading-snug text-slate-900 md:text-4xl">
				Research-grade segmentation. Without the research-grade wait.
			</h2>
			<p class="mt-4 font-body text-sm leading-relaxed text-slate-500">
				FluorocellAI reduces a 384-well screen from four days of manual annotation to under three hours. Our transformer + CNN ensemble matches expert-level accuracy, integrates into your existing ImageJ pipeline, and leaves every downstream measurement intact.
			</p>
			<div class="mt-6 flex flex-wrap gap-3">
				<a href="/fluorocellai" class="btn-primary">Explore FluorocellAI</a>
				<a href="/demo"         class="btn-secondary">Request evaluation</a>
			</div>
		</div>
	</div>
</section>

<!-- ═══ SPLIT FEATURE — ComplianceCall ═══ -->
<section class="border-t border-slate-200/60 bg-warm-white py-0 overflow-hidden">
	<div class="grid md:grid-cols-2 min-h-[520px]">
		<!-- Text half -->
		<div class="reveal flex flex-col justify-center px-8 py-16 md:px-16 order-2 md:order-1">
			<p class="font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em]" style="color:#7b8fe8;">ComplianceCall</p>
			<h2 class="mt-3 font-display text-3xl font-normal italic leading-snug text-slate-900 md:text-4xl">
				Know before your inspector does.
			</h2>
			<p class="mt-4 font-body text-sm leading-relaxed text-slate-500">
				ComplianceCall maintains live connections to the CLIA Federal Register and FDA CLIA test database. When a new requirement is promulgated, your compliance dashboard updates automatically — not at your next survey. The DTag prevention engine proactively surfaces deficiencies before an inspector can cite them.
			</p>
			<div class="mt-6 flex flex-wrap gap-3">
				<a href="/compliancecall" class="btn-primary">Explore ComplianceCall</a>
				<a href="/demo"           class="btn-secondary">Request demonstration</a>
			</div>
		</div>
		<!-- Image half -->
		<div class="relative overflow-hidden min-h-[320px] md:min-h-0 order-1 md:order-2">
			<img
				src={IMG.complianceDesk}
				alt="Laboratory compliance documentation and regulatory management"
				class="absolute inset-0 h-full w-full object-cover"
				loading="lazy"
			/>
			<div class="absolute inset-0 bg-gradient-to-l from-transparent to-warm-white/60 hidden md:block"></div>
		</div>
	</div>
</section>

<!-- ═══ PRINCIPLES ═══ -->
<section class="border-t border-slate-200/60 bg-paper py-24 md:py-32">
	<div class="container-page">
		<div class="reveal mb-14">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">Design Philosophy</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">How we build.</h2>
		</div>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			{#each principles as p, i}
				<div class="reveal rounded-2xl border border-slate-200/60 bg-white p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style="transition-delay:{i*80}ms;">
					<span class="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-crystal-rose">{p.num}.</span>
					<h3 class="mt-3 font-heading text-base font-semibold text-slate-900">{p.title}</h3>
					<p class="mt-2 font-body text-sm leading-relaxed text-slate-400">{p.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ═══ TESTIMONIALS ═══ -->
<section class="bg-warm-white py-24 md:py-32">
	<div class="container-page">
		<div class="reveal mb-14">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">From the Laboratory</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">What research teams say.</h2>
		</div>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			{#each testimonials as t, i}
				<div class="reveal flex flex-col rounded-2xl border border-slate-200/60 bg-white p-7" style="transition-delay:{i*80}ms;">
					<blockquote class="flex-1 font-display text-base font-normal italic leading-relaxed text-slate-700">
						&ldquo;{t.quote}&rdquo;
					</blockquote>
					<div class="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
						<div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 font-heading text-[0.65rem] font-semibold text-slate-500">
							{t.name.replace('Dr. ','').replace('R. ','R').split(' ')[0][0]}{t.name.split(' ').slice(-1)[0][0]}
						</div>
						<div>
							<p class="font-heading text-[0.8rem] font-semibold text-slate-900">{t.name}</p>
							<p class="font-body text-[0.7rem] text-slate-400">{t.role}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ═══ IMAGE GALLERY STRIP ═══ -->
<section class="overflow-hidden bg-slate-950 py-0">
	<div class="grid grid-cols-4 h-48 md:h-64">
		{#each [IMG.labGlassware, IMG.microscopeSetup, IMG.pipette, IMG.labWork] as img, i}
			<div class="relative overflow-hidden">
				<img
					src={img}
					alt="Yashara Biosciences laboratory research"
					class="h-full w-full object-cover opacity-60 transition-all duration-700 hover:opacity-90 hover:scale-105"
					loading="lazy"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none"></div>
			</div>
		{/each}
	</div>
</section>

<!-- ═══ INTEGRATIONS ═══ -->
<section class="border-t border-slate-200/60 bg-paper py-20 md:py-24">
	<div class="container-page">
		<div class="reveal mb-10 flex flex-wrap items-end justify-between gap-6">
			<div>
				<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">Ecosystem</p>
				<h2 class="mt-3 font-display text-2xl font-normal italic text-slate-900 md:text-3xl max-w-sm">
					Integrates with the tools your laboratory already uses.
				</h2>
			</div>
			<a href="/products" class="btn-secondary font-heading text-xs">Full integration details →</a>
		</div>
		<div class="reveal grid grid-cols-3 gap-px bg-slate-200/60 rounded-2xl overflow-hidden md:grid-cols-6">
			{#each [
				{name:'ImageJ',      desc:'Native plugin'},
				{name:'Fiji',        desc:'Update site'},
				{name:'OMERO',       desc:'Server batch'},
				{name:'CellProfiler',desc:'Label export'},
				{name:'FDA CLIA DB', desc:'Live connection'},
				{name:'REST API',    desc:'All products'},
			] as intg}
				<div class="flex flex-col items-center justify-center gap-1 bg-white px-3 py-6 text-center transition-colors hover:bg-slate-50">
					<span class="font-heading text-sm font-semibold text-slate-800">{intg.name}</span>
					<span class="font-body text-[0.62rem] text-slate-300">{intg.desc}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ═══ CTA ═══ -->
<section class="relative overflow-hidden bg-slate-950 py-28 md:py-36">
	<img
		src={IMG.darkLab}
		alt=""
		aria-hidden="true"
		class="absolute inset-0 h-full w-full object-cover opacity-25"
		loading="lazy"
	/>
	<div class="aurora opacity-25" aria-hidden="true"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/40"></div>
	<div class="container-page relative z-10">
		<div class="reveal max-w-2xl">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose/70">Next Steps</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic leading-tight text-white md:text-4xl lg:text-5xl">
				Ready to evaluate the Yashara platform?
			</h2>
			<p class="mt-5 font-body text-sm leading-relaxed text-slate-400 md:text-base">
				We provide structured evaluation access for qualified research teams and clinical laboratories. Demonstrations are conducted by domain specialists, tailored to your specific workflow — not a generic product tour.
			</p>
			<div class="mt-8 flex flex-wrap gap-4">
				<a href="/demo"     class="btn-hero-primary">Request a demonstration</a>
				<a href="/products" class="btn-hero-secondary">Explore all platforms</a>
			</div>
		</div>
	</div>
</section>
