<script lang="ts">
	import { IMG } from '$lib/images';
</script>

<svelte:head>
	<title>About — Yashara Biosciences</title>
	<meta name="description" content="The founding premise behind Yashara Biosciences — precision software infrastructure for life sciences research teams." />
</svelte:head>

<!-- Hero -->
<section class="relative h-[85vh] min-h-[560px] w-full overflow-hidden bg-slate-950">
	<img src={IMG.scientistScope} alt="Researcher at a fluorescence microscope" class="absolute inset-0 h-full w-full object-cover opacity-45" loading="eager" />
	<div class="aurora opacity-20" aria-hidden="true"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/10"></div>
	<div class="container-page relative z-10 flex h-full flex-col justify-end pb-20 md:pb-28">
		<div style="animation: fade-up 0.9s cubic-bezier(0.23,1.01,0.32,1) 0.1s both;">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose/80">About Yashara Biosciences</p>
			<h1 class="mt-4 font-display text-5xl font-normal italic leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl max-w-3xl">
				We build for the laboratory, not the enterprise.
			</h1>
			<p class="mt-5 max-w-xl font-body text-base leading-relaxed text-slate-400">
				Founded on the conviction that biological research deserves software of the same rigour applied to the science itself.
			</p>
		</div>
	</div>
</section>

<!-- Mission -->
<section class="bg-warm-white py-24 md:py-32">
	<div class="container-page">
		<div class="grid gap-16 md:grid-cols-2 md:gap-24 items-center">
			<div class="reveal">
				<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">Our Mission</p>
				<h2 class="mt-4 font-display text-3xl font-normal italic leading-snug text-slate-900 md:text-4xl lg:text-5xl">
					Rigour as a design constraint, not an aspiration.
				</h2>
				<p class="mt-5 font-body text-base leading-relaxed text-slate-500">
					Too many tools in the life sciences ecosystem were designed for generic enterprise markets and subsequently adapted — imperfectly — for laboratory use. The result is software that demands the investigator adapt to its limitations rather than the reverse.
				</p>
				<p class="mt-4 font-body text-sm leading-relaxed text-slate-400">
					At Yashara, we begin with a deep operational understanding of the domain — a cell biology core facility's annotation workflow, a clinical laboratory's CLIA audit trail — and build software that eliminates the friction specific to that work. We do not release a product until its domain experts consider it complete.
				</p>
				<div class="mt-8 flex flex-wrap gap-3">
					<a href="/products" class="btn-primary">Explore our products</a>
					<a href="/research" class="btn-secondary">Our research</a>
				</div>
			</div>
			<div class="reveal space-y-3">
				<div class="overflow-hidden rounded-2xl">
					<img src={IMG.labEquipment} alt="Laboratory equipment and scientific instruments" class="w-full h-64 object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
				</div>
				<div class="grid grid-cols-2 gap-3">
					<div class="overflow-hidden rounded-2xl">
						<img src={IMG.phytoplankton} alt="Microscopic biological organisms" class="w-full h-36 object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
					</div>
					<div class="overflow-hidden rounded-2xl">
						<img src={IMG.cellGrowth} alt="Cell cultures growing in laboratory conditions" class="w-full h-36 object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- How we build -->
<section class="border-t border-slate-200/60 bg-paper py-24 md:py-32">
	<div class="container-page">
		<div class="reveal mb-14 max-w-2xl">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">How We Build</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">Four principles that govern everything we ship.</h2>
		</div>
		<div class="grid gap-4 sm:grid-cols-2">
			{#each [
				{ num: '01', title: 'Domain-native design',        body: 'Every product begins with months of embedded work alongside the scientists and compliance professionals who will use it. We do not design in the abstract.' },
				{ num: '02', title: 'Expert-validated release',    body: 'We do not ship until working domain experts — not internal QA — declare the product complete for their specific workflow. This makes our release cycle slower and our products better.' },
				{ num: '03', title: 'Five-year deployment horizon',body: 'Laboratory infrastructure must be stable. We version every API, deprecate nothing without multi-year advance notice, and design every data model for longevity over convenience.' },
				{ num: '04', title: 'Accessible pricing',          body: 'The NIH R01 budget is our pricing reference point for single-investigator products. Institutional-grade tools at independent-lab cost is not a marketing position — it is an engineering constraint.' },
			] as item, i}
				<div class="reveal flex gap-5 rounded-2xl border border-slate-200/60 bg-white p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style="transition-delay:{i*60}ms;">
					<div class="flex-shrink-0 font-mono text-2xl font-medium text-slate-200 leading-none">{item.num}</div>
					<div>
						<h3 class="font-heading text-sm font-semibold text-slate-900">{item.title}</h3>
						<p class="mt-1.5 font-body text-sm leading-relaxed text-slate-400">{item.body}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Image break -->
