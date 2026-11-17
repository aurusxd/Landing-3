<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import Img from '#lib/components/Img.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { projectStyles, projectTypes } from '#lib/data/content.ts';
	import { configurator } from '#lib/configurator.svelte.ts';
	import { reachGoal } from '#lib/analytics.ts';
	import { reveal } from '#lib/actions.ts';
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const p = $derived(data.project);

	const specs = $derived(
		[
			['Тип', projectTypes[p.type]],
			['Стиль', projectStyles[p.style]],
			['Размеры', p.size],
			['Фасады', p.facade],
			['Столешница', p.countertop],
			['Фурнитура', p.hardware],
			['Срок', p.term],
			['Стоимость', p.price]
		].filter(([, v]) => v && v !== '—')
	);

	const breadcrumbs = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Главная', item: `${PUBLIC_SITE_URL}/` },
				{ '@type': 'ListItem', position: 2, name: 'Портфолио', item: `${PUBLIC_SITE_URL}/#portfolio` },
				{ '@type': 'ListItem', position: 3, name: p.title, item: `${PUBLIC_SITE_URL}/portfolio/${p.slug}` }
			]
		})
	);
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${breadcrumbs}</script>`}
</svelte:head>

<Seo title="{p.title} — проект студии Lignum" description="{p.excerpt} {p.city}, {p.size}. Срок изготовления {p.term}." path="/portfolio/{p.slug}" />

<article>
	<header class="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-graphite text-white">
		<div class="absolute inset-0 -z-10">
			<Img name={p.images[0]} alt={p.title} eager sizes="100vw" class="h-full w-full" />
			<div class="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/65"></div>
		</div>
		<div class="container-x pt-40 pb-14 md:pb-20">
			<a href="/#portfolio" class="eyebrow inline-flex items-center gap-3 text-white/70 hover:text-white"><Icon name="arrow-left" size={14} /> Все проекты</a>
			<p class="eyebrow mt-8 text-wood-light">{projectTypes[p.type]} · {p.city}</p>
			<h1 class="display mt-4 max-w-4xl text-[clamp(2.4rem,6vw,5rem)]">{p.title}</h1>
		</div>
	</header>

	<div class="container-x grid gap-16 py-20 md:py-28 lg:grid-cols-[1.4fr_1fr] lg:gap-24">
		<div use:reveal>
			<p class="eyebrow eyebrow-line text-muted">О проекте</p>
			{#each p.description as para, i}
				<p class="{i === 0 ? 'display mt-7 text-[clamp(1.5rem,2.6vw,2rem)] leading-snug' : 'mt-6 leading-relaxed text-muted'}">{para}</p>
			{/each}
		</div>
		<aside use:reveal={120}>
			<dl class="divide-y divide-line border-y border-line">
				{#each specs as [k, v]}
					<div class="grid grid-cols-[7rem_1fr] gap-4 py-3.5 text-sm">
						<dt class="text-muted">{k}</dt>
						<dd class={k === 'Стоимость' ? 'font-serif text-xl' : ''}>{v}</dd>
					</div>
				{/each}
			</dl>
			<a href="/#configurator" class="btn btn-dark mt-8 w-full" onclick={() => { configurator.apply(p.preset, 1); reachGoal('configurator_open', undefined, { once: true }); }}>Рассчитать похожий проект</a>
		</aside>
	</div>

	<div class="container-x grid gap-6 pb-24 md:grid-cols-[1.5fr_1fr] md:pb-32">
		<div class="frame" use:reveal>
			<Img name={p.images[0]} alt="{p.title}: общий вид" sizes="(min-width: 768px) 60vw, 100vw" class="relative aspect-[4/3]" />
		</div>
		<div use:reveal={150}>
			<Img name={p.images[1]} alt="{p.title}: детали" sizes="(min-width: 768px) 40vw, 100vw" class="aspect-[3/4]" />
		</div>
	</div>

	<nav class="border-t border-line bg-white" aria-label="Другие проекты">
		<div class="container-x grid sm:grid-cols-2">
			<a href="/portfolio/{data.prev.slug}" class="group flex items-center gap-5 py-10 sm:border-r sm:border-line sm:pr-8">
				<span class="grid size-12 shrink-0 place-items-center rounded-full border border-line transition group-hover:border-graphite"><Icon name="arrow-left" size={16} /></span>
				<span><span class="eyebrow block !text-[0.6rem] text-muted">Предыдущий</span><span class="mt-1 block font-serif text-xl">{data.prev.title}</span></span>
			</a>
			<a href="/portfolio/{data.next.slug}" class="group flex items-center justify-end gap-5 border-t border-line py-10 text-right sm:border-t-0 sm:pl-8">
				<span><span class="eyebrow block !text-[0.6rem] text-muted">Следующий</span><span class="mt-1 block font-serif text-xl">{data.next.title}</span></span>
				<span class="grid size-12 shrink-0 place-items-center rounded-full border border-line transition group-hover:border-graphite"><Icon name="arrow" size={16} /></span>
			</a>
		</div>
	</nav>
</article>
