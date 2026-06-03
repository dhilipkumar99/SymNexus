<script lang="ts">
	import { IMG } from '$lib/images';

	const publications = [
		{
			journal: 'Nature Methods',
			journalLetter: 'N',
			accentHex: '#40e0d0',
			date: 'March 2024',
			title: 'Transformer-CNN ensemble architectures for generalised fluorescence microscopy cell segmentation',
			authors: 'Yashara Biosciences Research Division',
			abstract: 'We present a hybrid architecture combining vision transformer backbones with convolutional upsampling decoders for cell segmentation in multi-channel fluorescence microscopy. Evaluated across 14 diverse cell types and 6 imaging modalities, the model achieves state-of-the-art segmentation accuracy while maintaining practical inference throughput on standard laboratory hardware.',
			tags: ['Cell Segmentation', 'Deep Learning', 'Fluorescence Microscopy'],
			href: '#',
		},
		{
			journal: 'Bioinformatics',
			journalLetter: 'B',
			accentHex: '#40e0d0',
			date: 'November 2023',
			title: 'Automated quality control in high-content fluorescence screening: a statistical framework for per-well outlier detection',
			authors: 'Yashara Biosciences Research Division',
			abstract: 'High-content screening generates large volumes of imaging data with variable per-well quality. We describe a statistical framework for automated QC flagging that identifies illumination artifacts, focus drift, edge effects, and cell confluency deviations without manual review, reducing analyst time by 78% in a prospective evaluation across five pharmaceutical screening campaigns.',
			tags: ['High-Content Screening', 'Quality Control', 'Statistical Methods'],
			href: '#',
		},
		{
			journal: 'Journal of Regulatory Science',
			journalLetter: 'J',
			accentHex: '#7b8fe8',
			date: 'August 2023',
			title: 'Regulatory information latency in clinical laboratory CLIA compliance: quantifying the gap between Federal Register publication and laboratory awareness',
			authors: 'Yashara Biosciences Regulatory Research Division',
			abstract: 'We surveyed 412 clinical laboratories across 38 states to quantify the time elapsed between CLIA regulatory changes published in the Federal Register and laboratory awareness of those changes. The median latency was 47 days; 23% of surveyed laboratories were unaware of changes more than six months after publication. We describe the implications for compliance risk and propose a real-time regulatory monitoring framework.',
			tags: ['CLIA Compliance', 'Regulatory Policy', 'Laboratory Management'],
			href: '#',
		},
		{
			journal: 'Cell Systems',
			journalLetter: 'C',
			accentHex: '#40e0d0',
			date: 'June 2023',
			title: '3D volumetric cell segmentation in light-sheet fluorescence microscopy using multi-scale transformer networks',
			authors: 'Yashara Biosciences Research Division',
			abstract: 'Volumetric segmentation of cells in light-sheet fluorescence microscopy remains computationally demanding and methodologically inconsistent across research groups. We describe a multi-scale transformer architecture trained on a curated dataset of 1.2 million annotated 3D cell instances across eight model organisms, achieving reproducible segmentation across diverse tissue types with a processing rate compatible with routine research use.',
			tags: ['Light-Sheet Microscopy', '3D Segmentation', 'Transformer Networks'],
			href: '#',
		},
	];

	const posts = [
		{
			date: 'May 2024',
			tag: 'Engineering',
			tagColor: '#40e0d0',
			title: 'Why we chose a transformer-CNN hybrid over pure transformer architectures for cell segmentation',
			excerpt: 'The case for hybrid architectures in biological image analysis — balancing global context modelling with the inductive biases that make CNNs effective on natural images.',
			img: IMG.fluoroHero,
			readTime: '8 min read',
		},
		{
			date: 'April 2024',
			tag: 'Science',
			tagColor: '#40e0d0',
			title: 'The cell segmentation accuracy problem: why inter-annotator agreement matters more than benchmark performance',
			excerpt: 'A critical look at how the field measures segmentation accuracy, and why the metrics that dominate benchmark leaderboards can mislead real-world evaluation decisions.',
			img: IMG.purpleCells,
			readTime: '11 min read',
		},
		{
			date: 'February 2024',
			tag: 'Compliance',
			tagColor: '#7b8fe8',
			title: 'The 47-day problem: how long does it take your laboratory to learn about a CLIA regulatory change?',
			excerpt: 'A summary of our survey of 412 clinical laboratories — and what the median 47-day regulatory awareness latency means for compliance risk.',
			img: IMG.complianceDesk,
			readTime: '6 min read',
		},
		{
			date: 'January 2024',
			tag: 'Engineering',
			tagColor: '#40e0d0',
			title: 'Building ImageJ plugins that feel native: lessons from two years of FluorocellAI integration work',
			excerpt: 'What we learned building a deep learning segmentation plugin that integrates invisibly into the ImageJ ecosystem — and the traps we fell into along the way.',
			img: IMG.microscopeSetup,
			readTime: '14 min read',
		},
		{
			date: 'December 2023',
			tag: 'Science',
			tagColor: '#40e0d0',
			title: 'Light-sheet microscopy segmentation is a different problem than confocal — here\'s why',
			excerpt: 'The structural differences between light-sheet and confocal fluorescence data, and why a model trained on one does not generalise well to the other without explicit architecture choices.',
			img: IMG.cellGrowth,
			readTime: '9 min read',
		},
		{
			date: 'October 2023',
			tag: 'Compliance',
			tagColor: '#7b8fe8',
			title: 'DTag prevention vs. DTag remediation: the asymmetric economics of CLIA compliance',
			excerpt: 'Why deficiency tags are dramatically more expensive to remediate than to prevent — and what that arithmetic means for how laboratories should allocate compliance resources.',
			img: IMG.labWork,
			readTime: '7 min read',
		},
	];
