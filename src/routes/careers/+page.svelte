<script lang="ts">
	import { IMG } from '$lib/images';

	const values = [
		{ title: 'Small, senior team',     body: 'Silicon Valley engineers from NXP Semiconductors, Zoom, Amazon, and ServiceNow, plus Berkeley- and Stanford-trained researchers. We hire for depth, not headcount.' },
		{ title: 'Domain-native, not generic', body: 'We build software validated by the working scientists and compliance professionals who use it — not adapted after the fact for the lab or the regulator.' },
		{ title: 'Prove it, then teach it', body: 'We prove our AI models first, then train businesses to manage these systems independently. The same discipline applies to how we build internally.' },
		{ title: 'Compliance by design',   body: 'Full audit-trail transparency is built into everything we ship. That rigor extends to how we operate as a team.' },
	];
</script>

<svelte:head>
	<title>Careers — SymNexus</title>
	<meta name="description" content="SymNexus is a small team of Silicon Valley engineers and domain researchers building AI systems for regulated industries. Get in touch if you think you'd be a fit." />
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden bg-slate-950 pt-40 pb-24 md:pt-52 md:pb-28">
	<img src={IMG.labTeam} alt="Team working in a research setting" class="absolute inset-0 h-full w-full object-cover opacity-30" loading="eager" />
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/55 to-slate-950/10"></div>
	<div class="container-page relative z-10">
		<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose/80">Careers</p>
		<h1 class="mt-4 font-display text-5xl font-normal italic leading-[1.05] text-white md:text-6xl max-w-2xl">
			Build AI that matters to the people who use it.
		</h1>
		<p class="mt-5 max-w-xl font-body text-base leading-relaxed text-slate-400">
			We are a small, deep team of engineers and researchers. Every person here has meaningful impact on what we build and how we build it.
		</p>
		<div class="mt-8 flex flex-wrap gap-4">
			<a href="/contact" class="btn-hero-primary">Get in touch</a>
			<a href="/about"  class="btn-ghost-dark">About SymNexus <span class="text-white/40">→</span></a>
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
					Small team. Deep expertise. Domain-native discipline.
				</h2>
				<p class="mt-5 font-body text-sm leading-relaxed text-slate-500">
					SymNexus is building AI infrastructure for regulated industries that need precision and accountability over convenience. The same is true of how we build our team.
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

<!-- Open roles -->
<section id="roles" class="border-t border-slate-200/60 bg-paper py-20 md:py-28">
	<div class="container-page">
		<div class="reveal mb-8">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">Open Roles</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">No open roles listed right now.</h2>
		</div>
		<div class="reveal rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
			<h3 class="font-display text-lg font-normal italic text-slate-700">Think you'd be a fit anyway?</h3>
			<p class="mt-2 font-body text-sm text-slate-400 max-w-md mx-auto">We occasionally bring people on outside of a formal listing. If you're exceptional at something that matters for the work we do, introduce yourself.</p>
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
			<h2 class="font-display text-2xl font-normal italic text-white md:text-3xl">Questions before reaching out?</h2>
			<p class="mx-auto mt-3 max-w-md font-body text-sm leading-relaxed text-slate-400">Email us at <a href="mailto:cell.ai.solutions@gmail.com" class="text-crystal-rose hover:text-crystal-blush transition-colors">cell.ai.solutions@gmail.com</a>. We read every message.</p>
		</div>
	</div>
</section>
