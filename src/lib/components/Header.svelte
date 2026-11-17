<script lang="ts">
	import { page } from '$app/state';
	import { tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { nav, site } from '#lib/data/content.ts';
	import { reachGoal } from '#lib/analytics.ts';
	import Logo from './Logo.svelte';
	import Icon from './Icon.svelte';

	let scrolled = $state(false);
	let open = $state(false);
	let menuEl = $state<HTMLElement>();
	let burger = $state<HTMLButtonElement>();
	let lastFocused: HTMLElement | null = null;

	// Шапка прозрачная поверх тёмных обложек (главная и страницы проектов)
	const darkCover = $derived(page.route.id === '/' || page.route.id === '/portfolio/[slug]');
	const overlay = $derived(darkCover && !scrolled && !open);
	const left = nav.slice(0, 4);
	const right = nav.slice(4);

	$effect(() => {
		const onScroll = () => (scrolled = window.scrollY > 40);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	$effect(() => {
		document.documentElement.style.overflow = open ? 'hidden' : '';
	});

	// фокус внутри мобильного меню: открыли — на первую ссылку, закрыли — обратно на кнопку
	$effect(() => {
		if (open) {
			lastFocused = document.activeElement as HTMLElement | null;
			tick().then(() => menuEl?.querySelector<HTMLElement>('a[href], button:not([disabled])')?.focus());
		} else if (lastFocused) {
			(lastFocused.isConnected ? lastFocused : burger)?.focus();
			lastFocused = null;
		}
	});

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false;
		if (e.key !== 'Tab' || !open || !menuEl) return;
		const items = [...menuEl.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
		if (!items.length) return;
		const first = items[0];
		const last = items[items.length - 1];
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	}

	$effect(() => {
		page.url.pathname;
		open = false;
	});
</script>

<svelte:window onkeydown={onKeydown} />

<header
	class="fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow,padding] duration-500"
	class:text-white={overlay || open}
	class:bg-paper={!overlay && !open}
	class:shadow-[0_1px_0_rgba(0,0,0,0.06)]={!overlay && !open}
	class:py-4={overlay}
	class:py-2.5={!overlay}
>
	<div class="container-x relative grid grid-cols-[1fr_auto_1fr] items-center gap-4">
		<!-- слева: бургер (до xl) / первая половина меню -->
		<div class="flex items-center">
			<button
				bind:this={burger}
				class="group flex items-center gap-3 xl:hidden"
				aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
				aria-expanded={open}
				onclick={() => (open = !open)}
			>
				<span class="grid size-10 place-items-center rounded-full border border-current/30 transition group-hover:border-current">
					<Icon name={open ? 'close' : 'menu'} size={16} />
				</span>
				<span class="eyebrow hidden sm:inline">{open ? 'Закрыть' : 'Меню'}</span>
			</button>
			<nav class="hidden xl:block" aria-label="Основная навигация">
				<ul class="flex gap-7">
					{#each left as item (item.href)}
						<li><a href={item.href} class="eyebrow opacity-80 transition hover:text-wood hover:opacity-100">{item.label}</a></li>
					{/each}
				</ul>
			</nav>
		</div>

		<a href="/" class="transition hover:text-wood" aria-label="Lignum — на главную">
			<Logo size={overlay ? 28 : 22} withName={overlay} />
		</a>

		<div class="flex items-center justify-end gap-5 xl:gap-7">
			<nav class="hidden xl:block" aria-label="Дополнительная навигация">
				<ul class="flex gap-7">
					{#each right as item (item.href)}
						<li><a href={item.href} class="eyebrow opacity-80 transition hover:text-wood hover:opacity-100">{item.label}</a></li>
					{/each}
				</ul>
			</nav>
			<a
				href={site.socials.telegram}
				target="_blank"
				rel="noopener"
				class="grid size-10 place-items-center rounded-full border border-current/30 transition hover:border-current xl:hidden"
				aria-label="Написать в Telegram {site.telegramHandle}"
				onclick={() => reachGoal('telegram_click', { source: 'header' })}
			>
				<Icon name="telegram" size={16} />
			</a>
			<a href="/#configurator" class="btn btn-wood hidden !min-h-0 !px-5 !py-3 sm:inline-flex" onclick={() => reachGoal('configurator_open', undefined, { once: true })}>Рассчитать кухню</a>
		</div>
	</div>
</header>

{#if open}
	<div
		bind:this={menuEl}
		class="fixed inset-0 z-40 overflow-y-auto bg-graphite text-white"
		transition:fade={{ duration: 300 }}
		role="dialog"
		aria-modal="true"
		aria-label="Меню"
	>
		<div class="container-x flex min-h-full flex-col pt-28 pb-10">
			<nav aria-label="Мобильная навигация">
				<ul class="space-y-1">
					{#each nav as item, i (item.href)}
						<li in:fly={{ y: 24, delay: 60 + i * 45, duration: 600 }}>
							<a href={item.href} class="display block py-1.5 text-[2.4rem] transition hover:text-wood-light sm:text-5xl" onclick={() => (open = false)}>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
			<div class="mt-auto pt-12 text-white/70" in:fade={{ delay: 400 }}>
				<a href={site.phoneHref} class="display block text-3xl text-white">{site.phone}</a>
				<p class="mt-2 text-sm">{site.address} · {site.hours}</p>
				<a
					href={site.socials.telegram}
					target="_blank"
					rel="noopener"
					class="mt-4 inline-flex items-center gap-2 text-sm text-wood-light"
					onclick={() => reachGoal('telegram_click', { source: 'menu' })}
				>
					<Icon name="telegram" size={16} /> {site.telegramHandle}
				</a>
				<a href="/#configurator" class="btn btn-wood mt-8 w-full sm:w-auto" onclick={() => { open = false; reachGoal('configurator_open', undefined, { once: true }); }}>Рассчитать кухню</a>
			</div>
		</div>
	</div>
{/if}