<section class="relative h-80 overflow-hidden md:h-[28rem]">
	<img src={IMG.purpleCells} alt="Fluorescence microscopy — the biology at the heart of everything we build" class="absolute inset-0 h-full w-full object-cover" loading="lazy" />
	<div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent"></div>
	<div class="container-page relative z-10 flex h-full items-end pb-12">
		<div class="reveal max-w-2xl">
			<p class="font-display text-2xl font-normal italic text-white md:text-3xl">
				&ldquo;We build fewer things than our competitors, and build each one to a higher standard than they can sustain across a broad portfolio. That is a deliberate strategic choice, not a resource constraint.&rdquo;
			</p>
		</div>
	</div>
</section>

<!-- Commitments -->
<section class="bg-warm-white py-24 md:py-32">
	<div class="container-page">
		<div class="reveal mb-12">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">Our Commitments</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">What we will never compromise on.</h2>
		</div>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each [
				{ title: 'No feature bloat',           body: 'We add capabilities when a working scientist cannot do their job without them. Not because a competitor released it, not because a marketing deck demanded it.' },
				{ title: 'Full audit transparency',    body: 'In regulated environments, the software audit trail is as important as the data. Every action in every Yashara platform is logged, attributable, and exportable.' },
				{ title: 'No vendor lock-in',          body: 'Your data is yours. All platforms export to open formats. We provide documented REST APIs and design no proprietary data silos.' },
				{ title: 'Stability over novelty',     body: 'A laboratory cannot rebuild its analysis pipeline every 18 months. We maintain long-term API stability and version our interfaces explicitly.' },
				{ title: 'No abstraction without cause', body: 'Complexity in scientific software is a liability. Every layer of abstraction must earn its presence by solving a real problem that no simpler design can solve.' },
				{ title: 'Accessible pricing',         body: 'We do not reserve institutional-grade tools for institutions with institutional budgets. The NIH R01 is our pricing ceiling for single-investigator plans.' },
			] as v, i}
				<div class="reveal rounded-2xl border border-slate-200/60 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style="transition-delay:{i*50}ms;">
					<div class="mb-3 h-0.5 w-6 rounded-full bg-crystal-rose"></div>
					<h4 class="font-heading text-sm font-semibold text-slate-900">{v.title}</h4>
					<p class="mt-2 font-body text-sm leading-relaxed text-slate-400">{v.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA -->
<section class="relative overflow-hidden bg-slate-950 py-24 md:py-32">
	<img src={IMG.darkLab} alt="" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover opacity-20" loading="lazy" />
	<div class="aurora opacity-20" aria-hidden="true"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent"></div>
	<div class="container-page relative z-10">
		<div class="reveal grid gap-8 md:grid-cols-3">
			<div class="md:col-span-2">
				<h2 class="font-display text-3xl font-normal italic text-white md:text-4xl">Ready to see the platforms in your context?</h2>
				<p class="mt-4 font-body text-sm leading-relaxed text-slate-400 max-w-lg">Our scientific staff conducts demonstrations tailored to your specific workflow. We want to understand your laboratory before we show you the software.</p>
			</div>
			<div class="flex flex-col justify-center gap-3">
				<a href="/demo"    class="btn-hero-primary text-center">Request a demonstration</a>
				<a href="/careers" class="btn-ghost-dark text-center">We're hiring →</a>
			</div>
		</div>
	</div>
</section>
