<script lang="ts">
	import { IMG } from '$lib/images';
</script>

<svelte:head>
	<title>Research — SymNexus</title>
	<meta name="description" content="Case studies, market research, and the thesis behind SymNexus — domain-native AI systems for regulated industries." />
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden bg-slate-950 pt-40 pb-24 md:pt-52 md:pb-28">
	<img src={IMG.fluoroCells} alt="" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover opacity-20" loading="eager" />
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent"></div>
	<div class="container-page relative z-10">
		<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose/80">Research</p>
		<h1 class="mt-4 font-display text-5xl font-normal italic leading-[1.05] text-white md:text-6xl max-w-2xl">
			What we've proven, and why now.
		</h1>
		<p class="mt-5 max-w-lg font-body text-base leading-relaxed text-slate-400">
			Case studies from our deployments, the market thesis behind SymNexus, and why domain-native AI is becoming possible for industries that could never justify building it before.
		</p>
	</div>
</section>

<!-- Proven case: FluorocellAI -->
<section class="bg-warm-white py-20 md:py-28">
	<div class="container-page">
		<div class="reveal mb-10">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em]" style="color:#40e0d0;">Proven Case</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">FluorocellAI, in a cancer-research lab.</h2>
			<p class="mt-4 max-w-2xl font-body text-sm leading-relaxed text-slate-500">A cancer-research lab's cell-analysis workflow, before and after FluorocellAI. Fluorocell compresses manual review of cells from a week of manual cross-referencing to a same-day first pass.</p>
		</div>
		<div class="reveal grid grid-cols-1 gap-3 md:grid-cols-2">
			<div class="rounded-2xl border border-slate-200/60 bg-slate-700 p-6 text-white">
				<p class="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-white/60 mb-4">Before FluorocellAI</p>
				<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
					{#each [['Slide prep & imaging','Same'],['Manual counting','1–2 days'],['Manual QC / re-count','~1 day'],['Reporting & write-up','~1 day']] as [label, val]}
						<div class="rounded-xl bg-white/10 p-3 text-center">
							<p class="font-body text-[0.65rem] text-white/60">{label}</p>
							<p class="mt-1 font-heading text-sm font-semibold">{val}</p>
						</div>
					{/each}
				</div>
			</div>
			<div class="rounded-2xl border p-6 text-white" style="background:#0e5e5c;">
				<p class="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-white/70 mb-4">With FluorocellAI</p>
				<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
					{#each [['Slide prep & imaging','Unchanged'],['Automated counting','Minutes'],['Automated QC','Automatic'],['Reporting','Same day']] as [label, val]}
						<div class="rounded-xl bg-white/10 p-3 text-center">
							<p class="font-body text-[0.65rem] text-white/70">{label}</p>
							<p class="mt-1 font-heading text-sm font-semibold">{val}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<p class="reveal mt-6 max-w-2xl font-body text-sm italic leading-relaxed text-slate-400">Net effect: a workflow that took roughly three to four days manually compresses to same-day turnaround — without changing how the lab prepares or images its samples.</p>
	</div>
</section>

<!-- Example case: Textile production -->
<section class="border-t border-slate-200/60 bg-paper py-20 md:py-28">
	<div class="container-page">
		<div class="reveal mb-10">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">Example Case</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">Textile production — the same problem, applied elsewhere.</h2>
			<p class="mt-4 max-w-2xl font-body text-sm leading-relaxed text-slate-500">Every roll of fabric is checked for flaws before it can be cut into clothing. Today that check is done by eye — it's slow, and tired inspectors miss things. It's the same kind of visual-detection problem FluorocellAI already solves for cell analysis, applied to fabric instead.</p>
		</div>
		<div class="reveal grid grid-cols-1 gap-3 md:grid-cols-2">
			<div class="rounded-2xl border border-slate-200/60 bg-slate-700 p-6 text-white">
				<p class="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-white/60 mb-1">Before SymNexus</p>
				<p class="font-mono text-[0.65rem] text-white/50 mb-4">Total: 40 min/roll</p>
				<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
					{#each [['Load the roll','10 min'],['Check for flaws','15 min'],['Score the flaws','5 min'],['Sign off & log it','10 min']] as [label, val]}
						<div class="rounded-xl bg-white/10 p-3 text-center">
							<p class="font-body text-[0.65rem] text-white/60">{label}</p>
							<p class="mt-1 font-heading text-sm font-semibold">{val}</p>
						</div>
					{/each}
				</div>
			</div>
			<div class="rounded-2xl border p-6 text-white" style="background:#0e5e5c;">
				<p class="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-white/70 mb-1">With SymNexus</p>
				<p class="font-mono text-[0.65rem] text-white/60 mb-4">Total: 17 min/roll</p>
				<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
					{#each [['Load the roll','10 min'],['Check (AI vision)','5 min'],['Score the flaws','<1 min'],['Sign off & log it','1 min']] as [label, val]}
						<div class="rounded-xl bg-white/10 p-3 text-center">
							<p class="font-body text-[0.65rem] text-white/70">{label}</p>
							<p class="mt-1 font-heading text-sm font-semibold">{val}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<p class="reveal mt-6 max-w-2xl font-body text-sm italic leading-relaxed text-slate-400">Why it matters: standard practice only inspects about 10% of fabric rolls by hand — inspection is too slow to check everything, so most rolls ship unchecked. A mid-size mill producing 10,000 meters a day needs roughly 25 hours of manual inspection to cover it all — more than three shifts. Automated inspection finishes that same 10,000 meters in about 8 hours, inside a single shift — which is what makes checking 100% of rolls possible instead of just 10%.</p>
	</div>
</section>

<!-- Why now -->
<section class="bg-warm-white py-20 md:py-28">
	<div class="container-page">
		<div class="reveal mb-12">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">Why Now</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">Three forces converging at once.</h2>
		</div>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			{#each [
				{ num: '1', title: 'Technology', body: 'AI models have, in the last two years, matured enough to reliably handle unstructured, sensitive data — images, dense regulatory text — work that used to need large specialized teams. A small, senior team can now build and deploy custom AI for almost any domain, not just the ones with existing off-the-shelf tools.' },
				{ num: '2', title: 'Market', body: 'Every industry is under pressure to adopt AI, but few want to become a software company to do it. Businesses increasingly want to own a working AI system, built for their exact process — the way they own equipment — rather than rent a generic tool indefinitely. Asia adds a second dimension: its industries are scaling globally and need infrastructure built to scale.' },
				{ num: '3', title: 'Data', body: 'Every deployment — in any industry — adds proprietary, validated data specific to that workflow. That compounding advantage has served to make our AI models more robust than our competitors and also allowed us to develop proprietary "World Models," which model an extraordinarily high number of factors to provide additional insight to our customers regarding their data.' },
			] as item}
				<div class="reveal rounded-2xl border border-slate-200/60 bg-white p-7">
					<span class="flex h-8 w-8 items-center justify-center rounded-full font-heading text-xs font-bold text-white" style="background:#0e5e5c;">{item.num}</span>
					<h3 class="mt-4 font-heading text-base font-semibold text-slate-900">{item.title}</h3>
					<p class="mt-2 font-body text-sm leading-relaxed text-slate-400">{item.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Market size -->
<section class="border-t border-slate-200/60 bg-paper py-20 md:py-28">
	<div class="container-page">
		<div class="reveal mb-12">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">Market Size</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">The market we can capture.</h2>
			<p class="mt-3 max-w-xl font-body text-xs italic leading-relaxed text-slate-400">Estimates for the market we can capture, not the full global TAM these figures round up to. Figures are third-party estimates.</p>
		</div>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			{#each [
				{ label: 'Current Addressed Market', val: '$1.1M – $1.5M', body: 'AI-powered microscopy & cell-image-analysis tools for U.S. cancer-research institutes, CROs, and pharma/biotech R&D.' },
				{ label: 'US Market — Mid-Term', val: '$6M – $7M', body: 'Cell-image-analysis AI plus pharmaceutical compliance software, as ComplianceCall expands across the drug-development lifecycle.' },
				{ label: 'Asia — Long-Term', val: '$60M+', body: 'SymNexus as an AI infrastructure layer across Asia\'s pharmaceutical market plus adjacent regulated industries — medtech, diagnostics, agrochemicals — globally.' },
			] as m, i}
				<div class="reveal rounded-2xl border border-slate-200/60 bg-white p-7" style="transition-delay:{i*60}ms;">
					<p class="font-heading text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-slate-400">{m.label}</p>
					<p class="mt-2 font-display text-3xl font-normal italic text-slate-900">{m.val}</p>
					<p class="mt-3 font-body text-sm leading-relaxed text-slate-400">{m.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA -->
<section class="relative overflow-hidden bg-slate-950 py-20">
	<div class="aurora opacity-20" aria-hidden="true"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 to-transparent"></div>
	<div class="container-page relative z-10 text-center">
		<div class="reveal">
			<h2 class="font-display text-2xl font-normal italic text-white md:text-3xl">Interested in a similar case for your industry?</h2>
			<p class="mx-auto mt-3 max-w-md font-body text-sm leading-relaxed text-slate-400">We build domain-native AI for regulated and complex-workflow sectors — from cell biology and pharma to textiles and beyond.</p>
			<div class="mt-6 flex flex-wrap justify-center gap-4">
				<a href="/contact" class="btn-hero-primary">Get in touch</a>
			</div>
		</div>
	</div>
</section>
