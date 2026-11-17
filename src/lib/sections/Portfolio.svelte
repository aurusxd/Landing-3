<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade, scale } from 'svelte/transition';
	import Img from '#lib/components/Img.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import projects from '#lib/data/projects.json';
	import { projectStyles, projectTypes } from '#lib/data/content.ts';
	import { reveal } from '#lib/actions.ts';

	let type = $state('all');
	let style = $state('all');

	const list = $derived(projects.filter((p) => (type === 'all' || p.type === type) && (style === 'all' || p.style === style)));
	const types = [['all', 'Все'], ...Object.entries(projectTypes)];
	const styles = [['all', 'Любой стиль'], ...Object.entries(projectStyles)];
</script>

<section id="portfolio" class="relative overflow-hidden bg-white pt-24 md:pt-32" aria-labelledby="portfolio-title">
	<div class="absolute inset-x-0 top-[34rem] bottom-0 bg-sand md:top-[30rem]" aria-hidden="true"></div>

	<div class="container-x relative">
		<div class="text-center" use:reveal>
			<p class="eyebrow text-wood-dark">Портфолио</p>
			<h2 id="portfolio-title" class="section-title section-title-rule mt-5">Наши проекты</h2>
			<p class="mx-auto mt-6 max-w-md text-muted">Реальные размеры, материалы и сроки. Понравился проект — откройте его и рассчитайте похожий.</p>
		</div>

		<div class="mt-10 flex flex-col items-center gap-4" use:reveal={100}>
			<div class="no-scrollbar -mx-4 flex max-w-full gap-2 overflow-x-auto px-4" role="group" aria-label="Фильтр по типу">
				{#each types as [id, label]}
					<button type="button" class="eyebrow shrink-0 border px-4 py-2.5 transition {type === id ? 'border-graphite bg-graphite text-white' : 'border-line hover:border-graphite'}" onclick={() => (type = id)} aria-pressed={type === id}>
						{label}
					</button>
				{/each}
			</div>
			<div class="no-scrollbar -mx-4 flex max-w-full gap-5 overflow-x-auto px-4" role="group" aria-label="Фильтр по стилю">
				{#each styles as [id, label]}
					<button type="button" class="shrink-0 border-b py-1 text-sm transition {style === id ? 'border-wood text-ink' : 'border-transparent text-muted hover:text-ink'}" onclick={() => (style = id)} aria-pressed={style === id}>
						{label}
					</button>
				{/each}
			</div>
		</div>

		<ul class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each list as p (p.slug)}
				<li animate:flip={{ duration: 500 }} in:scale={{ start: 0.96, duration: 400 }} out:fade={{ duration: 150 }}>
					<a href="/portfolio/{p.slug}" class="group flex h-full flex-col bg-white shadow-[0_20px_40px_-30px_rgba(35,39,42,0.35)]">
						<div class="zoom-img relative">
							<Img name={p.images[0]} alt={p.title} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" class="aspect-[4/3]" />
						</div>
						<div class="relative flex flex-1 flex-col p-6 pb-20">
							<p class="eyebrow !text-[0.6rem] text-muted">{projectTypes[p.type]} · {projectStyles[p.style]}</p>
							<h3 class="mt-3 font-serif text-2xl leading-tight transition group-hover:text-wood-dark">{p.title}</h3>
							<p class="mt-3 text-sm text-muted">{p.excerpt}</p>
							<p class="absolute bottom-6 left-6 text-xs text-muted"><span class="mr-2 inline-block h-px w-4 bg-line align-middle"></span>{p.city} · {p.term}</p>
							<span class="absolute right-0 bottom-0 grid size-14 place-items-center bg-graphite text-white transition duration-500 group-hover:bg-wood">
								<Icon name="arrow" size={16} />
							</span>
						</div>
					</a>
				</li>
			{/each}
		</ul>
		{#if list.length === 0}
			<p class="relative py-16 text-center text-muted" in:fade>
				Такого сочетания пока нет в портфолио — но мы его сделаем. <a href="/#configurator" class="text-ink underline underline-offset-4">Рассчитать</a>
			</p>
		{/if}

		<div class="relative flex justify-center py-16 md:py-20">
			<a href="/#configurator" class="btn btn-dark">Рассчитать свой проект</a>
		</div>
	</div>
</section>
