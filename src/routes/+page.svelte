<script lang="ts">
	import { IMG } from '$lib/images';

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
</script>

<svelte:head>
	<title>Symnexus — Domain-Native Software Systems for Regulated Industries</title>
	<meta name="description" content="Symnexus designs and builds domain-native software systems for regulated, technical industries — currently offering FluorocellAI, automated cell image analysis, and ComplianceCall, real-time pharmaceutical compliance tracking." />
	<link rel="canonical" href="https://symnexus.co/" />
</svelte:head>

<!-- ═══ SCREEN ONE — full-bleed atmospheric hero, centered copy ═══ -->
<section class="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950">
	<img
		src={IMG.darkLab}
		alt=""
		aria-hidden="true"
		class="absolute inset-0 h-full w-full object-cover opacity-40 animate-slow-zoom"
		loading="eager"
	/>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950"></div>

	<div class="relative z-10 mx-auto max-w-xl px-6 text-center animate-fade-in" style="animation-delay: 0.2s;">
		<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.25em] text-white/40 mb-10">Symnexus Ltd. — Software</p>

		<p class="font-display text-xl font-normal leading-[1.7] text-white/90 md:text-2xl">
			Domain-native software systems,<br />built to fit.
		</p>

		<p class="mt-10 font-display text-xl font-normal leading-[1.7] text-white/90 md:text-2xl">
			We design and build software systems<br />for regulated, technical industries —<br />we engineer them around how your team already works,<br />instead of bending your team to fit a generic tool.
		</p>

		<p class="mt-10 font-body text-sm leading-[1.9] text-white/50">
			A Silicon Valley engineering team,<br />deployed for clients operating globally.
		</p>

		<a href="/demo" class="mt-14 inline-block border border-white/25 px-8 py-3.5 font-heading text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:border-white/50 hover:bg-white/5">
			Request a demonstration
		</a>
	</div>

	<a href="#offerings" class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/30 transition-colors duration-300 hover:text-white/60" aria-label="Scroll to offerings">
		<svg width="16" height="26" viewBox="0 0 16 26" fill="none" class="animate-bounce-slow">
			<rect x="1" y="1" width="14" height="24" rx="7" stroke="currentColor" stroke-width="1"/>
			<circle cx="8" cy="8" r="1.5" fill="currentColor"/>
		</svg>
	</a>
</section>

<!-- ═══ SCREEN TWO — current offerings, full-bleed ═══ -->
<section id="offerings" class="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950">
	<img
		src={IMG.purpleCells}
		alt=""
		aria-hidden="true"
		class="absolute inset-0 h-full w-full object-cover opacity-30 animate-slow-zoom"
		loading="lazy"
	/>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/90"></div>

	<div class="reveal relative z-10 mx-auto max-w-xl px-6 text-center">
		<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.25em] text-white/40 mb-10">Currently Offering</p>

		<p class="font-display text-xl font-normal leading-[1.7] text-white/90 md:text-2xl">
			FluorocellAI and ComplianceCall.
		</p>

		<p class="mt-10 font-display text-xl font-normal leading-[1.7] text-white/90 md:text-2xl">
			<span class="text-white">FluorocellAI</span> — cell counting and<br />segmentation performed by vision AI,<br />built for research labs.
		</p>
		<p class="mt-6 font-display text-xl font-normal leading-[1.7] text-white/90 md:text-2xl">
			<span class="text-white">ComplianceCall</span> — pharmaceutical development<br />tracked against federal regulation,<br />in real time.
		</p>

		<div class="mt-14 flex flex-wrap items-center justify-center gap-6">
			<a href="/fluorocellai" class="border border-white/25 px-8 py-3.5 font-heading text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:border-white/50 hover:bg-white/5">
				FluorocellAI →
			</a>
			<a href="/compliancecall" class="border border-white/25 px-8 py-3.5 font-heading text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:border-white/50 hover:bg-white/5">
				ComplianceCall →
			</a>
		</div>
		<p class="mt-6 font-body text-[0.68rem] text-white/25">Illustrative interface previews. Request a demonstration to see the live product.</p>

		<p class="mt-10 font-body text-sm leading-relaxed text-white/50">
			We build domain-native software systems for many industries beyond these two —<br class="hidden md:block" /> <a href="/contact" class="text-white/80 underline underline-offset-2 transition-colors duration-200 hover:text-white">reach out</a> if you have a custom solution in mind.
		</p>
	</div>