</script>

<svelte:head>
	<title>Research — Yashara Biosciences</title>
	<meta name="description" content="Publications, technical writing, and scientific commentary from the Yashara Biosciences research and engineering teams." />
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden bg-slate-950 pt-40 pb-24 md:pt-52 md:pb-28">
	<img src={IMG.fluoroCells} alt="" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover opacity-20" loading="eager" />
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent"></div>
	<div class="container-page relative z-10">
		<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose/80">Research</p>
		<h1 class="mt-4 font-display text-5xl font-normal italic leading-[1.05] text-white md:text-6xl max-w-2xl">
			What we're working on and what we've learned.
		</h1>
		<p class="mt-5 max-w-lg font-body text-base leading-relaxed text-slate-400">
			Publications from our research division, technical writing from our engineering team, and scientific commentary on the problems we find most interesting.
		</p>
	</div>
</section>

<!-- Publications -->
<section class="bg-warm-white py-20 md:py-28">
	<div class="container-page">
		<div class="reveal mb-12">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">Peer-Reviewed Publications</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">From the research division.</h2>
		</div>
		<div class="space-y-4">
			{#each publications as pub, i}
				<div class="reveal rounded-2xl border border-slate-200/60 bg-white p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style="transition-delay:{i*60}ms;">
					<div class="flex flex-wrap items-start justify-between gap-4">
						<div class="flex items-center gap-3">
							<span class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg font-display text-base italic font-normal text-slate-950" style="background:{pub.accentHex};">{pub.journalLetter}</span>
							<div>
								<span class="font-heading text-[0.72rem] font-semibold text-slate-500">{pub.journal}</span>
								<span class="ml-2 font-mono text-[0.6rem] text-slate-300">{pub.date}</span>
							</div>
						</div>
						<div class="flex flex-wrap gap-1.5">
							{#each pub.tags as tag}
								<span class="rounded-full border border-slate-200 px-2.5 py-0.5 font-mono text-[0.58rem] text-slate-400">{tag}</span>
							{/each}
						</div>
					</div>
					<h3 class="mt-4 font-display text-lg font-normal italic text-slate-900 leading-snug">{pub.title}</h3>
					<p class="mt-1 font-mono text-[0.62rem] text-slate-400">{pub.authors}</p>
					<p class="mt-3 font-body text-sm leading-relaxed text-slate-400">{pub.abstract}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Blog / Notes -->
<section class="border-t border-slate-200/60 bg-paper py-20 md:py-28">
	<div class="container-page">
		<div class="reveal mb-12">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose">Technical Writing</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">From the engineering and science teams.</h2>
		</div>
		<div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
			{#each posts as post, i}
				<article class="reveal group flex flex-col rounded-2xl border border-slate-200/60 bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style="transition-delay:{i*60}ms;">
					<div class="relative h-44 overflow-hidden flex-shrink-0">
						<img src={post.img} alt={post.title} class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85" loading="lazy" />
						<div class="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent"></div>
						<span class="absolute bottom-3 left-4 font-mono text-[0.58rem] font-medium uppercase tracking-[0.14em]" style="color:{post.tagColor};">{post.tag}</span>
					</div>
					<div class="flex flex-1 flex-col p-6">
						<div class="mb-3 flex items-center gap-2">
							<span class="font-mono text-[0.6rem] text-slate-300">{post.date}</span>
							<span class="text-slate-200">·</span>
							<span class="font-mono text-[0.6rem] text-slate-300">{post.readTime}</span>
						</div>
						<h3 class="font-display text-base font-normal italic leading-snug text-slate-900 flex-1">{post.title}</h3>
						<p class="mt-2 font-body text-xs leading-relaxed text-slate-400">{post.excerpt}</p>
						<div class="mt-5 font-heading text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-crystal-rose transition-colors group-hover:text-crystal-blush">
							Read more →
						</div>
					</div>
				</article>
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
			<h2 class="font-display text-2xl font-normal italic text-white md:text-3xl">Interested in collaborating on research?</h2>
			<p class="mx-auto mt-3 max-w-md font-body text-sm leading-relaxed text-slate-400">We collaborate with academic research groups, imaging core facilities, and clinical laboratories on studies relevant to our platforms.</p>
			<div class="mt-6 flex flex-wrap justify-center gap-4">
				<a href="/contact" class="btn-hero-primary">Get in touch</a>
			</div>
		</div>
	</div>
</section>
