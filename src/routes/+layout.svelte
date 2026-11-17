<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { PUBLIC_SITE_URL, PUBLIC_YM_ID } from '$app/env/public';
	import Header from '#lib/components/Header.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import { site } from '#lib/data/content.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// Микроразметка организации (schema.org)
	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FurnitureStore',
		name: 'Lignum',
		description: site.description,
		url: PUBLIC_SITE_URL,
		logo: `${PUBLIC_SITE_URL}/apple-touch-icon.png`,
		image: `${PUBLIC_SITE_URL}/og.jpg`,
		telephone: site.phone,
		email: site.email,
		priceRange: '₽₽',
		address: {
			'@type': 'PostalAddress',
			streetAddress: site.street,
			addressLocality: site.city,
			addressCountry: 'RU'
		},
		openingHoursSpecification: {
			'@type': 'OpeningHoursSpecification',
			dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
			opens: '10:00',
			closes: '20:00'
		},
		areaServed: 'Москва и Московская область',
		sameAs: Object.values(site.socials)
	});

	// Яндекс.Метрика: грузим после загрузки страницы, чтобы не мешать первому экрану
	const ym = Number(PUBLIC_YM_ID);
	let ymReady = false;
	onMount(() => {
		if (!ym) return;
		const init = () => {
			const w = window as unknown as Record<string, any>;
			w.ym =
				w.ym ||
				function (...args: unknown[]) {
					(w.ym.a = w.ym.a || []).push(args);
				};
			w.ym.l = Date.now();
			const s = document.createElement('script');
			s.async = true;
			s.src = 'https://mc.yandex.ru/metrika/tag.js';
			document.head.appendChild(s);
			w.ym(ym, 'init', { ssr: true, webvisor: true, clickmap: true, accurateTrackBounce: true, trackLinks: true, defer: true });
			w.ym(ym, 'hit', location.href, { title: document.title });
			ymReady = true;
		};
		'requestIdleCallback' in window ? requestIdleCallback(init, { timeout: 3000 }) : setTimeout(init, 1500);
	});
	afterNavigate(({ type }) => {
		if (ymReady && type !== 'enter') window.ym?.(ym, 'hit', location.href, { title: document.title });
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
	{#if ym}<link rel="preconnect" href="https://mc.yandex.ru" />{/if}
</svelte:head>

<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-white focus:px-4 focus:py-2">К содержимому</a>
<Header />
<main id="main">
	{@render children()}
</main>
<Footer />
{#if ym}
	<noscript><div><img src="https://mc.yandex.ru/watch/{ym}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
{/if}
