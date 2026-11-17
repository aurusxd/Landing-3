<script lang="ts">
	import { onMount } from 'svelte';
	import Img from '#lib/components/Img.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { site, stats } from '#lib/data/content.ts';
	import { reachGoal } from '#lib/analytics.ts';

	let mounted = $state(false);
	onMount(() => requestAnimationFrame(() => (mounted = true)));
</script>

<section class="relative isolate flex min-h-svh flex-col overflow-hidden bg-graphite text-white" aria-labelledby="hero-title">
	<div class="absolute inset-0 -z-10">
		<Img
			name="hero"
			alt="Кухня на заказ: графитовые фасады, шпон дуба и кварцевая столешница"
			eager
			class="h-full w-full"
			imgClass="transition-transform duration-[2400ms] ease-[var(--ease-expo)] {mounted ? 'scale-100' : 'scale-110'}"
		/>
		<div class="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/35 to-ink/80"></div>
	</div>

	<div class="container-x flex flex-1 flex-col items-center justify-center pt-32 pb-10 text-center">
		<h1 id="hero-title" class="display text-[clamp(2.75rem,8.5vw,7rem)]">
			<span class="block overflow-hidden pb-2">
				<span class="block transition-transform duration-[1400ms] ease-[var(--ease-expo)] {mounted ? 'translate-y-0' : 'translate-y-full'}">
					Кухни и шкафы
				</span>
			</span>
			<span
				class="script mt-2 block text-[1.05em] text-wood-light transition-[opacity,transform] delay-300 duration-[1400ms] ease-[var(--ease-expo)] sm:mt-1 {mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}"
			>
				на заказ
			</span>
		</h1>

		<div>
			<span class="vline mx-auto mt-6 h-px w-14 !bg-wood-light !opacity-80"></span>
			<p class="eyebrow mt-6 text-white/85">Рассчитайте цену за 2 минуты</p>

			<a href="/#configurator" class="group mt-9 inline-flex flex-col items-center gap-4" aria-label="Открыть конфигуратор и рассчитать стоимость" onclick={() => reachGoal('configurator_open', undefined, { once: true })}>
				<span class="relative grid size-20 place-items-center rounded-full border border-white/50 transition duration-700 group-hover:scale-110 group-hover:border-wood-light group-hover:bg-wood/30">
					<Icon name="arrow" size={22} class="rotate-90 transition duration-700 group-hover:translate-y-0.5" />
					<span class="absolute inset-0 animate-ping rounded-full border border-white/20 [animation-duration:2.8s]"></span>
				</span>
				<span class="eyebrow">Рассчитать стоимость</span>
			</a>
		</div>
	</div>

	<!-- нижняя полоса: цифры, линия, соцсети -->
	<div class="container-x relative pb-8 transition-opacity delay-1000 duration-1000 {mounted ? 'opacity-100' : 'opacity-0'}">
		<div class="grid grid-cols-3 gap-4 border-t border-white/15 pt-6 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
			<dl class="col-span-3 grid grid-cols-3 gap-4 lg:col-span-1 lg:flex lg:gap-10">
				{#each stats as s}
					<div>
						<dt class="sr-only">{s.label}</dt>
						<dd>
							<span class="display text-3xl sm:text-4xl">{s.value}</span>
							<span class="script ml-1 text-xl text-wood-light sm:text-2xl">{s.unit}</span>
							<span class="mt-1 block text-[0.7rem] leading-snug tracking-wide text-white/65 uppercase">{s.label}</span>
						</dd>
					</div>
				{/each}
			</dl>

			<a href="#about" class="hidden flex-col items-center gap-3 lg:flex" aria-label="Листать вниз">
				<span class="vline h-14 animate-pulse"></span>
				<span class="eyebrow text-white/70">Листайте вниз</span>
			</a>

			<ul class="hidden justify-end gap-3 lg:flex">
				<li><a href={site.socials.telegram} class="grid size-9 place-items-center rounded-full border border-white/25 transition hover:border-wood-light hover:text-wood-light" aria-label="Telegram" target="_blank" rel="noopener"><Icon name="telegram" size={15} /></a></li>
				<li><a href={site.socials.vk} class="grid size-9 place-items-center rounded-full border border-white/25 transition hover:border-wood-light hover:text-wood-light" aria-label="ВКонтакте" target="_blank" rel="noopener"><Icon name="vk" size={15} /></a></li>
				<li><a href={site.socials.whatsapp} class="grid size-9 place-items-center rounded-full border border-white/25 transition hover:border-wood-light hover:text-wood-light" aria-label="WhatsApp" target="_blank" rel="noopener"><Icon name="whatsapp" size={15} /></a></li>
			</ul>
		</div>
	</div>
</section>
