<script lang="ts">
	import { page } from '$app/stores';

	let menuOpen = $state(false);

	const links = [
		{ label: 'About',    href: '/about' },
		{ label: 'Products', href: '/products' },
		{ label: 'Research', href: '/research' },
		{ label: 'Pricing',  href: '/pricing' },
		{ label: 'Careers',  href: '/careers' },
		{ label: 'Contact',  href: '/contact' },
	];
</script>

<!-- Corner wordmark — always visible, minimal -->
<a
	href="/"
	class="fixed left-6 top-6 z-50 flex flex-col leading-none transition-opacity duration-300 hover:opacity-70 md:left-10 md:top-8"
>
	<span class="font-display text-lg font-normal text-white tracking-tight [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">Symnexus</span>
</a>

<!-- Menu trigger -->
<button
	class="fixed right-6 top-6 z-50 flex h-10 w-10 items-center justify-center text-white transition-opacity duration-300 hover:opacity-70 md:right-10 md:top-8"
	onclick={() => (menuOpen = !menuOpen)}
	aria-label="Toggle menu"
	aria-expanded={menuOpen}
>
	<div class="flex w-5 flex-col gap-1.5">
		<span class="block h-px bg-white transition-all duration-300" class:rotate-45={menuOpen} class:translate-y-[7px]={menuOpen}></span>
		<span class="block h-px bg-white transition-all duration-300" class:opacity-0={menuOpen}></span>
		<span class="block h-px bg-white transition-all duration-300" class:-rotate-45={menuOpen} class:-translate-y-[7px]={menuOpen}></span>
	</div>
</button>

<!-- Full-screen nav overlay -->
<div
	class="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-slate-950/98 backdrop-blur-sm transition-opacity duration-500 ease-out"
	class:pointer-events-none={!menuOpen}
	class:opacity-0={!menuOpen}
	aria-hidden={!menuOpen}
>
	{#each links as link, i}
		<a
			href={link.href}
			onclick={() => (menuOpen = false)}
			class="font-display text-3xl font-normal transition-all duration-300 md:text-4xl {$page.url.pathname === link.href ? 'text-signal' : 'text-white/70 hover:text-white'}"
			style="transition-delay: {menuOpen ? i * 40 : 0}ms;"
		>
			{link.label}
		</a>
	{/each}
	<a
		href="/demo"
		onclick={() => (menuOpen = false)}
		class="mt-8 border border-white/25 px-6 py-3 font-heading text-xs font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-200 hover:border-white/50"
	>
		Request a Demonstration
	</a>
</div>
