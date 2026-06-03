<script lang="ts">
	import { IMG } from '$lib/images';
</script>

<svelte:head>
	<title>ComplianceCall — Yashara Biosciences</title>
	<meta name="description" content="ComplianceCall: comprehensive CLIA compliance management for clinical and research laboratories. 21 integrated modules, live Federal Register integration." />
</svelte:head>

<!-- Hero -->
<section class="relative h-[90vh] min-h-[600px] w-full overflow-hidden bg-slate-950">
	<img src={IMG.complianceDesk} alt="Laboratory compliance documentation and regulatory management" class="absolute inset-0 h-full w-full object-cover opacity-40" loading="eager" />
	<div class="pointer-events-none absolute inset-0" style="background: radial-gradient(ellipse 80% 60% at 15% 80%, rgba(123,143,232,0.15) 0%, transparent 55%)"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/55 to-slate-950/10"></div>
	<div class="container-page relative z-10 flex h-full flex-col justify-end pb-20 md:pb-28">
		<div style="animation: fade-up 0.9s cubic-bezier(0.23,1.01,0.32,1) 0.1s both;">
			<p class="font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em]" style="color:#7b8fe8;">Regulatory Compliance</p>
			<h1 class="mt-3 font-display text-5xl font-normal italic leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl max-w-3xl">
				ComplianceCall
			</h1>
			<p class="mt-5 max-w-xl font-body text-base leading-relaxed text-slate-300 md:text-lg">
				Comprehensive CLIA governance for every tier of laboratory operations — from single-site clinical labs to multi-facility consulting practices. Know before your inspector does.
			</p>
		</div>
		<div class="mt-8 flex flex-wrap gap-4" style="animation: fade-up 0.9s cubic-bezier(0.23,1.01,0.32,1) 0.3s both;">
			<a href="/demo" class="btn-hero-primary">Request Demonstration</a>
			<a href="/compliancecall/pricing" class="btn-hero-secondary">View Pricing</a>
			<a href="#overview" class="btn-ghost-dark">See all 21 modules <span class="text-white/40">↓</span></a>
		</div>
	</div>
</section>

<!-- Overview -->
<section id="overview" class="bg-warm-white py-24 md:py-32">
	<div class="container-page">
		<div class="grid gap-16 md:grid-cols-2 md:gap-24 items-start">
			<div class="reveal">
				<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em]" style="color:#7b8fe8;">Platform Overview</p>
				<h2 class="mt-4 font-display text-3xl font-normal italic leading-snug text-slate-900 md:text-4xl">
					The only CLIA platform that tells you before your inspector does.
				</h2>
				<p class="mt-5 font-body text-base leading-relaxed text-slate-500">
					The platform maintains live connections to the CLIA Federal Register and the FDA CLIA test database. When a new QC requirement is promulgated, ComplianceCall tells you before your next survey does. Your compliance dashboard updates automatically — not at your next review cycle.
				</p>
				<p class="mt-4 font-body text-sm leading-relaxed text-slate-400">
					Technical Consultants overseeing multiple facilities manage all client laboratories from a single organisational account, with configurable access controls, consolidated compliance analytics, and cross-laboratory benchmarking that siloed per-laboratory tools cannot provide.
				</p>
				<div class="mt-8 flex flex-wrap gap-3">
					<a href="/demo" class="btn-primary">Request Demonstration</a>
					<a href="/compliancecall/pricing" class="btn-secondary">View Pricing</a>
				</div>
			</div>
			<!-- Module checklist -->
			<div class="reveal rounded-2xl border border-slate-200/60 overflow-hidden" style="background:#0d1320;">
				<div class="border-b border-white/5 px-6 py-4 flex items-center justify-between">
					<span class="font-mono text-[0.6rem] font-medium uppercase tracking-[0.18em] text-white/30">Compliance Module Coverage</span>
					<span class="rounded-full bg-prismatic-blue/20 px-2.5 py-0.5 font-mono text-[0.55rem] font-semibold text-prismatic-blue">21 modules</span>
				</div>
				<ul class="divide-y divide-white/[0.05]">
					{#each [
						'Personnel Management & Credentialing',
						'Quality Control Management',
						'Document Control & E-Signatures',
						'CLIA Survey & DTag Management',
						'Precision, Accuracy & Linearity Studies',
						'Laboratory Licensing & CMS-116',
						'FDA Database & Federal Register Integration',
						'Mini-LIS: Requisitions & Result Management',
						'Inventory Management & Reorder Automation',
						'Instrument Lifecycle & Calibration Records',
					] as mod}
						<li class="flex items-center gap-3 px-6 py-3">
							<span class="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border text-[9px] font-bold" style="border-color:#7b8fe8; color:#7b8fe8; background:rgba(123,143,232,0.1);">✓</span>
							<span class="font-body text-[0.78rem] text-white/65">{mod}</span>
						</li>
					{/each}
				</ul>
				<div class="border-t border-white/5 px-6 py-3">
					<span class="font-mono text-[0.6rem] text-white/25">+ 11 additional modules — see full documentation</span>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Image break + quote -->
