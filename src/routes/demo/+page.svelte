<script lang="ts">
	import { IMG } from '$lib/images';

	let form = $state({
		firstName: '', lastName: '', email: '', phone: '',
		organization: '', role: '', product: '', labType: '', message: '',
	});
	let status = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');

	async function handleSubmit() {
		status = 'submitting';
		await new Promise(r => setTimeout(r, 800));
		status = 'success';
	}

	const steps = [
		{ num: '01', title: 'Submit this form',          body: 'Describe your laboratory type and the workflow you want to evaluate.' },
		{ num: '02', title: 'Qualification call (15 min)',body: 'A member of our scientific team reviews your context and confirms a good fit.' },
		{ num: '03', title: 'Tailored demonstration',    body: 'A domain specialist walks through the platform using your workflow as the basis — not a generic tour.' },
		{ num: '04', title: 'Evaluation access',         body: 'Qualified teams receive full platform access for a structured evaluation period. We support you through it.' },
	];
</script>

<svelte:head>
	<title>Request a Demonstration — Yashara Biosciences</title>
	<meta name="description" content="Request a tailored demonstration of FluorocellAI or ComplianceCall. Conducted by domain specialists, not sales staff." />
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden bg-slate-950 pt-40 pb-20 md:pt-52 md:pb-24">
	<img src={IMG.scientistScope} alt="" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover opacity-20" loading="eager" />
	<div class="aurora opacity-25" aria-hidden="true"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/20"></div>
	<div class="container-page relative z-10">
		<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose/80">Request a Demonstration</p>
		<h1 class="mt-4 font-display text-5xl font-normal italic leading-[1.05] text-white md:text-6xl max-w-2xl">
			See it in the context of your laboratory.
		</h1>
		<p class="mt-5 max-w-lg font-body text-base leading-relaxed text-slate-400">
			Every demonstration is conducted by a domain specialist and built around your workflow — your imaging modality, your cell type, your compliance structure. Not a scripted product walkthrough.
		</p>
	</div>
</section>

