<script lang="ts">
	import Img from '#lib/components/Img.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { catalog } from '#lib/data/content.ts';
	import { configurator } from '#lib/configurator.svelte.ts';
	import { reachGoal } from '#lib/analytics.ts';
	import { parallax, reveal } from '#lib/actions.ts';

	let track: HTMLUListElement;
	let progress = $state(0);
	let canPrev = $state(false);
	let canNext = $state(true);

	function update() {
		const max = track.scrollWidth - track.clientWidth;
		progress = max > 0 ? track.scrollLeft / max : 1;
		canPrev = track.scrollLeft > 4;
		canNext = track.scrollLeft < max - 4;
	}

	function scrollBy(dir: 1 | -1) {
		const card = track.querySelector('li');
		track.scrollBy({ left: dir * ((card?.clientWidth ?? 300) + 24), behavior: 'smooth' });
	}

	function choose(preset: Record<string, unknown>) {
		configurator.apply(preset, 1);
		reachGoal('configurator_open', undefined, { once: true });
	}
</script>

<section id="catalog" class="relative overflow-hidden bg-graphite py-24 text-white md:py-32" aria-labelledby="catalog-title">
	<div class="bg-word top-8 left-0" aria-hidden="true">
		<span class="block" data-word="Коллекции" use:parallax={{ x: 8 }}></span>
	</div>

	<div class="container-x relative text-center" use:reveal>
		<p class="eyebrow text-wood-light">Каталог направлений</p>
		<h2 id="catalog-title" class="section-title section-title-rule mt-5">Что мы делаем</h2>
		<p class="mx-auto mt-6 max-w-md text-sm text-white/60">
			Выберите направление — конфигуратор откроется с готовыми настройками.
		</p>
	</div>

	<div class="relative mt-14 md:mt-20" use:reveal={150}>
		<ul
			bind:this={track}
			onscroll={update}
			class="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[max(1rem,calc((100vw-1216px)/2))] pb-4"
		>
			{#each catalog as item, i (item.id)}
				<li class="w-[78vw] shrink-0 snap-center sm:w-[46vw] lg:w-[34vw] xl:w-[440px]">
					<a href="/#configurator" class="group block" onclick={() => choose(item.preset)}>
						<div class="zoom-img relative">
							<Img name={item.image} alt="{item.title} на заказ — проект студии Lignum" sizes="(min-width: 1280px) 440px, (min-width: 1024px) 34vw, 78vw" class="aspect-[4/5]" />
							<span class="absolute top-5 left-5 bg-ink/60 px-2 py-1 eyebrow text-white backdrop-blur-[2px]">0{i + 1}</span>
							<span class="absolute right-0 bottom-0 grid size-14 place-items-center bg-graphite text-white transition duration-500 group-hover:bg-wood">
								<Icon name="arrow" size={18} />
							</span>
						</div>
						<h3 class="display mt-6 text-3xl transition group-hover:text-wood-light">{item.title}</h3>
						<p class="mt-2 text-sm text-white/60">{item.note}</p>
						<p class="eyebrow mt-4 text-wood-light">{item.from}</p>
					</a>
				</li>
			{/each}
		</ul>

		<div class="container-x mt-10 flex items-center justify-between gap-6">
			<div class="relative h-px flex-1 max-w-xs bg-white/15">
				<span class="absolute inset-y-0 left-0 w-1/3 bg-white transition-transform duration-300" style:transform="translateX({progress * 200}%)"></span>
			</div>
			<div class="flex gap-2">
				<button class="grid size-12 place-items-center rounded-full border border-white/25 transition hover:border-white disabled:opacity-30" onclick={() => scrollBy(-1)} disabled={!canPrev} aria-label="Предыдущие направления">
					<Icon name="arrow-left" size={18} />
				</button>
				<button class="grid size-12 place-items-center rounded-full border border-white/25 transition hover:border-white disabled:opacity-30" onclick={() => scrollBy(1)} disabled={!canNext} aria-label="Следующие направления">
					<Icon name="arrow" size={18} />
				</button>
			</div>
		</div>
	</div>
</section>
