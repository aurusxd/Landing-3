<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import { priceFactors, site } from '#lib/data/content.ts';
	import { reachGoal } from '#lib/analytics.ts';
	import { reveal } from '#lib/actions.ts';
</script>

<section id="prices" class="relative bg-white py-24 md:py-32" aria-labelledby="prices-title">
	<div class="container-x">
		<div class="text-center" use:reveal>
			<p class="eyebrow text-wood-dark">Цены</p>
			<h2 id="prices-title" class="section-title section-title-rule mt-5">Сколько стоит</h2>
		</div>

		<div class="mt-16 grid items-start gap-12 lg:grid-cols-[0.95fr_1.15fr] lg:gap-20">
			<div use:reveal>
				<h3 class="display text-3xl">От чего зависит цена</h3>
				<ol class="mt-8 space-y-6">
					{#each priceFactors as f, i}
						<li class="grid grid-cols-[2rem_1fr] gap-3">
							<span class="font-serif text-xl text-wood-dark">{i + 1}</span>
							<div>
								<p class="font-medium">{f.title}</p>
								<p class="mt-1 text-sm text-muted">{f.text}</p>
							</div>
						</li>
					{/each}
				</ol>
			</div>

			<div class="relative bg-graphite p-7 text-white sm:p-9 md:p-11" use:reveal={120}>
				<span class="script absolute -top-8 right-6 hidden text-4xl text-wood-light lg:block" aria-hidden="true">по вашему проекту</span>
				<p class="eyebrow text-wood-light">Ориентиры</p>

				<ul class="mt-6 divide-y divide-white/15 border-y border-white/15">
					<li class="flex items-end justify-between gap-6 py-5">
						<div>
							<p class="font-serif text-2xl">Кухни</p>
							<p class="mt-1 text-xs text-white/50">за погонный метр, с монтажом</p>
						</div>
						<p class="display shrink-0 text-3xl">от 38 000 ₽</p>
					</li>
					<li class="flex items-end justify-between gap-6 py-5">
						<div>
							<p class="font-serif text-2xl">Шкафы и гардеробные</p>
							<p class="mt-1 text-xs text-white/50">за погонный метр, с монтажом</p>
						</div>
						<p class="display shrink-0 text-3xl">от 28 000 ₽</p>
					</li>
				</ul>

				<p class="mt-6 text-sm leading-relaxed text-white/65">
					Точную стоимость собираем по вашему проекту: размеры, фасады, столешница и фурнитура. Конфигуратор покажет вилку за 2 минуты, а Анна подтвердит расчёт после замера.
				</p>

				<div class="mt-8 flex flex-col gap-3 sm:flex-row">
					<a href="/#configurator" class="btn btn-wood flex-1" onclick={() => reachGoal('configurator_open', undefined, { once: true })}>
						Собрать кухню <Icon name="arrow" size={14} />
					</a>
					<a
						href={site.telegramUrl}
						target="_blank"
						rel="noopener"
						class="btn flex-1 border border-white/40 text-white transition hover:border-white hover:bg-white/10"
						onclick={() => reachGoal('telegram_click', { source: 'prices' })}
					>
						Написать в Telegram
					</a>
				</div>
				<p class="mt-5 text-xs leading-relaxed text-white/50">Расчёт бесплатный. Доставка и монтаж уже входят в цену конфигуратора.</p>
			</div>
		</div>

		<p class="mt-10 text-center text-xs text-muted">
			Цены за погонный метр кухни высотой 2,4 м с нижними и верхними шкафами, без техники. Шкафы — от 28 000 ₽ за погонный метр.
		</p>
	</div>
</section>
