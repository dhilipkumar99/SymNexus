<script lang="ts">
	import { IMG } from '$lib/images';

	const products = [
		{
			slug: 'fluorocellai',
			tag: 'Imaging & Cell Analysis',
			name: 'FluorocellAI',
			accentHex: '#40e0d0',
			shadowRgb: '64,224,208',
			desc: 'AI-automated cell identification, counting, and analysis for cell and cancer research labs — compressing a week of manual cross-referencing into a same-day first pass.',
			features: ['Automated segmentation & counting', 'Minutes, not days, per slide', 'Automatic QC / audit trail', 'Same-day reporting'],
			img: IMG.fluoroHero,
		},
		{
			slug: 'compliancecall',
			tag: 'Regulatory Compliance',
			name: 'ComplianceCall',
			accentHex: '#7b8fe8',
			shadowRgb: '123,143,232',
			desc: 'Benchmarks pharmaceutical development against federal regulation — auditable, always current, and built for the teams who answer to FDA and other regulatory bodies.',
			features: ['Live federal regulatory sync', 'Full audit-trail transparency by design', 'Historical hazard/status tracking', 'Built for FDA-regulated workflows'],
			img: IMG.complianceDesk,
		},
	];

	const stats = [
		{ value: '3–4 days → same-day', label: 'FluorocellAI turnaround', sub: 'Manual review compressed to a same-day first pass' },
		{ value: '2',    label: 'Products shipped', sub: 'FluorocellAI and ComplianceCall, launched in 14 months' },
		{ value: '5+ yrs', label: 'Experience per engineer', sub: 'Building custom-deployed AI for clients' },
		{ value: '$3.5T', label: 'Global AI market by 2033', sub: 'Most industries still early in domain-specific adoption' },
	];

	const principles = [
		{ num: 'I',   title: 'Domain-native, not adapted',           body: 'We build AI systems for the exact workflow they serve — not a generic platform retrofitted to fit. That discipline carries over directly from our founding company, Yashara Biosciences.' },
		{ num: 'II',  title: 'Prove the model, then teach the team', body: 'Most AI vendors sell a platform and leave the customer to adapt. We prove our models first, then train businesses to manage these systems independently.' },
		{ num: 'III', title: 'Compliance by design',                          body: 'Full audit-trail transparency is built into every SymNexus platform from the start — not bolted on — because it is the trust infrastructure our customers operate under.' },
	];

	const testimonials = [
		{ quote: 'A cancer-research lab\'s cell-analysis workflow that took three to four days of manual review now compresses to a same-day first pass — without changing how we prepare or image our samples.', name: 'Cancer-Research Lab', role: 'FluorocellAI customer' },
		{ quote: 'ComplianceCall (Purochem) is the only tool we\'ve found that tells us not just what a chemical\'s current hazard category is, but what it used to be and why it changed. That historical record is exactly what our EHS auditors ask for.', name: 'Dr. S. Okonkwo', role: 'Chemical Hygiene Officer — Research University' },
		{ quote: 'Standard practice only let us inspect about 10% of rolls by hand — inspection was too slow to check everything. Automated inspection now covers the same volume in about 8 hours, inside a single shift.', name: 'Textile Production', role: 'SymNexus pilot customer' },
	];
</script>

