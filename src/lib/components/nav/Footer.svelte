<script lang="ts">
	const links = [
		{ label: 'About',       href: '/about' },
		{ label: 'Products',    href: '/products' },
		{ label: 'Pricing',     href: '/pricing' },
		{ label: 'Research',    href: '/research' },
		{ label: 'Careers',     href: '/careers' },
		{ label: 'Contact',     href: '/contact' },
	];
	const legal = [
		{ label: 'Privacy',  href: '/privacy' },
		{ label: 'Terms',    href: '/terms' },
		{ label: 'Security', href: '/security' },
	];
</script>

<footer class="relative z-10 flex flex-col items-center gap-4 bg-slate-950 px-6 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
	<div class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
		{#each links as link}
			<a href={link.href} class="font-body text-white/50 transition-colors duration-200 hover:text-white">{link.label}</a>
		{/each}
		<a href="mailto:cell.ai.solutions@gmail.com" class="font-body text-white/50 transition-colors duration-200 hover:text-white">Email</a>
	</div>
	<div class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
		{#each legal as link}
			<a href={link.href} class="font-body text-white/40 transition-colors duration-200 hover:text-white">{link.label}</a>
		{/each}
		<span class="font-body text-white/30">&copy; {new Date().getFullYear()}</span>
	</div>
</footer>