<section class="relative h-64 overflow-hidden md:h-80">
	<img src={IMG.labTeam} alt="Laboratory compliance team reviewing documentation" class="absolute inset-0 h-full w-full object-cover" loading="lazy" />
	<div class="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-slate-950/40"></div>
	<div class="container-page relative z-10 flex h-full items-center">
		<div class="reveal max-w-lg">
			<p class="font-display text-xl font-normal italic text-white md:text-2xl">&ldquo;Our last survey was the first in six years where no documentation deficiencies were cited. The DTag prevention module flagged three issues before the inspector arrived.&rdquo;</p>
			<p class="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-white/40">R. Patel, MT(ASCP) — Technical Consultant, Independent Laboratory Consulting</p>
		</div>
	</div>
</section>

<!-- Capabilities -->
<section class="bg-paper py-24 md:py-32">
	<div class="container-page">
		<div class="reveal mb-12">
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em]" style="color:#7b8fe8;">Key Capabilities</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">Designed for every role in the laboratory compliance hierarchy.</h2>
		</div>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each [
				{title:'DTag prevention engine',       body:'Proactive identification of documentation gaps and process deviations that generate Deficiency Tags before they are cited in a CLIA survey.'},
				{title:'Live Federal Register sync',   body:'Automatic ingestion of CLIA regulatory updates. New requirements appear in your compliance dashboard within 24 hours of Federal Register publication.'},
				{title:'Multi-laboratory management',  body:'Technical Consultants managing multiple facilities see consolidated compliance status, cross-laboratory analytics, and configurable access tiers in a single account.'},
				{title:'E-signature document control', body:'Full document lifecycle management with legally binding e-signatures, complete version history, access logs, and automated retention scheduling.'},
				{title:'QC schedule automation',       body:'Automated QC scheduling based on your test menu, with alerting for missed events and direct integration into the instrument calibration record.'},
				{title:'Survey-ready reporting',       body:'One-click export of all documentation packages required for CLIA survey preparation, organised by standard and condition of participation.'},
			] as feat, i}
				<div class="reveal rounded-2xl border border-slate-200/60 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style="transition-delay:{i*50}ms;">
					<div class="mb-3 h-0.5 w-8 rounded-full" style="background:#7b8fe8;"></div>
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
			<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em]" style="color:#7b8fe8;">Who Uses ComplianceCall</p>
			<h2 class="mt-4 font-display text-3xl font-normal italic text-slate-900 md:text-4xl">Built for every laboratory compliance role.</h2>
		</div>
		<div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
			{#each [
				{role:'Clinical Laboratory Directors', desc:'Maintain a continuously auditable compliance record across all 21 CLIA domains. Eliminate the scramble before surveys.'},
				{role:'Technical Consultants',         desc:'Manage all client laboratories from a single account. Cross-laboratory benchmarking and consolidated analytics no siloed tool can provide.'},
				{role:'Quality Managers',             desc:'Automate QC scheduling, track personnel competency deadlines, and manage document revisions with legally binding e-signatures.'},
				{role:'Laboratory Compliance Officers',desc:'The DTag prevention engine surfaces deficiencies proactively. Know your gaps before the inspector arrives — not after.'},
			] as uc, i}
				<div class="reveal rounded-2xl border border-slate-200/60 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style="transition-delay:{i*60}ms;">
					<div class="mb-3 h-1 w-6 rounded-full" style="background:#7b8fe8;"></div>
					<h3 class="font-heading text-sm font-semibold text-slate-900">{uc.role}</h3>
					<p class="mt-2 font-body text-xs leading-relaxed text-slate-400">{uc.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA -->
<section class="relative overflow-hidden bg-slate-950 py-24 md:py-32">
	<img src={IMG.complianceDesk} alt="" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover opacity-15" loading="lazy" />
	<div class="pointer-events-none absolute inset-0" style="background: radial-gradient(ellipse 70% 60% at 5% 90%, rgba(123,143,232,0.15) 0%, transparent 55%)"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 to-transparent"></div>
	<div class="container-page relative z-10">
		<div class="reveal flex flex-wrap items-center justify-between gap-10">
			<div class="max-w-xl">
				<h2 class="font-display text-3xl font-normal italic text-white md:text-4xl">Speak with a compliance specialist.</h2>
				<p class="mt-4 font-body text-sm leading-relaxed text-slate-400">ComplianceCall demonstrations are conducted by CLIA specialists, not sales staff. We review your current compliance posture before the call so the conversation is immediately relevant to your laboratory.</p>
			</div>
			<div class="flex flex-wrap gap-4">
				<a href="/demo" class="btn-hero-primary">Request Demonstration</a>
				<a href="/compliancecall/pricing" class="btn-hero-secondary">View Pricing</a>
			</div>
		</div>
	</div>
</section>