<svelte:head>
	<title>SymNexus — Domain-Native AI Systems for Regulated Industries</title>
	<meta name="description" content="SymNexus builds domain-native AI systems for regulated industries. FluorocellAI and ComplianceCall — proven in cell biology and pharmaceutical compliance, expanding globally." />
	<link rel="canonical" href="https://symnexus.co/" />
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
			<p class="font-mono text-[0.7rem] font-medium uppercase tracking-[0.2em] text-crystal-rose/80 mb-5">SymNexus Ltd.</p>
			<h1 class="font-display text-5xl font-normal italic leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl max-w-4xl">
				Domain-native AI systems<br class="hidden sm:block" /> for regulated industries.
			</h1>
		</div>
		<p class="mt-5 max-w-xl font-body text-base leading-relaxed text-slate-300 md:text-lg" style="animation: fade-up 0.9s cubic-bezier(0.23,1.01,0.32,1) 0.25s both;">
			We build custom-deployed AI, validated by the scientists and compliance professionals who use it — not generic enterprise AI adapted after the fact. Proven in cell biology and pharmaceutical compliance, built to scale into new regulated industries.
		</p>
		<div class="mt-8 flex flex-wrap items-center gap-4" style="animation: fade-up 0.9s cubic-bezier(0.23,1.01,0.32,1) 0.38s both;">
			<a href="/demo"     class="btn-hero-primary">Request a demonstration</a>
			<a href="/products" class="btn-hero-secondary">Explore our platforms</a>
		</div>
		<div class="mt-6" style="animation: fade-up 0.9s cubic-bezier(0.23,1.01,0.32,1) 0.5s both;">
			<a href="/research" class="btn-ghost-dark">
				<span class="font-display italic text-lg text-crystal-blush">S</span>
				Built from first principles, for the regulated enterprise
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
					Most businesses want AI. Almost none can get a system built for their exact workflow.
				</h2>
				<p class="mt-6 font-body text-base leading-relaxed text-slate-500">
					Most AI vendors sell a platform and leave the customer to adapt their workflow to it. That works poorly when precision and accountability matter — which is why we chose to prove our AI models first, and train businesses to manage these systems independently.
				</p>
				<p class="mt-4 font-body text-sm leading-relaxed text-slate-400">
					Every deployment is validated by the working scientists and compliance professionals who use it — not shipped generic and adapted after the fact. That discipline carries over directly from our founding company, Yashara Biosciences.
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
			&ldquo;Businesses increasingly want to own a working AI system, built for their exact process — the way they own equipment — rather than rent a generic tool indefinitely.&rdquo;
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
				A week of manual review. Compressed to a same-day first pass.
			</h2>
			<p class="mt-4 font-body text-sm leading-relaxed text-slate-500">
				FluorocellAI automates cell identification, counting, and analysis for cell and cancer research labs. Manual counting and annotation that once took one to two days now runs in minutes, with automatic QC and audit trail — without changing how the lab prepares or images its samples.
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
				Benchmark development against federal regulation, automatically.
			</h2>
			<p class="mt-4 font-body text-sm leading-relaxed text-slate-500">
				ComplianceCall (Purochem) benchmarks pharmaceutical development against federal regulation, with full audit-trail transparency built in by design. It tracks not just a chemical's current hazard category, but what it used to be and why it changed — the historical record regulatory auditors ask for.
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
			<p class="mt-4 max-w-xl font-body text-sm leading-relaxed text-slate-400">We are a team of Silicon Valley engineers — from NXP Semiconductors, Zoom, Amazon, and ServiceNow, plus Berkeley- and Stanford-trained researchers. Our design discipline comes from working in the most advanced AI research and development companies in the Bay Area.</p>
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
					alt="SymNexus domain research and deployment"
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
				<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">Architecture</p>
				<h2 class="mt-3 font-display text-2xl font-normal italic text-slate-900 md:text-3xl max-w-sm">
					One modular AI stack, powering every product we build.
				</h2>
			</div>
			<a href="/products" class="btn-secondary font-heading text-xs">Full platform details →</a>
		</div>
		<div class="reveal grid grid-cols-3 gap-px bg-slate-200/60 rounded-2xl overflow-hidden md:grid-cols-6">
			{#each [
				{name:'Ingestion',   desc:'Data pipeline'},
				{name:'Data Lake',   desc:'Proprietary dataset'},
				{name:'Fine-Tuned Models', desc:'Domain-native'},
				{name:'Agents',      desc:'Workflow automation'},
				{name:'Copilot',     desc:'Human-in-the-loop'},
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
				Ready to evaluate the SymNexus platform?
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