</section>

<!-- ═══ SCREEN THREE — approach statement, full-bleed ═══ -->
<section class="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-slate-950">
	<img
		src={IMG.labGlassware}
		alt=""
		aria-hidden="true"
		class="absolute inset-0 h-full w-full object-cover opacity-25 animate-slow-zoom"
		loading="lazy"
	/>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-950/90"></div>

	<div class="reveal relative z-10 mx-auto max-w-xl px-6 text-center">
		<p class="font-display text-xl font-normal leading-[1.7] text-white/90 md:text-2xl">
			Domain-native software systems,<br />not generic tools bent to fit.
		</p>
		<p class="mt-8 font-display text-xl font-normal leading-[1.7] text-white/90 md:text-2xl">
			FluorocellAI turns a 3–4 day manual review<br />into a same-day first pass —<br />because the system is built around<br />how a lab already works,<br />not the other way around.
		</p>
	</div>
</section>

<!-- ═══ SCREEN FOUR — products, full-bleed ═══ -->
<section class="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950">
	<img
		src={IMG.microscopeSetup}
		alt=""
		aria-hidden="true"
		class="absolute inset-0 h-full w-full object-cover opacity-30 animate-slow-zoom"
		loading="lazy"
	/>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/55 to-slate-950/90"></div>

	<div class="reveal relative z-10 mx-auto max-w-xl px-6 text-center">
		<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.25em] text-white/40 mb-10">Currently Offering</p>
		<p class="font-display text-xl font-normal leading-[1.7] text-white/90 md:text-2xl">
			Two regulated workflows, covered.
		</p>

		<div class="mt-14 space-y-10">
			{#each products as p}
				<div>
					<p class="font-mono text-[0.6rem] font-medium uppercase tracking-[0.2em]" style="color:{p.accentHex};">{p.tag}</p>
					<p class="mt-2 font-display text-2xl font-normal text-white">{p.name}</p>
					<p class="mt-3 font-body text-sm leading-relaxed text-white/50">{p.desc}</p>
					<div class="mt-4 flex items-center justify-center gap-6">
						<a href="/{p.slug}" class="font-heading text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white/80 transition-colors duration-200 hover:text-white">See how it works →</a>
						<a href="/{p.slug}/pricing" class="font-body text-xs text-white/40 underline-offset-2 transition-colors duration-200 hover:text-white/70 hover:underline">Pricing</a>
					</div>
				</div>
			{/each}
		</div>

		<p class="mt-14 font-body text-sm leading-relaxed text-white/50">
			We build domain-native software systems for many industries beyond these two —<br class="hidden md:block" /> <a href="/contact" class="text-white/80 underline underline-offset-2 transition-colors duration-200 hover:text-white">reach out</a> if you have a custom solution in mind.
		</p>
	</div>
</section>

<!-- ═══ SCREEN FIVE — closing CTA, full-bleed ═══ -->
<section class="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-slate-950">
	<img
		src={IMG.scientistScope}
		alt=""
		aria-hidden="true"
		class="absolute inset-0 h-full w-full object-cover opacity-30 animate-slow-zoom"
		loading="lazy"
	/>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/65 to-slate-950"></div>

	<div class="reveal relative z-10 mx-auto max-w-xl px-6 text-center">
		<p class="font-display text-xl font-normal leading-[1.7] text-white/90 md:text-2xl">
			We build new, innovative AI products<br />for businesses around the world.
		</p>
		<p class="mt-8 font-body text-sm leading-relaxed text-white/50 md:text-base">
			The people who build the product<br class="hidden md:block" /> run your demonstration and build it around your workflow.
		</p>
		<div class="mt-12 flex flex-wrap items-center justify-center gap-6">
			<a href="/demo" class="border border-white/25 px-8 py-3.5 font-heading text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:border-white/50 hover:bg-white/5">
				Request a demonstration
			</a>
			<a href="/pricing" class="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-white/60 transition-colors duration-300 hover:text-white">
				View pricing →
			</a>
		</div>
	</div>
</section>