<section class="bg-warm-white py-20 md:py-28">
	<div class="container-page">
		<div class="grid gap-16 lg:grid-cols-5 lg:gap-20">

			<!-- Left: process + context -->
			<div class="lg:col-span-2 space-y-10">
				<div class="reveal">
					<h2 class="font-display text-2xl font-normal italic text-slate-900">How it works.</h2>
					<div class="mt-6 space-y-0">
						{#each steps as s, i}
							<div class="flex gap-4 py-5 {i < steps.length - 1 ? 'border-b border-slate-100' : ''}">
								<span class="flex-shrink-0 font-mono text-[0.65rem] font-semibold text-crystal-rose mt-0.5">{s.num}</span>
								<div>
									<p class="font-heading text-sm font-semibold text-slate-900">{s.title}</p>
									<p class="mt-1 font-body text-xs leading-relaxed text-slate-400">{s.body}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<div class="reveal rounded-2xl overflow-hidden">
					<img src={IMG.labEquipment} alt="Laboratory research equipment" class="w-full h-48 object-cover" loading="lazy" />
				</div>

				<div class="reveal rounded-2xl border border-slate-200/60 bg-white p-6">
					<h3 class="font-heading text-xs font-semibold uppercase tracking-[0.1em] text-slate-400 mb-4">Typical evaluation outcomes</h3>
					<ul class="space-y-3">
						{#each [
							'Full segmentation accuracy benchmarks on your own imaging data',
							'Pipeline integration into your existing ImageJ / OMERO environment',
							'A compliance posture gap analysis against current CLIA requirements',
							'Pricing recommendation matched to your laboratory structure',
						] as item}
							<li class="flex items-start gap-2.5 font-body text-xs leading-relaxed text-slate-500">
								<span class="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-crystal-rose"></span>
								{item}
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<!-- Right: form -->
			<div class="lg:col-span-3 reveal">
				{#if status === 'success'}
					<div class="flex flex-col items-center justify-center rounded-2xl border border-slate-200/60 bg-white p-16 text-center min-h-[400px]">
						<div class="mb-4 h-1 w-10 rounded-full bg-crystal-rose mx-auto"></div>
						<h2 class="font-display text-2xl font-normal italic text-slate-900">Thank you.</h2>
						<p class="mt-3 max-w-sm font-body text-sm leading-relaxed text-slate-400">We've received your request. A member of our scientific team will reach out within one business day to schedule your qualification call.</p>
						<a href="/" class="mt-8 btn-secondary">Back to home</a>
					</div>
				{:else}
					<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="rounded-2xl border border-slate-200/60 bg-white p-8 space-y-5">
						<h2 class="font-display text-xl font-normal italic text-slate-900">Tell us about your laboratory.</h2>

						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							{#each [
								{ id:'firstName', label:'First Name',    type:'text',  key:'firstName',    req:true },
								{ id:'lastName',  label:'Last Name',     type:'text',  key:'lastName',     req:true },
								{ id:'email',     label:'Email Address', type:'email', key:'email',        req:true },
								{ id:'phone',     label:'Phone Number',  type:'tel',   key:'phone',        req:false },
								{ id:'org',       label:'Organization',  type:'text',  key:'organization', req:true },
								{ id:'role',      label:'Your Role',     type:'text',  key:'role',         req:false },
							] as f}
								<div>
									<label for={f.id} class="mb-1.5 block font-mono text-[0.6rem] font-medium uppercase tracking-[0.14em] text-slate-400">{f.label}{f.req ? ' *' : ''}</label>
									<input id={f.id} type={f.type} required={f.req} bind:value={form[f.key]}
										class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-body text-sm text-slate-900 placeholder:text-slate-300 transition-colors focus:border-crystal-rose focus:bg-white focus:outline-none focus:ring-1 focus:ring-crystal-rose" />
								</div>
							{/each}
						</div>

						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<label for="product" class="mb-1.5 block font-mono text-[0.6rem] font-medium uppercase tracking-[0.14em] text-slate-400">Product of Interest *</label>
								<select id="product" required bind:value={form.product}
									class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-body text-sm text-slate-900 transition-colors focus:border-crystal-rose focus:bg-white focus:outline-none focus:ring-1 focus:ring-crystal-rose">
									<option value="">Select a product</option>
									<option value="fluorocellai">FluorocellAI</option>
									<option value="compliancecall">ComplianceCall</option>
									<option value="both">Both products</option>
								</select>
							</div>
							<div>
								<label for="labType" class="mb-1.5 block font-mono text-[0.6rem] font-medium uppercase tracking-[0.14em] text-slate-400">Laboratory Type</label>
								<select id="labType" bind:value={form.labType}
									class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-body text-sm text-slate-900 transition-colors focus:border-crystal-rose focus:bg-white focus:outline-none focus:ring-1 focus:ring-crystal-rose">
									<option value="">Select type</option>
									<option value="academic">Academic Research Lab</option>
									<option value="core">Core Imaging / Core Facility</option>
									<option value="clinical">Clinical Laboratory</option>
									<option value="pharma">Pharmaceutical / Biotech</option>
									<option value="cro">Contract Research Organisation</option>
									<option value="consulting">Laboratory Consulting Practice</option>
									<option value="other">Other</option>
								</select>
							</div>
						</div>

						<div>
							<label for="message" class="mb-1.5 block font-mono text-[0.6rem] font-medium uppercase tracking-[0.14em] text-slate-400">Describe your workflow *</label>
							<textarea id="message" required rows="4" bind:value={form.message}
								placeholder="What are you imaging / what compliance challenges are you facing? The more specific, the more useful our demonstration will be."
								class="w-full resize-vertical rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-body text-sm text-slate-900 placeholder:text-slate-300 transition-colors focus:border-crystal-rose focus:bg-white focus:outline-none focus:ring-1 focus:ring-crystal-rose">
							</textarea>
						</div>

						<button type="submit" disabled={status === 'submitting'}
							class="btn-primary w-full justify-center py-3.5 disabled:opacity-50 disabled:cursor-not-allowed">
							{status === 'submitting' ? 'Submitting…' : 'Request Demonstration'}
						</button>

						<p class="font-body text-xs text-center text-slate-300">We respond within one business day. No automated sales sequences.</p>
					</form>
				{/if}
			</div>
		</div>
	</div>
</section>
