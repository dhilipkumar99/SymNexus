<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/nav/Header.svelte';
	import Footer from '$lib/components/nav/Footer.svelte';
	import { afterNavigate } from '$app/navigation';

	afterNavigate(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) {
						(e.target as HTMLElement).classList.add('visible');
						observer.unobserve(e.target);
					}
				});
			},
			{ threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
		);
		document.querySelectorAll('.reveal:not(.visible)').forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	});
</script>

<div class="flex min-h-screen flex-col">
	<Header />
	<main class="flex-1">
		<slot />
	</main>
	<Footer />
</div>
