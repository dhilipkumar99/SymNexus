<script lang="ts">
	import { IMG } from '$lib/images';
</script>

<svelte:head>
	<title>FluorocellAI — Yashara Biosciences</title>
	<meta name="description" content="FluorocellAI: high-throughput AI cell labeling and segmentation for fluorescence microscopy. Native ImageJ/Fiji integration. Transformer + CNN ensemble." />
</svelte:head>

<!-- Hero -->
<section class="relative h-[90vh] min-h-[600px] w-full overflow-hidden bg-slate-950">
	<img src={IMG.fluoroHero} alt="Fluorescence microscopy — multi-channel cell imaging" class="absolute inset-0 h-full w-full object-cover opacity-50" loading="eager" />
	<div class="pointer-events-none absolute inset-0" style="background: radial-gradient(ellipse 80% 60% at 15% 80%, rgba(64,224,208,0.18) 0%, transparent 55%)"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/10"></div>
	<div class="container-page relative z-10 flex h-full flex-col justify-end pb-20 md:pb-28">
		<div style="animation: fade-up 0.9s cubic-bezier(0.23,1.01,0.32,1) 0.1s both;">
			<p class="font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em]" style="color:#40e0d0;">Imaging & Cell Analysis</p>
			<h1 class="mt-3 font-display text-5xl font-normal italic leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl max-w-3xl">
				FluorocellAI
			</h1>
			<p class="mt-5 max-w-xl font-body text-base leading-relaxed text-slate-300 md:text-lg">
				Automated cell segmentation at research-grade fidelity. The ImageJ workflow your lab already trusts — augmented with transformer-based AI inference that runs at more than 10,000 cells per hour.
			</p>
		</div>
		<div class="mt-8 flex flex-wrap gap-4" style="animation: fade-up 0.9s cubic-bezier(0.23,1.01,0.32,1) 0.3s both;">
			<a href="/demo" class="btn-hero-primary">Request Evaluation</a>
			<a href="/fluorocellai/pricing" class="btn-hero-secondary">View Pricing</a>
			<a href="#overview" class="btn-ghost-dark">See how it works <span class="text-white/40">↓</span></a>
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
					The accuracy you couldn't achieve manually. The workflow you already trust.
				</h2>
				<p class="mt-5 font-body text-base leading-relaxed text-slate-500">
					FluorocellAI integrates as a native plugin within ImageJ and Fiji, preserving the analytical environment your laboratory has built over years of accumulated macros, scripts, and measurement pipelines. The manual annotation step is replaced with AI inference — everything downstream remains intact.
				</p>
				<p class="mt-4 font-body text-sm leading-relaxed text-slate-400">
					For high-content screening — 96-well and 384-well plate formats — batch pipelines operate autonomously with automated QC flagging, producing output compatible with KNIME, R, and CellProfiler Analyst without format conversion.
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
					<span class="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[0.55rem] text-white/20">v2.4</span>
				</div>
				{#each [
					{step:'01', title:'Image Ingestion',   detail:'TIFF, CZI, LIF, ND2 — direct from acquisition software or OMERO server'},
					{step:'02', title:'Preprocessing',     detail:'Illumination correction, background subtraction, channel normalisation'},
					{step:'03', title:'AI Inference',      detail:'Transformer + CNN ensemble — nucleus, boundary, and marker localisation'},
					{step:'04', title:'QC & Export',       detail:'ROI Manager, Results table, CSV, HDF5 — within the standard ImageJ environment'},
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

<!-- Image break -->
<section class="relative h-72 overflow-hidden md:h-96">
	<img src={IMG.fluoroCells} alt="Deep-field fluorescence microscopy — cellular structures" class="absolute inset-0 h-full w-full object-cover" loading="lazy" />
	<div class="absolute inset-0 bg-gradient-to-r from-slate-950/70 to-transparent"></div>
	<div class="container-page relative z-10 flex h-full items-center">
		<div class="reveal max-w-md">
			<p class="font-display text-xl font-normal italic text-white md:text-2xl">&ldquo;Segmentation accuracy indistinguishable from expert manual annotation in our internal benchmarking.&rdquo;</p>
			<p class="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-white/40">Dr. M. Kowalski — Senior Research Scientist, Cell Biology</p>
		</div>
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
				{title:'Multi-channel fluorophore analysis', body:'DAPI, GFP, RFP, CY3, CY5, and user-defined custom channel configurations with per-channel threshold tuning and crosstalk correction.'},
				{title:'Nucleus & whole-cell segmentation',  body:'Simultaneous nucleus detection and whole-cell boundary delineation with configurable expand-from-nucleus distance parameters.'},
				{title:'3D volume segmentation',            body:'Full volumetric cell segmentation for confocal z-stacks and light-sheet acquisitions with object splitting and merging.'},
				{title:'High-content screening',            body:'96-well and 384-well plate batch automation with per-well QC metrics, automatic outlier flagging, and plate-level visualisations.'},
				{title:'Batch throughput at scale',         body:'Process more than 10,000 cells per hour with GPU acceleration. Scales to institutional HPC clusters via distributed batch queues.'},
				{title:'Downstream compatibility',          body:'Output directly to ImageJ ROI Manager, Results table, CSV, HDF5, and CellProfiler-compatible label maps — no format conversion required.'},
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
				{role:'Cell Biology Labs',         img:IMG.labEquipment, desc:'Reduce manual annotation from days to hours for multi-well plate screens. Publish with confidence knowing segmentation accuracy matches peer-reviewed benchmarks.'},
				{role:'Core Imaging Facilities',   img:IMG.microscopeSetup, desc:'Offer AI-assisted segmentation as a facility service. Batch-process client images without disrupting existing ImageJ/Fiji workflows.'},
				{role:'Pharmaceutical CROs',       img:IMG.labSamples, desc:'Scale high-content screening throughput without proportionally scaling headcount. Automated QC flags maintain data integrity across large cohorts.'},
				{role:'Academic Research Groups',  img:IMG.phytoplankton, desc:'Access institutional-grade segmentation accuracy on an NIH R01 budget. No HPC infrastructure required — runs on standard research workstations.'},
			] as uc, i}
				<div class="reveal group rounded-2xl border border-slate-200/60 overflow-hidden bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style="transition-delay:{i*60}ms;">
					<div class="relative h-36 overflow-hidden">
						<img src={uc.img} alt={uc.role} class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" loading="lazy" />
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
