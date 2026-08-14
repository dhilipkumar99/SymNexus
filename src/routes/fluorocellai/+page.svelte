<script lang="ts">
	import { IMG } from '$lib/images';
	import FluorocellMock from '$lib/components/products/FluorocellMock.svelte';
</script>

<svelte:head>
	<title>FluorocellAI — SymNexus</title>
	<meta name="description" content="FluorocellAI: AI-automated cell identification, counting, and analysis for cell and cancer research labs. A same-day first pass, without changing how you prepare or image samples." />
</svelte:head>

<!-- Hero -->
<section class="relative w-full overflow-hidden bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-20">
	<div class="pointer-events-none absolute inset-0" style="background: radial-gradient(ellipse 80% 60% at 15% 0%, rgba(64,224,208,0.12) 0%, transparent 55%)"></div>
	<div class="container-page relative z-10">
		<div style="animation: fade-up 0.9s cubic-bezier(0.23,1.01,0.32,1) 0.1s both;">
			<p class="font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em]" style="color:#40e0d0;">Imaging & Cell Analysis</p>
			<h1 class="mt-3 font-display text-5xl font-normal italic leading-[1.05] tracking-tight text-white md:text-6xl max-w-3xl">
				FluorocellAI
			</h1>
			<p class="mt-5 max-w-xl font-body text-base leading-relaxed text-slate-300 md:text-lg">
				AI-automated cell identification, counting, and analysis for cell and cancer research labs. A workflow that took roughly three to four days manually compresses to same-day turnaround — without changing how the lab prepares or images its samples.
			</p>
			<div class="mt-8 flex flex-wrap gap-4">
				<a href="/demo" class="btn-hero-primary">Request Evaluation</a>
				<a href="/fluorocellai/pricing" class="btn-hero-secondary">View Pricing</a>
			</div>
		</div>
		<div class="mt-12 max-w-2xl" style="animation: fade-up 0.9s cubic-bezier(0.23,1.01,0.32,1) 0.3s both;">
			<FluorocellMock />
			<p class="mt-3 font-body text-[0.68rem] text-white/25">Illustrative interface preview. Request an evaluation to see the live product.</p>
		</div>
	</div>
</section>

<!-- Overview -->
<section id="overview" class="bg-warm-white py-24 md:py-32">
	<div class="container-page">
		<div class="grid gap-16 md:grid-cols-2 md:gap-24 items-center">
			<div class="reveal">
				<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em]" style="color:#40e0d0;">Platform Overview</p>
				<h2 class="mt-4 font-display text-3xl font-normal italic leading-snug text-slate-900 md:text-4xl">
					The accuracy you couldn't achieve manually, at same-day turnaround.
				</h2>
				<p class="mt-5 font-body text-base leading-relaxed text-slate-500">
					FluorocellAI slots into the workflow your lab already runs — slide prep and imaging stay unchanged. What used to be one to two days of manual counting and annotation, plus a further day each of manual QC and reporting, becomes minutes of automated segmentation and counting with an automatic QC and audit trail behind it.
				</p>
				<p class="mt-4 font-body text-sm leading-relaxed text-slate-400">
					Built on our proprietary machine learning models and validated by working cell biologists — not shipped generic and adapted after the fact. Every deployment adds annotated microscopy data back into our proprietary dataset, compounding accuracy over time.
				</p>
				<div class="mt-8 flex flex-wrap gap-3">
					<a href="/demo" class="btn-primary">Request Evaluation</a>
					<a href="/fluorocellai/pricing" class="btn-secondary">View Pricing</a>
				</div>
			</div>
			<!-- Pipeline steps -->
			<div class="reveal rounded-2xl overflow-hidden border border-slate-200/60" style="background:#0f1e20;">
				<div class="border-b border-white/5 px-6 py-4 flex items-center justify-between">
					<span class="font-mono text-[0.6rem] font-medium uppercase tracking-[0.18em] text-white/30">Analysis Pipeline</span>
				</div>
				{#each [
					{step:'01', title:'Slide Prep & Imaging',   detail:'Unchanged — FluorocellAI works with your existing imaging setup'},
					{step:'02', title:'Automated Segmentation', detail:'Cell identification and counting, in minutes rather than days'},
					{step:'03', title:'Automated QC',           detail:'Audit trail generated automatically behind every result'},
					{step:'04', title:'Reporting',              detail:'Same-day write-up, ready for downstream analysis'},
				] as s, i}
					<div class="flex items-start gap-4 px-6 py-5 {i < 3 ? 'border-b border-white/[0.05]' : ''}">
						<span class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[0.55rem] font-bold text-slate-950" style="background:#40e0d0;">{s.step}</span>
						<div>
							<p class="font-heading text-[0.85rem] font-semibold text-white">{s.title}</p>
							<p class="mt-0.5 font-body text-[0.75rem] leading-relaxed text-white/35">{s.detail}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- Pull quote -->
