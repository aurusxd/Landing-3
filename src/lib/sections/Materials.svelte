<script lang="ts">
	import Img from '#lib/components/Img.svelte';
	import { materials } from '#lib/data/content.ts';
	import { reveal } from '#lib/actions.ts';
</script>

<!-- композиция «лесенкой», как Instagram-блок в референсе -->
<section id="materials" class="relative bg-paper py-24 md:py-32" aria-labelledby="materials-title">
	<div class="container-x">
		<div class="text-center" use:reveal>
			<p class="eyebrow text-wood-dark">Материалы и фурнитура</p>
			<h2 id="materials-title" class="section-title section-title-rule mt-5">Из чего мы делаем</h2>
			<p class="mx-auto mt-6 max-w-lg text-muted">Работаем с проверенными поставщиками. Образцы привезём на замер — выбирать удобнее при вашем освещении.</p>
		</div>

		<ul class="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
			{#each materials as m, i}
				<li class="group {i === 1 ? 'md:mt-20' : i === 2 ? 'md:mt-8' : ''}" use:reveal={i * 140}>
					<div class="zoom-img relative">
						<Img name={m.image} alt="Материалы и фурнитура: {m.title.toLowerCase()}" sizes="(min-width: 768px) 33vw, 100vw" class="aspect-square" />
						<div class="absolute inset-0 flex items-end bg-gradient-to-t from-ink/80 via-ink/10 to-transparent p-6 opacity-0 transition duration-500 group-hover:opacity-100">
							<ul class="space-y-1 text-sm text-white">
								{#each m.items as it}<li>{it}</li>{/each}
							</ul>
						</div>
					</div>
					<div class="mt-6 flex items-center justify-between gap-4">
						<h3 class="display text-3xl">{m.title}</h3>
						<div class="flex -space-x-1.5">
							{#each m.swatches as s}
								<span class="size-6 rounded-full border-2 border-paper" style:background={s}></span>
							{/each}
						</div>
					</div>
					<p class="mt-3 text-sm leading-relaxed text-muted">{m.text}</p>
					<ul class="mt-4 space-y-1 text-sm md:hidden">
						{#each m.items as it}<li class="text-ink/80">— {it}</li>{/each}
					</ul>
				</li>
			{/each}
		</ul>
		<p class="mt-12 text-center text-xs text-muted">Названия брендов условные — демонстрационный проект.</p>
	</div>
</section>
