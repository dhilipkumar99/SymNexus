<svelte:head>
	<title>Products — Yashara Biosciences</title>
	<meta name="description" content="The Yashara Biosciences product suite: FluorocellAI and ComplianceCall." />
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden bg-slate-950 pt-40 pb-28 md:pt-52 md:pb-36">
	<div class="aurora opacity-35" aria-hidden="true"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
	<div class="container-page relative z-10">
		<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose/80">Product Suite</p>
		<h1 class="mt-4 font-display text-5xl font-normal italic leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl max-w-3xl">
			Distinct disciplines.<br />One standard of rigour.
		</h1>
		<p class="mt-5 max-w-xl font-body text-base leading-relaxed text-slate-400 md:text-lg">
			Each platform addresses a distinct domain of laboratory operations — sharing a common design philosophy: exactitude over convenience, transparency over opacity, durability over novelty.
		</p>
	</div>
</section>

<!-- FluorocellAI deep-dive -->
<section class="bg-warm-white py-24 md:py-32">
	<div class="container-page">
		<div class="grid gap-14 md:grid-cols-5 md:gap-20 items-start">
			<div class="reveal md:col-span-3">
				<p class="font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em]" style="color:#40e0d0;">Imaging & Cell Analysis</p>
				<h2 class="mt-3 font-display text-4xl font-normal italic leading-tight text-slate-900 md:text-5xl">FluorocellAI</h2>
				<p class="mt-5 font-body text-sm leading-relaxed text-slate-500 md:text-base">
					High-throughput AI cell labeling and segmentation, integrating natively with ImageJ, Fiji, OMERO, and CellProfiler. Institutional-grade segmentation accuracy — nucleus detection, whole-cell boundary delineation, and multi-channel fluorophore analysis — at a cost accessible to independent research groups.
				</p>
				<p class="mt-4 font-body text-sm leading-relaxed text-slate-400">
					The platform integrates as a native plugin within ImageJ and Fiji, preserving the analytical environment that cell biology laboratories have built over decades. For high-content screening, batch pipelines operate autonomously with automated QC flagging, producing output compatible with KNIME, R, and CellProfiler Analyst without additional format conversion.
				</p>
				<ul class="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
					{#each [
						'Transformer + CNN ensemble segmentation model',
						'DAPI, GFP, RFP, and custom multi-channel support',
						'>10,000 cells/hour batch processing throughput',
						'3D volume segmentation for confocal & light-sheet',
						'ImageJ/Fiji native plugin & OMERO server integration',
						'96-well and 384-well plate batch automation',
						'KNIME, R, and CellProfiler Analyst compatibility',
						'Automated QC flagging on batch runs',
					] as feat}
						<li class="flex items-center gap-2 font-body text-xs text-slate-400">
							<span class="h-1.5 w-1.5 flex-shrink-0 rounded-full" style="background:#40e0d0;"></span>
							{feat}
						</li>
					{/each}
				</ul>
				<div class="mt-8 flex flex-wrap gap-3">
					<a href="/fluorocellai" class="btn-primary">View FluorocellAI</a>
					<a href="/contact"      class="btn-secondary">Request Evaluation</a>
				</div>
			</div>
			<div class="reveal md:col-span-2">
				<div class="rounded-2xl border border-slate-200/60 overflow-hidden bg-white">
					<div class="border-b border-slate-100 px-6 py-4">
						<span class="font-mono text-[0.6rem] font-medium uppercase tracking-[0.18em] text-slate-300">Integrations</span>
					</div>
					<div class="grid grid-cols-2 gap-px bg-slate-100">
						{#each ['ImageJ','Fiji','OMERO','CellProfiler','KNIME','R','HDF5','REST API'] as intg}
							<div class="flex items-center justify-center bg-white px-4 py-5 text-center">
								<span class="font-heading text-[0.78rem] font-semibold text-slate-700">{intg}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Divider -->
<div class="border-t border-slate-200/60"></div>

<!-- ComplianceCall deep-dive -->
<section class="bg-paper py-24 md:py-32">
	<div class="container-page">
		<div class="grid gap-14 md:grid-cols-5 md:gap-20 items-start">
			<div class="reveal md:col-span-3 md:order-2">
				<p class="font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em]" style="color:#7b8fe8;">Regulatory Compliance</p>
				<h2 class="mt-3 font-display text-4xl font-normal italic leading-tight text-slate-900 md:text-5xl">ComplianceCall</h2>
				<p class="mt-5 font-body text-sm leading-relaxed text-slate-500 md:text-base">
					End-to-end CLIA compliance management for clinical and research laboratories. Personnel credentialing, quality control scheduling, document control with e-signatures, instrument lifecycle management, CMS-116 licensing, and real-time CLIA Federal Register integration — unified in a single, continuously auditable platform.
				</p>
				<p class="mt-4 font-body text-sm leading-relaxed text-slate-400">
					The platform maintains live connections to the CLIA Federal Register and the FDA CLIA test database, ensuring that changes to regulatory requirements surface automatically. Technical Consultants overseeing multiple facilities manage all client laboratories from a single account with consolidated compliance analytics.
				</p>
				<ul class="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
					{#each [
						'21 integrated CLIA compliance modules',
						'Live FDA test database & Federal Register',
						'Multi-laboratory consulting company accounts',
						'DTag prevention and CLIA survey preparation',
						'Personnel credentialing & competency tracking',
						'Document control with e-signatures',
						'Instrument lifecycle & calibration management',
						'CMS-116 laboratory licensing workflows',
					] as feat}
						<li class="flex items-center gap-2 font-body text-xs text-slate-400">
							<span class="h-1.5 w-1.5 flex-shrink-0 rounded-full" style="background:#7b8fe8;"></span>
							{feat}
						</li>
					{/each}
				</ul>
				<div class="mt-8 flex flex-wrap gap-3">
					<a href="/compliancecall" class="btn-primary">View ComplianceCall</a>
					<a href="/contact"        class="btn-secondary">Request Demonstration</a>
				</div>
			</div>
			<div class="reveal md:col-span-2 md:order-1">
				<div class="rounded-2xl border border-slate-200/60 overflow-hidden bg-white">
					<div class="border-b border-slate-100 px-6 py-4">
						<span class="font-mono text-[0.6rom] font-medium uppercase tracking-[0.18em] text-slate-300">Integrations</span>
					</div>
					<div class="grid grid-cols-2 gap-px bg-slate-100">
						{#each ['FDA CLIA DB','Federal Register','CMS-116','OSHA HCS','CLIA Online','REST API'] as intg}
							<div class="flex items-center justify-center bg-white px-4 py-5 text-center">
								<span class="font-heading text-[0.75rem] font-semibold text-slate-700">{intg}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- CTA -->
<section class="relative overflow-hidden bg-slate-950 py-24 md:py-32">
	<div class="aurora opacity-25" aria-hidden="true"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent"></div>
	<div class="container-page relative z-10 text-center">
		<div class="reveal">
			<h2 class="font-display text-3xl font-normal italic text-white md:text-4xl">Ready to see these platforms in your laboratory context?</h2>
			<p class="mx-auto mt-4 max-w-md font-body text-sm leading-relaxed text-slate-400">Our scientific staff conducts demonstrations tailored to your specific workflow — not a generic product tour.</p>
			<div class="mt-8 flex flex-wrap justify-center gap-4">
				<a href="/contact" class="btn-hero-primary">Request a Demonstration</a>
			</div>
		</div>
	</div>
</section>
