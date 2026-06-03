<script lang="ts">
	import { IMG } from '$lib/images';

	const openRoles = [
		{
			title: 'Senior Machine Learning Engineer — Cell Segmentation',
			team: 'FluorocellAI',
			accentHex: '#40e0d0',
			type: 'Full-time · Remote',
			desc: 'Own the architecture, training, and evaluation of the segmentation models that power FluorocellAI. You will work directly with our imaging scientists to push segmentation accuracy on novel cell types and modalities.',
			reqs: ['5+ years ML engineering', 'Expert PyTorch', 'Computer vision / biomedical imaging experience', 'Familiarity with ImageJ plugin ecosystem a strong plus'],
		},
		{
			title: 'Biomedical Imaging Scientist',
			team: 'FluorocellAI',
			accentHex: '#40e0d0',
			type: 'Full-time · Remote',
			desc: 'Bridge the gap between our ML models and the biologists who use them. You will evaluate segmentation outputs against expert annotation, identify failure modes, and work with the engineering team to prioritise model improvements.',
			reqs: ['PhD in cell biology, biophysics, or related field', 'Hands-on fluorescence microscopy experience', 'Familiarity with ImageJ / FIJI / CellProfiler', 'Comfort with Python data analysis'],
		},
		{
			title: 'CLIA Regulatory Specialist',
			team: 'ComplianceCall',
			accentHex: '#7b8fe8',
			type: 'Full-time · Remote',
			desc: 'Serve as the domain authority for all CLIA regulatory content in ComplianceCall. Monitor the Federal Register, interpret new requirements, translate them into platform features, and support customers through complex compliance questions.',
			reqs: ['MT(ASCP) or equivalent certification', '5+ years clinical laboratory compliance experience', 'Deep familiarity with CLIA CFR Part 493', 'Experience as a Technical Consultant preferred'],
		},
		{
			title: 'Full-Stack Engineer (SvelteKit / TypeScript)',
			team: 'Platform',
			accentHex: '#d4a0b0',
			type: 'Full-time · Remote',
			desc: 'Build the web interfaces that laboratory professionals use every day. You will own features across both FluorocellAI and ComplianceCall — from high-performance data visualisation to compliance workflow UIs.',
			reqs: ['4+ years production TypeScript', 'SvelteKit or equivalent modern framework', 'Strong UI/UX instincts', 'Experience with data-dense professional applications'],
		},
		{
			title: 'Scientific Account Manager',
			team: 'Customer Success',
			accentHex: '#d4a0b0',
			type: 'Full-time · Remote',
			desc: 'Guide qualified research teams and clinical laboratories through evaluation, onboarding, and long-term success. You are a scientist first — you understand workflows deeply enough to be genuinely useful, not just a point of escalation.',
			reqs: ['Background in cell biology or clinical laboratory science', '3+ years customer-facing role in scientific software', 'Ability to run technical demonstrations independently', 'Exceptional written communication'],
		},
	];

	const values = [
		{ title: 'Scientists first',       body: 'Every person at Yashara — engineers included — develops a working understanding of the laboratory workflows our software serves. We do not build what we do not understand.' },
		{ title: 'Depth over breadth',     body: 'We ship fewer features than our competitors and make each one more rigorous. The same applies to our team: we hire fewer people and invest more in each one.' },
		{ title: 'Long time horizons',     body: 'We build software designed to last five years in production laboratory environments. We think about our careers the same way — we are not optimising for the next 18 months.' },
		{ title: 'Transparent by default', body: 'Compensation bands, financial performance, product roadmaps, and strategic decisions are shared with the whole company. We have no information hierarchy.' },
	];
</script>

<svelte:head>
	<title>Careers — Yashara Biosciences</title>
	<meta name="description" content="Open roles at Yashara Biosciences. We build rigorous scientific software and hire scientists, engineers, and domain specialists who want to work at the frontier of laboratory informatics." />
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden bg-slate-950 pt-40 pb-24 md:pt-52 md:pb-28">
	<img src={IMG.labTeam} alt="Research team in a laboratory setting" class="absolute inset-0 h-full w-full object-cover opacity-30" loading="eager" />
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/55 to-slate-950/10"></div>
	<div class="container-page relative z-10">
		<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose/80">Careers</p>
		<h1 class="mt-4 font-display text-5xl font-normal italic leading-[1.05] text-white md:text-6xl max-w-2xl">
			Build software that matters to working scientists.
		</h1>
		<p class="mt-5 max-w-xl font-body text-base leading-relaxed text-slate-400">
			We are a small, deep team. Every person here has meaningful impact on what we build and how we build it. We hire for depth, not headcount.
		</p>
		<div class="mt-8 flex flex-wrap gap-4">
			<a href="#roles" class="btn-hero-primary">See open roles</a>
			<a href="/about"  class="btn-ghost-dark">About Yashara <span class="text-white/40">→</span></a>
		</div>
	</div>
</section>

