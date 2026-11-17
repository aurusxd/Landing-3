<script lang="ts">
	import { process } from '#lib/data/content.ts';
	import { parallax, reveal } from '#lib/actions.ts';
</script>

<section id="process" class="relative overflow-hidden bg-paper py-24 md:py-36" aria-labelledby="process-title">
	<div class="bg-word top-16 right-0 text-graphite" aria-hidden="true">
		<span class="block" data-word="Процесс" use:parallax={{ x: -6 }}></span>
	</div>

	<div class="container-x relative">
		<div class="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-end" use:reveal>
			<div>
				<p class="eyebrow eyebrow-line text-muted">Как мы работаем</p>
				<h2 id="process-title" class="display mt-6 text-[clamp(2.25rem,4.6vw,3.75rem)]">
					От замера до монтажа <span class="script text-[1.1em] text-wood">за 21 день</span>
				</h2>
			</div>
			<p class="max-w-md text-muted md:justify-self-end">
				Пять понятных этапов, один менеджер на весь проект и фотоотчёты из цеха в Telegram. Сроки и цена фиксируются в договоре.
			</p>
		</div>

		<ol class="relative mt-16 grid gap-10 md:mt-24 md:grid-cols-5 md:gap-6">
			<span class="absolute top-[1.35rem] right-0 left-0 hidden h-px bg-line md:block" aria-hidden="true"></span>
			<span class="absolute top-0 bottom-0 left-[1.35rem] w-px bg-line md:hidden" aria-hidden="true"></span>
			{#each process as p, i}
				<li class="relative grid grid-cols-[2.75rem_1fr] gap-5 md:block" use:reveal={i * 120}>
					<span class="relative z-10 grid size-11 place-items-center rounded-full border border-wood bg-paper font-serif text-lg text-wood-dark">{i + 1}</span>
					<div class="md:mt-8">
						<p class="eyebrow !text-[0.6rem] text-wood-dark">{p.time}</p>
						<h3 class="display mt-2 text-3xl">{p.title}</h3>
						<p class="mt-3 text-sm leading-relaxed text-muted">{p.text}</p>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</section>
