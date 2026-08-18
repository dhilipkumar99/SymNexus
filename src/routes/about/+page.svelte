<script lang="ts">
	import { IMG } from '$lib/images';
</script>

<svelte:head>
	<title>About — SymNexus</title>
	<meta name="description" content="SymNexus builds domain-native AI systems for regulated industries — a team of Silicon Valley engineers proving AI in cell biology and pharmaceutical compliance, and expanding globally." />
</svelte:head>

<!-- Hero -->
<section class="relative h-[85vh] min-h-[560px] w-full overflow-hidden bg-slate-950">
	<img src={IMG.scientistScope} alt="Researcher at a fluorescence microscope" class="absolute inset-0 h-full w-full object-cover opacity-45" loading="eager" />
	<div class="aurora opacity-20" aria-hidden="true"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/10"></div>
	<div class="container-page relative z-10 flex h-full flex-col justify-end pb-20 md:pb-28">
		<div style="animation: fade-up 0.9s cubic-bezier(0.23,1.01,0.32,1) 0.1s both;">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose/80">About SymNexus</p>
			<h1 class="mt-4 font-display text-5xl font-normal italic leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl max-w-3xl">
				The team behind FluorocellAI and ComplianceCall.
			</h1>
			<p class="mt-5 max-w-xl font-body text-base leading-relaxed text-slate-400">
				We're a small team of engineers and researchers building AI software for cell image analysis and pharmaceutical compliance.
			</p>
		</div>
	</div>
</section>

<!-- Mission -->
<section class="bg-warm-white py-24 md:py-32">
	<div class="container-page">
		<div class="grid gap-16 md:grid-cols-2 md:gap-24 items-center">
			<div class="reveal">
				<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">What We Do</p>
				<h2 class="mt-4 font-display text-3xl font-normal italic leading-snug text-slate-900 md:text-4xl lg:text-5xl">
					We build software domain experts actually use.
				</h2>
				<p class="mt-5 font-body text-base leading-relaxed text-slate-500">
					Most AI vendors sell a platform and leave the customer to adapt their workflow to it. That works poorly when precision and accountability matter — which is why we chose to prove our AI models first, and train businesses to manage these systems independently.
				</p>
				<p class="mt-4 font-body text-sm leading-relaxed text-slate-400">
					At SymNexus, we begin with a deep operational understanding of the domain — a cancer-research lab's cell-analysis workflow, a pharmaceutical team's regulatory audit trail — and build software validated by the working scientists and compliance professionals who use it.
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
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">Why Teams Choose Us</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">What makes our software different.</h2>
		</div>
		<div class="grid gap-4 sm:grid-cols-2">
			{#each [
				{ num: '01', title: 'Team expertise',        body: 'Silicon Valley engineers from NXP Semiconductors, Zoom, Amazon, and ServiceNow, plus Berkeley- and Stanford-trained researchers, led by a neuroscience Ph.D. researcher and a Berkeley-trained operator — built for both the hardware/deployment side and the regulated-science domain side of this problem.' },
				{ num: '02', title: 'Unique wedge',    body: 'We build domain-native software, validated by the working scientists and compliance professionals who use it — not generic enterprise AI adapted after the fact for the lab.' },
				{ num: '03', title: 'Proprietary data',body: 'Every deployment adds annotated microscopy data and mapped regulatory precedent across FDA — a compounding dataset a generic AI tool cannot replicate.' },
				{ num: '04', title: 'Flexible architecture',          body: 'One modular AI stack — ingestion, data lake, fine-tuned models, agents, and copilot — powers both products today and lets us add new regulatory jurisdictions or imaging modalities without rebuilding from scratch.' },
				{ num: '05', title: 'Compliance by design', body: 'Full audit-trail transparency is built into every SymNexus platform by design, not bolted on — critical trust infrastructure for customers operating under FDA and other regulatory bodies.' },
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
				&ldquo;Two products in fourteen months, both in production with paying pilot customers. We'd rather ship two things a regulatory auditor can trust than ten things nobody's validated.&rdquo;
			</p>
		</div>
	</div>
</section>

<!-- Team -->
<section class="border-t border-slate-200/60 bg-paper py-24 md:py-32">
	<div class="container-page">
		<div class="reveal mb-14 max-w-2xl">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">Team</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">Leadership</h2>
		</div>
		<div class="reveal grid gap-4 sm:grid-cols-2 mb-4">
			<div class="rounded-2xl border border-slate-200/60 bg-white p-7">
				<h3 class="font-heading text-base font-semibold text-slate-900">Dhilip Raman</h3>
				<p class="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-crystal-rose mt-1">Chief Executive Officer</p>
				<p class="mt-3 font-body text-sm leading-relaxed text-slate-500">Ph.D. student, Neuroscience. Leads operations, contracts, and market entry.</p>
				<p class="mt-3 font-body text-xs leading-relaxed text-slate-400 border-t border-slate-100 pt-3">Previously: Clinical Research Coordinator (Stanford); Clinical Data Manager; Catalent Pharma Solutions.</p>
			</div>
			<div class="rounded-2xl border border-slate-200/60 bg-white p-7">
				<h3 class="font-heading text-base font-semibold text-slate-900">Jacob Matthew Rajesh</h3>
				<p class="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-crystal-rose mt-1">Chief Technical Officer</p>
				<p class="mt-3 font-body text-sm leading-relaxed text-slate-500">Leads technical design and engineering teams.</p>
				<p class="mt-3 font-body text-xs leading-relaxed text-slate-400 border-t border-slate-100 pt-3">Currently: NXP Semiconductor Engineer.</p>
			</div>
		</div>
		<div class="reveal grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each [
				{ name: 'Brent Luker', role: 'Generative AI Software Engineer', note: 'Formerly Zoom' },
				{ name: 'Sameera Velammuri', role: 'AI/ML Software Engineer', note: 'Formerly Amazon' },
				{ name: 'Prabhat Jammalamadaka', role: 'Business Development', note: '' },
				{ name: 'Arshi Saxena', role: 'Product Development & FDE', note: 'Formerly ServiceNow' },
				{ name: 'Rijul Mahajan', role: 'Front-End Software Engineer', note: 'UC Berkeley' },
				{ name: 'Varun Singh', role: 'AI/ML Researcher', note: 'Stanford' },
			] as member}
				<div class="rounded-2xl border border-slate-200/60 bg-white p-6">
					<h4 class="font-heading text-sm font-semibold text-slate-900">{member.name}</h4>
					<p class="mt-1 font-body text-sm text-slate-500">{member.role}</p>
					{#if member.note}
						<p class="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-slate-300">{member.note}</p>
					{/if}
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
				<p class="mt-4 font-body text-sm leading-relaxed text-slate-400 max-w-lg">Our scientific and engineering staff conduct demonstrations tailored to your specific workflow. We want to understand your process before we show you the software.</p>
			</div>
			<div class="flex flex-col justify-center gap-3">
				<a href="/demo"    class="btn-hero-primary text-center">Request a Demonstration</a>
				<a href="/careers" class="btn-ghost-dark text-center">We're hiring →</a>
			</div>
		</div>
	</div>
</section>
