<script lang="ts">
	import { IMG } from '$lib/images';
</script>

<svelte:head>
	<title>Research — SymNexus</title>
	<meta name="description" content="A case study on FluorocellAI in a cancer-research lab: what changed, and how much time it saved." />
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden bg-slate-950 pt-40 pb-24 md:pt-52 md:pb-28">
	<img src={IMG.fluoroCells} alt="" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover opacity-20" loading="eager" />
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent"></div>
	<div class="container-page relative z-10">
		<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose/80">Research</p>
		<h1 class="mt-4 font-display text-5xl font-normal italic leading-[1.05] text-white md:text-6xl max-w-2xl">
			What changed for one cancer-research lab.
		</h1>
		<p class="mt-5 max-w-lg font-body text-base leading-relaxed text-slate-400">
			A before-and-after look at FluorocellAI in production.
		</p>
	</div>
</section>

<!-- Case study: FluorocellAI -->
<section class="bg-warm-white py-20 md:py-28">
	<div class="container-page">
		<div class="reveal mb-10">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em]" style="color:#40e0d0;">Case Study</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">FluorocellAI, in a cancer-research lab.</h2>
			<p class="mt-4 max-w-2xl font-body text-sm leading-relaxed text-slate-500">A cancer-research lab's cell-analysis workflow, before and after FluorocellAI. FluorocellAI compresses manual review of cells from a week of manual cross-referencing to a same-day first pass.</p>
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

<!-- CTA -->
<section class="relative overflow-hidden bg-slate-950 py-20">
	<div class="aurora opacity-20" aria-hidden="true"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 to-transparent"></div>
	<div class="container-page relative z-10 text-center">
		<div class="reveal">
			<h2 class="font-display text-2xl font-normal italic text-white md:text-3xl">Want to see this on your own data?</h2>
			<p class="mx-auto mt-3 max-w-md font-body text-sm leading-relaxed text-slate-400">Request a Demonstration and we'll walk through FluorocellAI or ComplianceCall using your own workflow as the basis.</p>
			<div class="mt-6 flex flex-wrap justify-center gap-4">
				<a href="/demo" class="btn-hero-primary">Request a Demonstration</a>
			</div>
		</div>
	</div>
</section>
