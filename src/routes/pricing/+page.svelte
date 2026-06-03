<script lang="ts">
	import { IMG } from '$lib/images';

	const fluoroPlans = [
		{
			name: 'Investigator',
			price: '$290',
			period: '/mo',
			badge: null,
			desc: 'Single-investigator research group. Sized for a standard NIH R01 budget.',
			features: [
				'Up to 3 concurrent analysis jobs',
				'All fluorophore channels (DAPI, GFP, RFP, custom)',
				'2D nucleus & whole-cell segmentation',
				'ImageJ / Fiji native plugin',
				'CSV & HDF5 export',
				'Email support',
			],
			cta: 'Start evaluation',
			href: '/demo',
			highlighted: false,
		},
		{
			name: 'Core Facility',
			price: '$890',
			period: '/mo',
			badge: 'Most popular',
			desc: 'Shared imaging core or mid-size lab. Batch automation and OMERO integration.',
			features: [
				'Unlimited concurrent analysis jobs',
				'All fluorophore channels + custom configs',
				'2D & 3D (confocal / light-sheet) segmentation',
				'ImageJ, Fiji, OMERO server integration',
				'96-well & 384-well plate automation',
				'KNIME, R, CellProfiler Analyst output',
				'Automated QC flagging',
				'Priority email + video support',
			],
			cta: 'Start evaluation',
			href: '/demo',
			highlighted: true,
		},
		{
			name: 'Enterprise',
			price: 'Custom',
			period: '',
			badge: null,
			desc: 'Pharmaceutical CROs, large academic cores, multi-site deployments.',
			features: [
				'Everything in Core Facility',
				'HPC cluster deployment support',
				'Custom model fine-tuning on your cell type',
				'REST API access for pipeline integration',
				'SLA-backed uptime guarantee',
				'Dedicated scientific account manager',
				'On-site installation & training',
			],
			cta: 'Contact us',
			href: '/contact',
			highlighted: false,
		},
	];

	const compliancePlans = [
		{
			name: 'Single Site',
			price: '$490',
			period: '/mo',
			badge: null,
			desc: 'Single clinical or research laboratory. Full CLIA compliance coverage.',
			features: [
				'All 21 CLIA compliance modules',
				'Live FDA CLIA database connection',
				'Federal Register update integration',
				'Document control with e-signatures',
				'Personnel credentialing tracking',
				'Email support',
			],
			cta: 'Request demonstration',
			href: '/demo',
			highlighted: false,
		},
		{
			name: 'Consulting Practice',
			price: '$1,290',
			period: '/mo',
			badge: 'Most popular',
			desc: 'Technical Consultants managing multiple client laboratories from one account.',
			features: [
				'Everything in Single Site',
				'Up to 10 laboratory accounts',
				'Cross-laboratory analytics dashboard',
				'Configurable access controls per lab',
				'DTag prevention engine',
				'CLIA survey preparation workflows',
				'CMS-116 licensing management',
				'Priority support + quarterly review calls',
			],
			cta: 'Request demonstration',
			href: '/demo',
			highlighted: true,
		},
		{
			name: 'Enterprise',
			price: 'Custom',
			period: '',
			badge: null,
			desc: 'Large health systems, hospital networks, or practices with more than 10 sites.',
			features: [
				'Everything in Consulting Practice',
				'Unlimited laboratory accounts',
				'Custom SSO & LDAP integration',
				'Dedicated compliance specialist',
				'BAA & HIPAA Business Associate Agreement',
				'Custom data retention policies',
				'On-site training & onboarding',
			],
			cta: 'Contact us',
			href: '/contact',
			highlighted: false,
		},
	];
</script>

<svelte:head>
	<title>Pricing — Yashara Biosciences</title>
	<meta name="description" content="Transparent pricing for FluorocellAI and ComplianceCall. Plans sized for independent research groups through enterprise deployments." />
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden bg-slate-950 pt-40 pb-24 md:pt-52 md:pb-28">
	<div class="aurora opacity-30" aria-hidden="true"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent"></div>
	<div class="container-page relative z-10 text-center">
		<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose/80">Pricing</p>
		<h1 class="mt-4 font-display text-5xl font-normal italic leading-[1.05] text-white md:text-6xl max-w-2xl mx-auto">
			Transparent pricing. No surprises.
		</h1>
		<p class="mt-5 max-w-lg mx-auto font-body text-base leading-relaxed text-slate-400">
			Every plan includes a structured evaluation period. We price against the NIH R01 budget for single-investigator plans — institutional-grade software should not require an institutional budget.
		</p>
	</div>
</section>