<!-- Values -->
<section class="bg-warm-white py-20 md:py-28">
	<div class="container-page">
		<div class="grid gap-14 md:grid-cols-2 md:gap-20 items-center">
			<div class="reveal">
				<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">How We Work</p>
				<h2 class="mt-4 font-display text-3xl font-normal italic leading-snug text-slate-900 md:text-4xl">
					Small team. Deep expertise. Long time horizon.
				</h2>
				<p class="mt-5 font-body text-sm leading-relaxed text-slate-500">
					Yashara is not a growth-at-all-costs company. We are building software infrastructure for laboratory environments that need stability and rigour over novelty. The same is true of how we build our team.
				</p>
				<div class="mt-8 grid grid-cols-1 gap-4">
					{#each values as v, i}
						<div class="reveal flex gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 transition-all duration-300 hover:shadow-md" style="transition-delay:{i*60}ms;">
							<div class="flex-shrink-0 font-mono text-xl font-medium text-slate-200 leading-none mt-0.5">0{i+1}</div>
							<div>
								<h3 class="font-heading text-sm font-semibold text-slate-900">{v.title}</h3>
								<p class="mt-1 font-body text-xs leading-relaxed text-slate-400">{v.body}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
			<div class="reveal space-y-3">
				<div class="overflow-hidden rounded-2xl">
					<img src={IMG.scientistScope} alt="Researcher working at a microscope" class="w-full h-64 object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
				</div>
				<div class="grid grid-cols-2 gap-3">
					<div class="overflow-hidden rounded-2xl">
						<img src={IMG.labGlassware} alt="Laboratory glassware and research equipment" class="w-full h-36 object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
					</div>
					<div class="overflow-hidden rounded-2xl">
						<img src={IMG.pipette} alt="Researcher using a pipette" class="w-full h-36 object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Benefits -->
<section class="border-t border-slate-200/60 bg-paper py-16 md:py-20">
	<div class="container-page">
		<div class="reveal mb-10">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">Compensation & Benefits</p>
			<h2 class="mt-3 font-display text-2xl font-normal italic text-slate-900 md:text-3xl">What we offer.</h2>
		</div>
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
			{#each [
				{ icon: '⟨⟩', title: 'Competitive salary',        body: 'Top-quartile compensation benchmarked against FAANG-adjacent companies. Full transparency on bands.' },
				{ icon: '◎',  title: 'Equity',                    body: 'Meaningful early-stage equity with a 4-year vest and 1-year cliff. We share cap table details during the process.' },
				{ icon: '◻',  title: 'Fully remote',              body: 'Work from anywhere. We have no office and no plans to build one. Async-first culture with two video standups per week.' },
				{ icon: '◈',  title: 'Equipment budget',          body: '$3,000 home office setup budget, refreshed every three years. Choose your own hardware.' },
				{ icon: '◇',  title: 'Learning budget',           body: '$2,500/year for conferences, courses, books, and anything else that makes you better at the work.' },
				{ icon: '○',  title: 'Health coverage',           body: 'Full medical, dental, and vision coverage. 100% premium covered for you; 50% for dependents.' },
				{ icon: '◑',  title: 'Flexible time off',         body: 'No accrual. Take what you need. We track that people are actually taking time off, not just that the policy allows it.' },
				{ icon: '◐',  title: 'Parental leave',            body: '16 weeks fully paid for all new parents — birth, adoption, or foster placement.' },
			] as b, i}
				<div class="reveal rounded-2xl border border-slate-200/60 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style="transition-delay:{i*40}ms;">
					<span class="font-mono text-base text-slate-300">{b.icon}</span>
					<h3 class="mt-3 font-heading text-xs font-semibold text-slate-900">{b.title}</h3>
					<p class="mt-1.5 font-body text-xs leading-relaxed text-slate-400">{b.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Open roles -->
<section id="roles" class="bg-warm-white py-20 md:py-28">
	<div class="container-page">
		<div class="reveal mb-12">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">Open Roles</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">We're hiring.</h2>
			<p class="mt-3 font-body text-sm text-slate-400">All roles are fully remote. We are an equal opportunity employer and actively seek candidates from underrepresented groups in science and technology.</p>
		</div>
		<div class="space-y-3">
			{#each openRoles as role, i}
				<div class="reveal rounded-2xl border border-slate-200/60 bg-white p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style="transition-delay:{i*60}ms;">
					<div class="flex flex-wrap items-start justify-between gap-4">
						<div>
							<div class="flex flex-wrap items-center gap-2 mb-2">
								<span class="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.15em]" style="color:{role.accentHex};">{role.team}</span>
								<span class="font-mono text-[0.58rem] text-slate-300">·</span>
								<span class="font-mono text-[0.58rem] text-slate-300">{role.type}</span>
							</div>
							<h3 class="font-display text-xl font-normal italic text-slate-900">{role.title}</h3>
						</div>
						<a href="/contact?role={encodeURIComponent(role.title)}" class="btn-secondary text-xs flex-shrink-0">Apply →</a>
					</div>
					<p class="mt-3 font-body text-sm leading-relaxed text-slate-500">{role.desc}</p>
					<ul class="mt-4 flex flex-wrap gap-2">
						{#each role.reqs as req}
							<li class="rounded-full border border-slate-200 px-3 py-1 font-body text-xs text-slate-400">{req}</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<div class="reveal mt-8 rounded-2xl border border-dashed border-slate-200 bg-paper p-8 text-center">
			<h3 class="font-display text-lg font-normal italic text-slate-700">Don't see your role?</h3>
			<p class="mt-2 font-body text-sm text-slate-400 max-w-md mx-auto">We occasionally hire for roles we haven't listed yet. If you are exceptional at something that matters for the work we do, introduce yourself.</p>
			<a href="/contact" class="mt-5 inline-block btn-secondary text-xs">Send an introduction →</a>
		</div>
	</div>
</section>

<!-- CTA -->
<section class="relative overflow-hidden bg-slate-950 py-20">
	<div class="aurora opacity-20" aria-hidden="true"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 to-transparent"></div>
	<div class="container-page relative z-10 text-center">
		<div class="reveal">
			<h2 class="font-display text-2xl font-normal italic text-white md:text-3xl">Questions before applying?</h2>
			<p class="mx-auto mt-3 max-w-md font-body text-sm leading-relaxed text-slate-400">Email us at <a href="mailto:careers@yashara.us" class="text-crystal-rose hover:text-crystal-blush transition-colors">careers@yashara.us</a>. We read every message.</p>
		</div>
	</div>
</section>
