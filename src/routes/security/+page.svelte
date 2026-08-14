<svelte:head>
	<title>Security — SymNexus</title>
</svelte:head>

<section class="relative py-20" style="background:#0B1F3A;">
	<div class="absolute bottom-0 left-0 h-1 w-full bg-crimson-500"></div>
	<div class="container-page relative z-10">
		<span class="eyebrow mb-3">Security</span>
		<h1 class="font-display text-3xl font-semibold text-white">Security Policy</h1>
		<p class="mt-3 text-white/50 text-sm">Our commitment to data security across regulated environments.</p>
	</div>
</section>

<section class="bg-surface-100 py-16 lg:py-24">
	<div class="container-page max-w-3xl">
		<div class="space-y-8 text-sm leading-relaxed text-neutral-600">
			{#each [
				{ title: 'Encryption', body: 'Data transmitted between clients and SymNexus platforms is encrypted in transit. Data at rest is encrypted using industry-standard methods, with access to encryption keys restricted to authorized systems.' },
				{ title: 'Access Controls', body: 'SymNexus platforms implement role-based access control (RBAC) with a principle of least privilege. Multi-factor authentication is available on all platforms.' },
				{ title: 'Vulnerability Disclosure', body: 'We take security vulnerability reports seriously. If you believe you have identified a security vulnerability in a SymNexus platform, please contact cell.ai.solutions@gmail.com and we will work with you on responsible disclosure and remediation.' },
				{ title: 'Infrastructure', body: 'SymNexus infrastructure runs on reputable cloud providers, with monitoring in place for our production environments.' },
				{ title: 'Incident Response', body: 'In the event of a security incident affecting customer data, we will notify affected customers promptly and work with you on remediation, consistent with applicable data protection regulations.' },
			] as section}
				<div>
					<h2 class="font-display text-xl font-semibold text-brand-800 mb-3">{section.title}</h2>
					<p>{section.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