<!-- FluorocellAI pricing -->
<section class="bg-warm-white py-20 md:py-28">
	<div class="container-page">
		<div class="reveal mb-12 flex flex-wrap items-end justify-between gap-4">
			<div>
				<p class="font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em]" style="color:#40e0d0;">FluorocellAI</p>
				<h2 class="mt-2 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">Cell analysis pricing.</h2>
			</div>
			<a href="/fluorocellai" class="btn-secondary text-xs">Learn about FluorocellAI →</a>
		</div>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			{#each fluoroPlans as plan, i}
				<div
					class="reveal relative flex flex-col rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-0.5"
					class:border-slate-200={!plan.highlighted}
					class:bg-white={!plan.highlighted}
					class:hover:shadow-md={!plan.highlighted}
					class:border-transparent={plan.highlighted}
					class:bg-slate-950={plan.highlighted}
					class:shadow-xl={plan.highlighted}
					style="transition-delay:{i*80}ms;"
				>
					{#if plan.badge}
						<span class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 font-heading text-[0.62rem] font-semibold text-slate-950" style="background:#40e0d0;">{plan.badge}</span>
					{/if}
					<div>
						<p class="font-heading text-xs font-semibold uppercase tracking-[0.12em]" class:text-slate-400={!plan.highlighted} class:text-white={plan.highlighted}>{plan.name}</p>
						<div class="mt-3 flex items-baseline gap-1">
							<span class="font-display text-4xl font-normal italic" class:text-slate-900={!plan.highlighted} class:text-white={plan.highlighted}>{plan.price}</span>
							{#if plan.period}<span class="font-body text-sm text-slate-400">{plan.period}</span>{/if}
						</div>
						<p class="mt-2 font-body text-xs leading-relaxed text-slate-400">{plan.desc}</p>
					</div>
					<ul class="mt-7 flex-1 space-y-2.5">
						{#each plan.features as feat}
							<li class="flex items-start gap-2.5 font-body text-xs" class:text-slate-500={!plan.highlighted} class:text-slate-300={plan.highlighted}>
								<span class="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style="background:#40e0d0;"></span>
								{feat}
							</li>
						{/each}
					</ul>
					<a
						href={plan.href}
						class="mt-8 block rounded-xl py-3 text-center font-heading text-sm font-semibold transition-all duration-200"
						class:bg-slate-100={!plan.highlighted}
						class:text-slate-900={!plan.highlighted}
						class:hover:bg-slate-200={!plan.highlighted}
						style={plan.highlighted ? 'background:#40e0d0; color:#0f1a1a;' : ''}
					>
						{plan.cta}
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ComplianceCall pricing -->
<section class="border-t border-slate-200/60 bg-paper py-20 md:py-28">
	<div class="container-page">
		<div class="reveal mb-12 flex flex-wrap items-end justify-between gap-4">
			<div>
				<p class="font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em]" style="color:#7b8fe8;">ComplianceCall</p>
				<h2 class="mt-2 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">Compliance management pricing.</h2>
			</div>
			<a href="/compliancecall" class="btn-secondary text-xs">Learn about ComplianceCall →</a>
		</div>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			{#each compliancePlans as plan, i}
				<div
					class="reveal relative flex flex-col rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-0.5"
					class:border-slate-200={!plan.highlighted}
					class:bg-white={!plan.highlighted}
					class:hover:shadow-md={!plan.highlighted}
					class:border-transparent={plan.highlighted}
					class:bg-slate-950={plan.highlighted}
					class:shadow-xl={plan.highlighted}
					style="transition-delay:{i*80}ms;"
				>
					{#if plan.badge}
						<span class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 font-heading text-[0.62rem] font-semibold text-slate-950" style="background:#7b8fe8;">{plan.badge}</span>
					{/if}
					<div>
						<p class="font-heading text-xs font-semibold uppercase tracking-[0.12em]" class:text-slate-400={!plan.highlighted} class:text-white={plan.highlighted}>{plan.name}</p>
						<div class="mt-3 flex items-baseline gap-1">
							<span class="font-display text-4xl font-normal italic" class:text-slate-900={!plan.highlighted} class:text-white={plan.highlighted}>{plan.price}</span>
							{#if plan.period}<span class="font-body text-sm text-slate-400">{plan.period}</span>{/if}
						</div>
						<p class="mt-2 font-body text-xs leading-relaxed text-slate-400">{plan.desc}</p>
					</div>
					<ul class="mt-7 flex-1 space-y-2.5">
						{#each plan.features as feat}
							<li class="flex items-start gap-2.5 font-body text-xs" class:text-slate-500={!plan.highlighted} class:text-slate-300={plan.highlighted}>
								<span class="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style="background:#7b8fe8;"></span>
								{feat}
							</li>
						{/each}
					</ul>
					<a
						href={plan.href}
						class="mt-8 block rounded-xl py-3 text-center font-heading text-sm font-semibold transition-all duration-200"
						class:bg-slate-100={!plan.highlighted}
						class:text-slate-900={!plan.highlighted}
						class:hover:bg-slate-200={!plan.highlighted}
						style={plan.highlighted ? 'background:#7b8fe8; color:#0f0d15;' : ''}
					>
						{plan.cta}
					</a>
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
				{ q:'Is there a free trial?', a:'Every plan begins with a structured evaluation period — typically two to four weeks — during which our scientific team works with you to configure the platform for your specific workflow. Evaluation access is granted after a brief qualification conversation.' },
				{ q:'Can I switch plans?', a:'Yes. You can upgrade or downgrade at the start of any billing cycle. Upgrades take effect immediately; downgrades take effect at the next renewal date.' },
				{ q:'Is pricing annual or monthly?', a:'Both options are available. Annual plans are billed at 10 months for 12 — effectively two months free relative to the monthly rate.' },
				{ q:'What counts as a "laboratory" for ComplianceCall?', a:'A single CLIA certificate number constitutes one laboratory for billing purposes. Multi-site systems with a parent certificate and satellite certificates should contact us for custom pricing.' },
				{ q:'Do you offer academic or non-profit discounts?', a:'Yes. Verified non-profit research institutions and academic medical centres qualify for a 20% discount on Investigator and Single Site plans. Contact us with your institutional email to apply.' },
				{ q:'What is your refund policy?', a:'If you cancel within 30 days of your first paid invoice and have not yet used the platform for production work, we will issue a full refund. After 30 days, we prorate unused time.' },
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
				<a href="/demo" class="btn-hero-primary">Talk to our team</a>
			</div>
		</div>
	</div>
</section>
