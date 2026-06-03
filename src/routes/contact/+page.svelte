<script lang="ts">
	let form = $state({
		firstName: '', lastName: '', email: '', phone: '',
		organization: '', role: '', product: '', message: '',
	});
	let status = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');
	let errorMsg = $state('');

	async function handleSubmit() {
		status = 'submitting';
		try {
			const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					service_id: 'service_yashara', template_id: 'template_contact',
					user_id: 'public_key', template_params: form,
				}),
			});
			status = res.ok ? 'success' : 'error';
			if (!res.ok) errorMsg = 'Submission failed. Please email info@yashara.us directly.';
		} catch {
			status = 'error';
			errorMsg = 'A network error occurred. Please try again or email info@yashara.us.';
		}
	}
</script>

<svelte:head>
	<title>Contact — Yashara Biosciences</title>
	<meta name="description" content="Contact Yashara Biosciences to request a product demonstration or discuss your laboratory's requirements." />
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden bg-slate-950 pt-40 pb-28 md:pt-52 md:pb-36">
	<div class="aurora opacity-35" aria-hidden="true"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
	<div class="container-page relative z-10">
		<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose/80">Contact</p>
		<h1 class="mt-4 font-display text-5xl font-normal italic leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl max-w-2xl">
			Let's discuss your laboratory's requirements.
		</h1>
		<p class="mt-5 max-w-lg font-body text-base leading-relaxed text-slate-400">
			We provide structured evaluation access for qualified research teams and clinical laboratories. Demonstrations are conducted by domain specialists, not sales staff.
		</p>
	</div>
</section>

<section class="bg-warm-white py-24 md:py-32">
	<div class="container-page">
		<div class="grid gap-16 lg:grid-cols-3 lg:gap-20">

			<!-- Sidebar -->
			<div class="reveal">
				<h2 class="font-heading text-sm font-semibold uppercase tracking-[0.1em] text-slate-400 mb-6">Contact Details</h2>
				<div class="space-y-4">
					<div>
						<p class="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-slate-300 mb-1">Email</p>
						<a href="mailto:info@yashara.us" class="font-body text-sm text-crystal-rose hover:text-crystal-blush transition-colors">info@yashara.us</a>
					</div>
					<div>
						<p class="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-slate-300 mb-1">Phone</p>
						<p class="font-body text-sm text-slate-600">+1 (858) 905-4826</p>
					</div>
				</div>

				<div class="mt-10 rounded-2xl border border-slate-200/60 bg-white p-6">
					<h3 class="font-heading text-xs font-semibold uppercase tracking-[0.1em] text-slate-400 mb-4">What to expect</h3>
					<ul class="space-y-3">
						{#each [
							'Scientific team responds within one business day',
							'Demonstrations by domain specialists, not sales',
							'Every demo tailored to your specific workflow',
							'Evaluation access for qualified research teams',
						] as item}
							<li class="flex items-start gap-2.5">
								<span class="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-crystal-rose"></span>
								<span class="font-body text-xs leading-relaxed text-slate-400">{item}</span>
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<!-- Form -->
			<div class="reveal lg:col-span-2">
				{#if status === 'success'}
					<div class="flex flex-col items-center justify-center rounded-2xl border border-slate-200/60 bg-white p-16 text-center">
						<div class="mb-3 h-1 w-10 rounded-full bg-crystal-rose"></div>
						<h2 class="font-display text-2xl font-normal italic text-slate-900">Thank you.</h2>
						<p class="mt-3 max-w-sm font-body text-sm leading-relaxed text-slate-400">We've received your enquiry and a member of our scientific team will be in touch within one business day.</p>
					</div>
				{:else}
					<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="rounded-2xl border border-slate-200/60 bg-white p-8 space-y-5">
						<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
							{#each [
								{ id: 'firstName',    label: 'First Name',     type: 'text',  key: 'firstName',    req: true },
								{ id: 'lastName',     label: 'Last Name',      type: 'text',  key: 'lastName',     req: true },
								{ id: 'email',        label: 'Email Address',  type: 'email', key: 'email',        req: true },
								{ id: 'phone',        label: 'Phone Number',   type: 'tel',   key: 'phone',        req: false },
								{ id: 'organization', label: 'Organization',   type: 'text',  key: 'organization', req: true },
								{ id: 'role',         label: 'Your Role',      type: 'text',  key: 'role',         req: false },
							] as f}
								<div>
									<label for={f.id} class="mb-1.5 block font-mono text-[0.6rem] font-medium uppercase tracking-[0.14em] text-slate-400">
										{f.label}{f.req ? ' *' : ''}
									</label>
									<input
										id={f.id} type={f.type} required={f.req}
										bind:value={form[f.key]}
										class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-body text-sm text-slate-900 placeholder:text-slate-300 transition-colors focus:border-crystal-rose focus:bg-white focus:outline-none focus:ring-1 focus:ring-crystal-rose"
									/>
								</div>
							{/each}
						</div>

						<div>
							<label for="product" class="mb-1.5 block font-mono text-[0.6rem] font-medium uppercase tracking-[0.14em] text-slate-400">Product of Interest</label>
							<select id="product" bind:value={form.product}
								class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-body text-sm text-slate-900 transition-colors focus:border-crystal-rose focus:bg-white focus:outline-none focus:ring-1 focus:ring-crystal-rose">
								<option value="">Select a product</option>
								<option value="fluorocellai">FluorocellAI</option>
								<option value="compliancecall">ComplianceCall</option>
								<option value="multiple">Both products</option>
							</select>
						</div>

						<div>
							<label for="message" class="mb-1.5 block font-mono text-[0.6rem] font-medium uppercase tracking-[0.14em] text-slate-400">Message *</label>
							<textarea id="message" required rows="5" bind:value={form.message}
								placeholder="Describe your laboratory type, current workflow, and what you'd like to evaluate..."
								class="w-full resize-vertical rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-body text-sm text-slate-900 placeholder:text-slate-300 transition-colors focus:border-crystal-rose focus:bg-white focus:outline-none focus:ring-1 focus:ring-crystal-rose">
							</textarea>
						</div>

						{#if status === 'error'}
							<p class="font-body text-sm text-red-500">{errorMsg}</p>
						{/if}

						<button type="submit" disabled={status === 'submitting'}
							class="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed">
							{status === 'submitting' ? 'Submitting…' : 'Send Enquiry'}
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>
</section>
