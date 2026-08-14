<script lang="ts">
	import { IMG } from '$lib/images';

	const cols = [
		{
			heading: 'Products',
			links: [
				{ label: 'FluorocellAI',        href: '/fluorocellai' },
				{ label: 'ComplianceCall',       href: '/compliancecall' },
				{ label: 'All Products',         href: '/products' },
				{ label: 'Pricing',              href: '/pricing' },
				{ label: 'Request Demo',         href: '/demo' },
			],
		},
		{
			heading: 'Company',
			links: [
				{ label: 'About',                href: '/about' },
				{ label: 'Research',             href: '/research' },
				{ label: 'Careers',              href: '/careers' },
				{ label: 'Contact',              href: '/contact' },
			],
		},
		{
			heading: 'Legal',
			links: [
				{ label: 'Privacy Policy',       href: '/privacy' },
				{ label: 'Terms of Use',         href: '/terms' },
				{ label: 'Security',             href: '/security' },
			],
		},
	];
</script>

<footer class="border-t border-slate-200/60 bg-paper">
	<div class="container-page py-16 md:py-20">
		<div class="grid grid-cols-2 gap-10 md:grid-cols-5">
			<!-- Brand -->
			<div class="col-span-2 md:col-span-2">
				<a href="/" class="flex flex-col leading-none">
					<span class="font-display text-xl font-normal italic text-slate-900">SymNexus</span>
					<span class="font-mono text-[0.48rem] uppercase tracking-[0.3em] text-slate-400 mt-0.5">AI Solutions</span>
				</a>
				<p class="mt-4 max-w-xs font-body text-sm leading-relaxed text-slate-500">
					Domain-native AI systems for regulated industries. Built by Silicon Valley engineers, validated by the scientists and compliance professionals who use it.
				</p>
				<div class="mt-5 space-y-1">
					<a href="mailto:cell.ai.solutions@gmail.com" class="block font-mono text-[0.68rem] text-slate-400 transition-colors hover:text-crystal-rose">cell.ai.solutions@gmail.com</a>
				</div>
				<!-- Mini image strip -->
				<div class="mt-6 grid grid-cols-3 gap-1.5 max-w-[180px]">
					{#each [IMG.fluoroHero, IMG.purpleCells, IMG.labGlassware] as img}
						<div class="overflow-hidden rounded-lg aspect-square">
							<img src="{img}&w=120&q=70" alt="" aria-hidden="true" class="h-full w-full object-cover opacity-60" loading="lazy" />
						</div>
					{/each}
				</div>
			</div>

			<!-- Link cols -->
			{#each cols as col}
				<div>
					<h3 class="font-heading text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-400">{col.heading}</h3>
					<ul class="mt-4 space-y-3">
						{#each col.links as link}
							<li>
								<a href={link.href} class="font-body text-sm text-slate-500 transition-colors hover:text-crystal-rose">{link.label}</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<div class="mt-14 flex flex-col items-start justify-between gap-4 border-t border-slate-200/60 pt-8 sm:flex-row sm:items-center">
			<p class="font-body text-xs text-slate-400">&copy; {new Date().getFullYear()} SymNexus Ltd. All rights reserved.</p>
			<div class="flex gap-6">
				<a href="/privacy"  class="font-body text-xs text-slate-400 transition-colors hover:text-slate-600">Privacy</a>
				<a href="/terms"    class="font-body text-xs text-slate-400 transition-colors hover:text-slate-600">Terms</a>
				<a href="/security" class="font-body text-xs text-slate-400 transition-colors hover:text-slate-600">Security</a>
			</div>
		</div>
	</div>
</footer>
