<script lang="ts">
	import { IMG } from '$lib/images';

	const products = [
		{
			name: 'FluorocellAI',
			accentHex: '#40e0d0',
			slug: 'fluorocellai',
			desc: 'AI-automated cell identification, counting, and analysis for cell and cancer research labs.',
			ctaLabel: 'Request Evaluation',
			features: [
				'Automated segmentation & counting',
				'Automatic QC and audit trail',
				'Same-day reporting',
				'Validated by working cell biologists',
			],
		},
		{
			name: 'ComplianceCall',
			accentHex: '#7b8fe8',
			slug: 'compliancecall',
			desc: 'Benchmarks pharmaceutical development against federal regulation, with full audit-trail transparency.',
			ctaLabel: 'Request Demonstration',
			features: [
				'Live federal regulatory benchmarking',
				'Historical hazard-category tracking',
				'Full audit-trail transparency by design',
				'Built for FDA-regulated teams',
			],
		},
	];
</script>

<svelte:head>
	<title>Pricing — SymNexus</title>
	<meta name="description" content="SymNexus pricing for FluorocellAI and ComplianceCall. We size every deployment to your workflow — contact us for a quote." />
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden bg-slate-950 pt-40 pb-24 md:pt-52 md:pb-28">
	<div class="aurora opacity-30" aria-hidden="true"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent"></div>
	<div class="container-page relative z-10 text-center">
		<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose/80">Pricing</p>
		<h1 class="mt-4 font-display text-5xl font-normal italic leading-[1.05] text-white md:text-6xl max-w-2xl mx-auto">
			Sized to your deployment.
		</h1>
		<p class="mt-5 max-w-lg mx-auto font-body text-base leading-relaxed text-slate-400">
			Every engagement begins with an evaluation tailored to your workflow. We prove the model on your data before we talk pricing — contact us for a quote sized to your deployment.
		</p>
	</div>
</section>

<!-- Products -->
<section class="bg-warm-white py-20 md:py-28">
	<div class="container-page">
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each products as p, i}
				<div class="reveal flex flex-col rounded-2xl border border-slate-200/60 bg-white p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style="transition-delay:{i*80}ms;">
					<p class="font-heading text-xs font-semibold uppercase tracking-[0.12em]" style="color:{p.accentHex};">{p.name}</p>
					<p class="mt-4 font-display text-3xl font-normal italic text-slate-900">Contact us for pricing</p>
					<p class="mt-3 font-body text-sm leading-relaxed text-slate-500">{p.desc}</p>
					<ul class="mt-7 flex-1 space-y-2.5">
						{#each p.features as feat}
							<li class="flex items-start gap-2.5 font-body text-xs text-slate-500">
								<span class="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style="background:{p.accentHex};"></span>
								{feat}
							</li>
						{/each}
					</ul>
					<div class="mt-8 flex flex-wrap gap-3">
						<a href="/demo" class="rounded-xl px-5 py-3 text-center font-heading text-sm font-semibold text-slate-900 bg-slate-100 transition-all duration-200 hover:bg-slate-200 flex-1">{p.ctaLabel}</a>
						<a href="/{p.slug}" class="rounded-xl px-5 py-3 text-center font-heading text-sm font-semibold transition-all duration-200 flex-1" style="color:{p.accentHex};">Learn more →</a>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- FAQ -->
<section class="border-t border-slate-200/60 bg-warm-white py-20 md:py-28">
	<div class="container-page">
		<div class="reveal mb-12">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">Common Questions</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">Pricing FAQ.</h2>
		</div>
		<div class="grid gap-5 md:grid-cols-2 max-w-4xl">
			{#each [
				{ q:'Is there an evaluation period?', a:'Every engagement begins with a structured evaluation, during which our team works with you to configure the platform for your specific workflow. Evaluation access is granted after a brief qualification conversation.' },
				{ q:'How is pricing determined?', a:'We size pricing to the scope of your deployment — number of sites, data volume, and workflow complexity. We prove the model on your data first, then discuss a plan sized to your organization.' },
				{ q:'Is pricing billed monthly or annually?', a:'Both options are available and discussed as part of your pricing conversation.' },
				{ q:'Do you work with academic or non-profit institutions?', a:'Yes — our early FluorocellAI deployments are with a cancer-research lab and an academic cell-biology core. Contact us to discuss institutional pricing.' },
				{ q:'What does onboarding look like?', a:'Demonstrations are conducted by domain specialists, not sales staff, and every demo is tailored to your specific workflow before we discuss terms.' },
				{ q:'Can I cancel or change my plan?', a:'Cancellation and plan-change terms, including notice period, are set out in your contract. Reach out to your account contact to review your specific terms or initiate a change.' },
			] as item, i}
				<div class="reveal rounded-2xl border border-slate-200/60 bg-white p-6" style="transition-delay:{i*50}ms;">
					<h3 class="font-heading text-sm font-semibold text-slate-900">{item.q}</h3>
					<p class="mt-2 font-body text-sm leading-relaxed text-slate-400">{item.a}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA -->
<section class="relative overflow-hidden bg-slate-950 py-24">
	<div class="aurora opacity-25" aria-hidden="true"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 to-transparent"></div>
	<div class="container-page relative z-10 text-center">
		<div class="reveal">
			<h2 class="font-display text-3xl font-normal italic text-white md:text-4xl">Not sure which plan is right for you?</h2>
			<p class="mx-auto mt-4 max-w-md font-body text-sm leading-relaxed text-slate-400">Our scientific team will review your workflow and recommend the right plan before you commit to anything.</p>
			<div class="mt-8 flex flex-wrap justify-center gap-4">
				<a href="/demo" class="btn-hero-primary">Request a Demonstration</a>
			</div>
		</div>
	</div>
</section>