<section class="relative overflow-hidden border-y border-slate-200/60 bg-slate-950 py-16 md:py-20">
	<div class="container-page relative z-10">
		<blockquote class="reveal max-w-2xl font-display text-xl font-normal italic leading-relaxed text-white md:text-2xl">
			&ldquo;A workflow that took roughly three to four days manually compresses to same-day turnaround — without changing how the lab prepares or images its samples.&rdquo;
		</blockquote>
		<p class="reveal mt-4 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-white/40">Cancer-research lab — FluorocellAI pilot customer</p>
	</div>
</section>

<!-- Capabilities -->
<section class="bg-paper py-24 md:py-32">
	<div class="container-page">
		<div class="reveal mb-12">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em]" style="color:#40e0d0;">Capabilities</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">Built for every fluorescence microscopy workflow.</h2>
		</div>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each [
				{title:'Automated segmentation & counting', body:'Cell identification and counting that took one to two days manually now runs in minutes, matching expert-level annotation.'},
				{title:'Automatic QC & audit trail',  body:'Every result carries an automatic QC pass and a built-in audit trail — no separate manual re-count step required.'},
				{title:'Same-day reporting',            body:'Write-up and reporting generate automatically, ready for downstream analysis the same day imaging completes.'},
				{title:'Unchanged slide prep',            body:'FluorocellAI works with your existing imaging setup — slide prep and imaging are not disrupted by adoption.'},
				{title:'Compounding proprietary data',         body:'Every deployment adds annotated microscopy data back into our proprietary dataset, a compounding advantage a generic AI tool cannot replicate.'},
				{title:'Validated by working scientists',          body:'Built in close collaboration with cancer-research labs and academic cell-biology cores — not shipped generic and adapted after the fact.'},
			] as feat, i}
				<div class="reveal rounded-2xl border border-slate-200/60 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style="transition-delay:{i*50}ms;">
					<div class="mb-3 h-0.5 w-8 rounded-full" style="background:#40e0d0;"></div>
					<h3 class="font-heading text-sm font-semibold text-slate-900">{feat.title}</h3>
					<p class="mt-2 font-body text-sm leading-relaxed text-slate-400">{feat.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Who uses it -->
<section class="bg-warm-white border-t border-slate-200/60 py-24 md:py-28">
	<div class="container-page">
		<div class="reveal mb-12">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em]" style="color:#40e0d0;">Use Cases</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">Who uses FluorocellAI.</h2>
		</div>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			{#each [
				{role:'Cancer-Research Institutes',    img:IMG.labEquipment, desc:'Compress cell-analysis turnaround from days to a same-day first pass, without changing established imaging protocols.'},
				{role:'Academic Cell-Biology Cores',   img:IMG.microscopeSetup, desc:'Offer AI-assisted counting and analysis as a core facility service, integrated into existing lab workflows.'},
				{role:'CROs & Pharma/Biotech R&D',     img:IMG.labSamples, desc:'Scale cell-analysis throughput across client programs without proportionally scaling headcount.'},
				{role:'Regulatory Affairs Teams',      img:IMG.phytoplankton, desc:'Rely on automatic QC and a built-in audit trail for cell-analysis data that supports regulatory submissions.'},
			] as uc, i}
				<div class="reveal group rounded-2xl border border-slate-200/60 overflow-hidden bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style="transition-delay:{i*60}ms;">
					<div class="relative h-36 overflow-hidden">
						<img src={uc.img} alt="" aria-hidden="true" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" loading="lazy" />
						<div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
					</div>
					<div class="p-5">
						<h3 class="font-heading text-sm font-semibold text-slate-900">{uc.role}</h3>
						<p class="mt-2 font-body text-xs leading-relaxed text-slate-400">{uc.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA -->
<section class="relative overflow-hidden bg-slate-950 py-24 md:py-32">
	<img src={IMG.darkLab} alt="" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover opacity-20" loading="lazy" />
	<div class="pointer-events-none absolute inset-0" style="background: radial-gradient(ellipse 70% 60% at 5% 90%, rgba(64,224,208,0.15) 0%, transparent 55%)"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 to-transparent"></div>
	<div class="container-page relative z-10">
		<div class="reveal flex flex-wrap items-center justify-between gap-10">
			<div class="max-w-xl">
				<h2 class="font-display text-3xl font-normal italic text-white md:text-4xl">Begin your FluorocellAI evaluation.</h2>
				<p class="mt-4 font-body text-sm leading-relaxed text-slate-400">We tailor every evaluation to your imaging modality, cell type, and existing pipeline. Our scientific team guides the process from installation to your first publication-quality output.</p>
			</div>
			<div class="flex flex-wrap gap-4">
				<a href="/demo" class="btn-hero-primary">Request Evaluation</a>
				<a href="/fluorocellai/pricing" class="btn-hero-secondary">View Pricing</a>
			</div>
		</div>
	</div>
</section>
