<script lang="ts">
	import { page } from '$app/stores';
	import { IMG } from '$lib/images';
</script>

<svelte:head>
	<title>{$page.status} — SymNexus</title>
</svelte:head>

<section class="relative flex h-svh w-full items-center overflow-hidden bg-slate-950">
	<img src={IMG.purpleCells} alt="" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover opacity-15" loading="eager" />
	<div class="aurora opacity-25" aria-hidden="true"></div>
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent"></div>
	<div class="container-page relative z-10">
		<p class="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-crystal-rose/70">Error {$page.status}</p>
		<h1 class="mt-4 font-display text-6xl font-normal italic text-white md:text-8xl opacity-20">{$page.status}</h1>
		<h2 class="mt-2 font-display text-3xl font-normal italic text-white md:text-4xl max-w-lg">
			{$page.status === 404 ? 'This page doesn\'t exist.' : 'Something went wrong.'}
		</h2>
		<p class="mt-4 font-body text-sm leading-relaxed text-slate-400 max-w-md">
			{$page.status === 404
				? 'The page you\'re looking for may have moved or never existed. Let\'s get you back to familiar ground.'
				: 'An unexpected error occurred. Please try again — if the problem persists, contact us at cell.ai.solutions@gmail.com.'}
		</p>
		<div class="mt-8 flex flex-wrap gap-4">
			<a href="/"        class="btn-hero-primary">Back to home</a>
			<a href="/contact" class="btn-ghost-dark">Contact us <span class="text-white/40">→</span></a>
		</div>
	</div>
</section>
