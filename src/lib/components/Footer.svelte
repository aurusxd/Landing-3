<script lang="ts">
	import Logo from './Logo.svelte';
	import Icon from './Icon.svelte';
	import { nav, site } from '#lib/data/content.ts';
</script>

<footer class="relative bg-graphite pt-24 pb-10 text-white">
	<span class="vline absolute top-0 left-1/2 h-16 -translate-y-1/2 bg-white" aria-hidden="true"></span>
	<div class="container-x flex flex-col items-center text-center">
		<a href="/" aria-label="Lignum — на главную" class="transition hover:text-wood-light"><Logo size={34} /></a>
		<p class="mt-6 max-w-sm text-sm text-white/55">{site.tagline}. Собственное производство, замер и монтаж по Москве и области.</p>

		<nav class="mt-12 w-full border-b border-white/10 pb-12" aria-label="Навигация в подвале">
			<ul class="flex flex-wrap justify-center gap-x-9 gap-y-4">
				{#each nav as item (item.href)}
					<li><a href={item.href} class="eyebrow text-white/70 transition hover:text-wood-light">{item.label}</a></li>
				{/each}
			</ul>
		</nav>

		<div class="mt-12 grid w-full gap-8 text-sm text-white/65 md:grid-cols-3">
			<div><p class="eyebrow mb-2 !text-[0.6rem] text-white/60">Телефон</p><a href={site.phoneHref} class="font-serif text-2xl text-white hover:text-wood-light">{site.phone}</a></div>
			<div>
				<p class="eyebrow mb-3 !text-[0.6rem] text-white/60">Мы в соцсетях</p>
				<ul class="flex justify-center gap-3">
					<li><a href={site.socials.telegram} class="grid size-11 place-items-center rounded-full border border-white/20 transition hover:border-wood-light hover:text-wood-light" aria-label="Telegram" target="_blank" rel="noopener"><Icon name="telegram" size={16} /></a></li>
					<li><a href={site.socials.vk} class="grid size-11 place-items-center rounded-full border border-white/20 transition hover:border-wood-light hover:text-wood-light" aria-label="ВКонтакте" target="_blank" rel="noopener"><Icon name="vk" size={16} /></a></li>
					<li><a href={site.socials.whatsapp} class="grid size-11 place-items-center rounded-full border border-white/20 transition hover:border-wood-light hover:text-wood-light" aria-label="WhatsApp" target="_blank" rel="noopener"><Icon name="whatsapp" size={16} /></a></li>
				</ul>
			</div>
			<div><p class="eyebrow mb-2 !text-[0.6rem] text-white/60">Шоурум</p><p>{site.address}<br />{site.hours}</p></div>
		</div>

		<div class="mt-16 flex w-full flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 text-xs text-white/60 sm:flex-row">
			<p>© {new Date().getFullYear()} Lignum. Цены на сайте не являются публичной офертой.</p>
			<a href="/privacy" class="hover:text-white">Политика конфиденциальности</a>
			<a href="#top" class="flex items-center gap-2 hover:text-white" onclick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Наверх <Icon name="arrow-up" size={14} /></a>
		</div>
	</div>
</footer>
