<svelte:head>
	<title>Security — Yashara Biosciences</title>
</svelte:head>

<section class="relative py-20" style="background:#0B1F3A;">
	<div class="absolute bottom-0 left-0 h-1 w-full bg-crimson-500"></div>
	<div class="container-page relative z-10">
		<span class="eyebrow mb-3">Security</span>
		<h1 class="font-display text-3xl font-semibold text-white">Security Policy</h1>
		<p class="mt-3 text-white/50 text-sm">Our commitment to data security in laboratory environments.</p>
	</div>
</section>

<section class="bg-surface-100 py-16 lg:py-24">
	<div class="container-page max-w-3xl">
		<div class="space-y-8 text-sm leading-relaxed text-neutral-600">
			{#each [
				{ title: 'Encryption', body: 'All data transmitted between clients and Yashara platforms is encrypted using TLS 1.3. Data at rest is encrypted using AES-256. Encryption keys are managed through a dedicated key management service with rotation schedules aligned to NIST guidelines.' },
				{ title: 'Access Controls', body: 'All Yashara platforms implement role-based access control (RBAC) with principle of least privilege. Multi-factor authentication is available on all platforms and mandatory for administrative accounts.' },
				{ title: 'Vulnerability Disclosure', body: 'We operate a coordinated vulnerability disclosure program. If you believe you have identified a security vulnerability in a Yashara platform, please contact security@yashara.us. We commit to acknowledging disclosure reports within 24 hours and providing a remediation timeline within five business days.' },
				{ title: 'Infrastructure', body: 'Yashara infrastructure is hosted on SOC 2 Type II certified cloud providers. We conduct annual third-party penetration tests and maintain a continuous monitoring program for our production environments.' },
				{ title: 'Incident Response', body: 'In the event of a security incident affecting customer data, we will notify affected customers within 72 hours of confirmed discovery, consistent with applicable data protection regulations.' },
			] as section}
				<div>
					<h2 class="font-display text-xl font-semibold text-brand-800 mb-3">{section.title}</h2>
					<p>{section.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
