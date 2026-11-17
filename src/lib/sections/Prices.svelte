<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import { packages, priceFactors } from '#lib/data/content.ts';
	import { configurator } from '#lib/configurator.svelte.ts';
	import { reachGoal } from '#lib/analytics.ts';
	import { reveal } from '#lib/actions.ts';

	const presets = [
		{ facade: 'plastic', countertop: 'hpl', hardware: 'linea', options: [] },
		{ facade: 'enamel', countertop: 'compact', hardware: 'arteo', options: ['softclose'] },
		{ facade: 'veneer', countertop: 'quartz', hardware: 'klarr', options: ['light', 'softclose'] }
	];
</script>

<section id="prices" class="relative bg-white py-24 md:py-32" aria-labelledby="prices-title">
	<div class="container-x">
		<div class="text-center" use:reveal>
			<p class="eyebrow text-wood-dark">Цены</p>
			<h2 id="prices-title" class="section-title section-title-rule mt-5">Сколько стоит</h2>
		</div>

		<div class="mt-16 grid gap-14 lg:grid-cols-[0.8fr_2fr] lg:gap-16">
			<div use:reveal>
				<h3 class="display text-3xl">От чего зависит цена</h3>
				<ol class="mt-8 space-y-6">
					{#each priceFactors as f, i}
						<li class="grid grid-cols-[2rem_1fr] gap-3">
							<span class="font-serif text-xl text-wood">{i + 1}</span>
							<div>
								<p class="font-medium">{f.title}</p>
								<p class="mt-1 text-sm text-muted">{f.text}</p>
							</div>
						</li>
					{/each}
				</ol>
			</div>

			<ul class="grid gap-4 pt-10 md:grid-cols-3">
				{#each packages as p, i}
					<li
						class="relative flex flex-col p-7 transition duration-500 hover:-translate-y-1.5 {p.featured ? 'bg-graphite text-white shadow-[0_30px_60px_-30px_rgba(35,39,42,0.7)]' : 'border border-line bg-paper'}"
						use:reveal={i * 120}
					>
						{#if p.featured}<span class="script absolute -top-9 right-6 hidden text-4xl text-wood-light lg:block">выбор клиентов</span>{/if}
						<p class="eyebrow {p.featured ? 'text-wood-light' : 'text-muted'}">{p.name}</p>
						<p class="display mt-5 text-4xl">{p.price}</p>
						<p class="mt-1 text-xs {p.featured ? 'text-white/60' : 'text-muted'}">{p.unit}</p>
						<ul class="mt-7 flex-1 space-y-3 border-t pt-6 text-sm {p.featured ? 'border-white/15' : 'border-line'}">
							{#each p.items as item}
								<li class="flex gap-3"><Icon name="check" size={16} class="mt-0.5 shrink-0 {p.featured ? 'text-wood-light' : 'text-wood'}" />{item}</li>
							{/each}
						</ul>
						<a href="/#configurator" class="btn mt-8 w-full {p.featured ? 'btn-wood' : 'btn-dark'}" onclick={() => { configurator.apply({ product: 'kitchen', ...presets[i] }, 2); reachGoal('configurator_open', undefined, { once: true }); }}>
							Рассчитать
						</a>
					</li>
				{/each}
			</ul>
		</div>
		<p class="mt-10 text-center text-xs text-muted">Цены за погонный метр кухни высотой 2,4 м с нижними и верхними шкафами, без техники. Шкафы — от 28 000 ₽ за погонный метр.</p>
	</div>
</section>
