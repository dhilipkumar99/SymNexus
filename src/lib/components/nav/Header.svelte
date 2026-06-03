<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let mobileOpen = $state(false);
	let scrollY = $state(0);
	// Nav becomes opaque-ish when scrolled past the hero
	let pastHero = $derived(scrollY > 80);

	const links = [
		{ label: 'About',          href: '/about' },
		{ label: 'Products',       href: '/products' },
		{ label: 'Research',       href: '/research' },
		{ label: 'Pricing',        href: '/pricing' },
		{ label: 'Careers',        href: '/careers' },
		{ label: 'Contact',        href: '/contact' },
	];
</script>

<svelte:window bind:scrollY />

<nav class="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 md:px-[max(3rem,calc((100vw-72rem)/2+1.5rem))] transition-all duration-300">
	<!-- gradient scrim so nav is readable over hero -->
	<div
		class="pointer-events-none absolute inset-0 transition-opacity duration-500"
		style:opacity={pastHero ? '0' : '1'}
		style="background: linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)"
	></div>

	<!-- Logo -->
	<a href="/" class="relative z-10 flex flex-col leading-none transition-colors duration-300 hover:text-crystal-rose">
		<span class="font-display text-2xl font-normal italic text-white tracking-tight">Yashara</span>
		<span class="font-mono text-[0.5rem] font-medium uppercase tracking-[0.3em] text-white/40 mt-0.5">Biosciences</span>
	</a>

	<!-- Desktop pill nav -->
	<div class="nav-pill relative z-10 hidden md:flex">
		{#each links as link}
			<a
				href={link.href}
				class="nav-link {$page.url.pathname === link.href ? 'nav-link-active' : ''}"
			>
				{link.label}
			</a>
		{/each}
	</div>

	<!-- Mobile hamburger -->
	<button
		class="relative z-10 rounded-full border border-white/10 bg-slate-900/30 p-2.5 backdrop-blur-xl md:hidden"
		onclick={() => (mobileOpen = !mobileOpen)}
		aria-label="Toggle menu"
	>
		<div class="flex w-4 flex-col gap-1">
			<span class="block h-0.5 rounded-full bg-white transition-all duration-300" class:rotate-45={mobileOpen} class:translate-y-1.5={mobileOpen}></span>
			<span class="block h-0.5 rounded-full bg-white transition-all duration-300" class:opacity-0={mobileOpen}></span>
			<span class="block h-0.5 rounded-full bg-white transition-all duration-300" class:-rotate-45={mobileOpen} class:-translate-y-1.5={mobileOpen}></span>
		</div>
	</button>
</nav>

<!-- Mobile drawer -->
{#if mobileOpen}
	<div class="fixed inset-0 z-40 flex flex-col bg-slate-950/95 px-6 pt-24 pb-10 backdrop-blur-xl md:hidden">
		<ul class="flex flex-col gap-2">
			{#each links as link}
				<li>
					<a
						href={link.href}
						onclick={() => (mobileOpen = false)}
						class="block rounded-xl px-4 py-3.5 font-heading text-sm font-medium uppercase tracking-[0.08em] text-white/70 transition-colors hover:bg-white/5 hover:text-white"
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
	</div>
{/if}
