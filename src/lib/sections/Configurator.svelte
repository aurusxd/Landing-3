<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import Preview from '#lib/components/configurator/Preview.svelte';
	import Choice from '#lib/components/Choice.svelte';
	import Range from '#lib/components/Range.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { configurator, STEPS } from '#lib/configurator.svelte.ts';
	import { activeSides, availableOptions, catalogData as D, fmtRub, type SideId } from '#lib/pricing.ts';
	import { reachGoal } from '#lib/analytics.ts';
	import { phoneMask, phoneValid, sendLead } from '#lib/lead.ts';
	import { reveal } from '#lib/actions.ts';

	const c = $derived(configurator.config);
	const step = $derived(configurator.step);
	const price = $derived(configurator.price);
	const shown = Tween.of(() => configurator.price.total, { duration: 700, easing: cubicOut });
	let direction = $state(1);
	let showLines = $state(false);
	let section: HTMLElement;
	let stepsTop: HTMLElement;
	let stepsNav: HTMLOListElement;

	function centerTab() {
		requestAnimationFrame(() => {
			const tab = stepsNav?.querySelector<HTMLElement>('[aria-current="step"]');
			if (!tab) return;
			stepsNav.scrollTo({ left: tab.offsetLeft - (stepsNav.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' });
		});
	}

	function go(to: number) {
		if (to < 0 || to >= STEPS.length) return;
		direction = to > step ? 1 : -1;
		configurator.step = to;
		centerTab();
		reachGoal('configurator_step', { step: to + 1 });
		if (window.innerWidth < 1024) stepsTop?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	onMount(() => {
		configurator.load();
		const io = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) {
					reachGoal('configurator_open', undefined, { once: true });
					io.disconnect();
				}
			},
			{ threshold: 0.25 }
		);
		io.observe(section);
		return () => io.disconnect();
	});

	$effect(() => {
		JSON.stringify(configurator.config);
		configurator.save();
	});

	const fmtPerMeter = (n: number) => `+${new Intl.NumberFormat('ru-RU').format(n)} ₽/м`;
	const pct = (k: number) => (k === 1 ? 'базовая цена' : `+${Math.round((k - 1) * 100)}% к цене`);

	// ---- форма заявки
	let sending = $state(false);
	let sent = $state(false);
	let error = $state('');
	const mountedAt = Date.now();

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		const form = e.currentTarget as HTMLFormElement;
		const fd = new FormData(form);
		error = '';
		if (!String(fd.get('name')).trim()) return (error = 'Как к вам обращаться?');
		if (!phoneValid(String(fd.get('phone')))) return (error = 'Проверьте номер телефона');
		if (!fd.get('consent')) return (error = 'Нужно согласие на обработку данных');
		fd.set('config', JSON.stringify($state.snapshot(configurator.config)));
		fd.set('elapsed', String(Date.now() - mountedAt));
		sending = true;
		const res = await sendLead(fd, 'configurator');
		sending = false;
		if (res.ok) {
			sent = true;
			form.reset();
		} else error = res.error;
	}
</script>

{#snippet layoutIcon(id: string)}
	<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="5" aria-hidden="true">
		{#if id === 'straight'}<path d="M4 8h32" />{:else if id === 'corner'}<path d="M4 6h32M6 6v30" />{:else}<path d="M6 36V6h28v30" />{/if}
	</svg>
{/snippet}

{#snippet kindIcon(id: string)}
	<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
		<rect x="4" y="3" width="32" height="34" />
		{#if id === 'coupe'}<path d="M15 3v34M25 3v34" /><path d="M13 20h4" />
		{:else if id === 'hinged'}<path d="M20 3v34M4 11h32" /><path d="M17 22v5M23 22v5" />
		{:else if id === 'walkin'}<path d="M4 11h32M17 3v34M8 15v12M11 15v10M14 15v12M17 26h19M17 31h19" />
		{:else}<path d="M22 3v34M4 9h32M22 25h14M25 25v12M33 25v12" /><circle cx="26" cy="15" r="1" /><circle cx="32" cy="15" r="1" />{/if}
	</svg>
{/snippet}

<section id="configurator" bind:this={section} class="relative bg-sand py-24 md:py-32" aria-labelledby="cfg-title">
	<div class="container-x">
		<div class="mx-auto max-w-2xl text-center" use:reveal>
			<p class="eyebrow text-wood-dark">Онлайн-конфигуратор</p>
			<h2 id="cfg-title" class="display mt-5 text-[clamp(2.25rem,5vw,4rem)]">
				Соберите мебель <span class="script block text-[1.1em] text-wood sm:inline">за 2 минуты</span>
			</h2>
			<p class="mt-5 text-muted">Цена пересчитывается на каждом шаге. Сохраним выбор и отправим расчёт дизайнеру — он перезвонит и уточнит детали.</p>
		</div>

		<div class="mt-14 grid min-w-0 gap-8 lg:mt-20 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
			<!-- превью и цена -->
			<div class="min-w-0 lg:sticky lg:top-24 lg:self-start">
				<div class="border border-line bg-paper p-4 sm:p-8">
					<div class="flex items-center justify-between gap-4">
						<p class="eyebrow text-muted">Схема · развёртка</p>
						<p class="eyebrow text-wood-dark">{c.product === 'kitchen' ? 'Кухня' : D.products.wardrobe.kinds.find((k) => k.id === c.kind)?.label}</p>
					</div>
					<div class="mt-4 min-w-0 overflow-hidden">
						<Preview config={c} inside={step === 3} />
					</div>
				</div>
				<div class="flex flex-wrap items-end justify-between gap-x-4 gap-y-3 bg-graphite p-5 text-white sm:p-8">
					<div class="min-w-0">
						<p class="eyebrow text-white/60">Ориентировочная стоимость</p>
						<p class="display mt-2 text-[2.6rem] leading-none tabular-nums sm:text-5xl" aria-live="polite">≈ {fmtRub(shown.current)}</p>
						<p class="mt-2 text-xs text-white/55">
							{price.meters.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} пог. м · ≈ {fmtRub(price.total / price.meters)} за метр · с монтажом
						</p>
					</div>
					<button type="button" class="eyebrow shrink-0 text-wood-light underline-offset-4 hover:underline" onclick={() => (showLines = !showLines)} aria-expanded={showLines}>
						{showLines ? 'Скрыть' : 'Из чего цена'}
					</button>
					{#if showLines}
						<dl class="w-full space-y-2 border-t border-white/15 pt-4 text-sm" transition:fade={{ duration: 200 }}>
							{#each price.lines as line}
								<div class="flex justify-between gap-4"><dt class="text-white/70">{line.label}</dt><dd class="tabular-nums">{fmtRub(line.value)}</dd></div>
							{/each}
						</dl>
					{/if}
				</div>
			</div>

			<!-- шаги -->
			<div bind:this={stepsTop} class="min-w-0 scroll-mt-24">
				<ol bind:this={stepsNav} class="no-scrollbar -mx-4 flex max-w-[calc(100%+2rem)] gap-1 overflow-x-auto px-4 sm:mx-0 sm:max-w-full sm:px-0" aria-label="Шаги конфигуратора">
					{#each STEPS as label, i}
						<li class="flex-1">
							<button
								type="button"
								onclick={() => go(i)}
								aria-current={step === i ? 'step' : undefined}
								class="group w-full min-w-[4.5rem] border-t-2 pt-3 text-left transition {i <= step ? 'border-graphite' : 'border-line hover:border-wood-light'}"
							>
								<span class="block font-serif text-lg leading-none {i === step ? 'text-wood-dark' : 'text-muted'}">0{i + 1}</span>
								<span class="eyebrow mt-1.5 block !text-[0.6rem] !tracking-[0.16em] {i === step ? 'text-ink' : 'text-muted'}">{label}</span>
							</button>
						</li>
					{/each}
				</ol>

				<div class="relative mt-10 grid min-h-[420px]">
					{#key step}
						<div class="col-start-1 row-start-1" in:fly={{ x: 40 * direction, duration: 500, delay: 150, easing: cubicOut }} out:fly={{ x: -40 * direction, duration: 250 }}>
							{#if step === 0}
								<h3 class="display text-3xl">Что будем делать?</h3>
								<div class="mt-6 grid grid-cols-2 gap-2 border border-line p-1">
									{#each [['kitchen', 'Кухня'], ['wardrobe', 'Шкаф']] as [id, label]}
										<button type="button" class="eyebrow py-3.5 transition {c.product === id ? 'bg-graphite text-white' : 'hover:bg-white'}" onclick={() => configurator.setProduct(id as 'kitchen' | 'wardrobe')} aria-pressed={c.product === id}>
											{label}
										</button>
									{/each}
								</div>
								<div class="mt-6 grid gap-3" role="radiogroup" aria-label="Тип">
									{#if c.product === 'kitchen'}
										{#each D.products.kitchen.layouts as l (l.id)}
											<Choice selected={c.layout === l.id} onclick={() => (configurator.config.layout = l.id as typeof c.layout)} label={l.label} note={l.note}>
												{#snippet icon()}{@render layoutIcon(l.id)}{/snippet}
											</Choice>
										{/each}
									{:else}
										{#each D.products.wardrobe.kinds as k (k.id)}
											<Choice selected={c.kind === k.id} onclick={() => (configurator.config.kind = k.id as typeof c.kind)} label={k.label} note={k.note} extra="от {new Intl.NumberFormat('ru-RU').format(k.pricePerMeter)} ₽ / пог. м">
												{#snippet icon()}{@render kindIcon(k.id)}{/snippet}
											</Choice>
										{/each}
									{/if}
								</div>
							{:else if step === 1}
								<h3 class="display text-3xl">Размеры</h3>
								<p class="mt-2 text-sm text-muted">Примерные — точные снимет замерщик. {c.product === 'kitchen' && c.layout !== 'straight' ? 'Стороны считаются по стене, угол учтён.' : ''}</p>
								<div class="mt-8 space-y-9">
									{#if c.product === 'kitchen'}
										{#each activeSides(c) as s (s)}
											{@const cfg = D.products.kitchen.sides[s as SideId]}
											<Range label="{cfg.label}, длина" bind:value={configurator.config.sides[s as SideId]} min={cfg.min} max={cfg.max} step={cfg.step} />
										{/each}
										<Range label="Высота до верха шкафов" bind:value={configurator.config.height} min={D.products.kitchen.height.min} max={D.products.kitchen.height.max} step={D.products.kitchen.height.step} />
									{:else}
										<Range label={c.kind === 'walkin' ? 'Длина стен с системой' : 'Ширина'} bind:value={configurator.config.width} min={D.products.wardrobe.width.min} max={D.products.wardrobe.width.max} step={D.products.wardrobe.width.step} />
										<Range label="Высота" bind:value={configurator.config.height} min={D.products.wardrobe.height.min} max={D.products.wardrobe.height.max} step={D.products.wardrobe.height.step} />
										<div>
											<p class="eyebrow text-muted">Глубина</p>
											<div class="mt-3 grid grid-cols-2 gap-2 border border-line p-1">
												{#each [450, 600] as d}
													<button type="button" class="py-3 text-sm transition {c.depth === d ? 'bg-graphite text-white' : 'hover:bg-white'}" onclick={() => (configurator.config.depth = d as 450 | 600)} aria-pressed={c.depth === d}>{d} мм {d === 450 ? '· −8%' : ''}</button>
												{/each}
											</div>
										</div>
									{/if}
								</div>
							{:else if step === 2}
								<h3 class="display text-3xl">Фасады</h3>
								<div class="mt-6 grid gap-3" role="radiogroup" aria-label="Материал фасадов">
									{#each D.facades as f (f.id)}
										<Choice selected={c.facade === f.id} onclick={() => configurator.setFacade(f.id)} label={f.label} note={f.note} extra={pct(f.coef)} />
									{/each}
								</div>
								<p class="eyebrow mt-8 text-muted">Цвет — {D.facades.find((f) => f.id === c.facade)?.colors.find((x) => x.id === c.color)?.label}</p>
								<div class="mt-4 flex flex-wrap gap-3" role="radiogroup" aria-label="Цвет фасадов">
									{#each D.facades.find((f) => f.id === c.facade)?.colors ?? [] as col (col.id)}
										<button
											type="button"
											role="radio"
											aria-checked={c.color === col.id}
											aria-label={col.label}
											title={col.label}
											onclick={() => (configurator.config.color = col.id)}
											class="size-12 rounded-full ring-offset-4 ring-offset-sand transition hover:scale-110 {c.color === col.id ? 'ring-1 ring-graphite' : ''}"
											style:background={col.hex}
											style:box-shadow="inset 0 0 0 1px rgba(0,0,0,.08)"
										></button>
									{/each}
								</div>
							{:else if step === 3}
								{#if c.product === 'kitchen'}
									<h3 class="display text-3xl">Столешница</h3>
									<div class="mt-6 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Столешница">
										{#each D.countertops as t (t.id)}
											<Choice selected={c.countertop === t.id} onclick={() => (configurator.config.countertop = t.id)} label={t.label} note={t.note} extra={fmtPerMeter(t.pricePerMeter)}>
												{#snippet icon()}<span class="block size-9 rounded-full" style:background={t.hex} style:box-shadow="inset 0 0 0 1px rgba(0,0,0,.1)"></span>{/snippet}
											</Choice>
										{/each}
									</div>
								{:else}
									<h3 class="display text-3xl">Наполнение</h3>
									<p class="mt-2 text-sm text-muted">Полки и штанга уже в цене. На схеме — вид без дверей.</p>
									<div class="mt-6 grid gap-3 sm:grid-cols-2">
										{#each D.filling as f (f.id)}
											<Choice multi selected={c.filling.includes(f.id)} onclick={() => configurator.toggle('filling', f.id)} label={f.label} note={f.note} extra="+{new Intl.NumberFormat('ru-RU').format(f.price)} ₽" />
										{/each}
									</div>
								{/if}
								<h3 class="display mt-10 text-3xl">Фурнитура</h3>
								<div class="mt-6 grid gap-3" role="radiogroup" aria-label="Фурнитура">
									{#each D.hardware as h (h.id)}
										<Choice selected={c.hardware === h.id} onclick={() => (configurator.config.hardware = h.id)} label="{h.label} · {h.brand}" note={h.note} extra={pct(h.coef)} />
									{/each}
								</div>
							{:else if step === 4}
								<h3 class="display text-3xl">Дополнительно</h3>
								<div class="mt-6 grid gap-3">
									{#each availableOptions(c) as o (o.id)}
										<Choice multi selected={c.options.includes(o.id)} onclick={() => configurator.toggle('options', o.id)} label={o.label} note={o.note} extra={o.perMeter ? fmtPerMeter(o.perMeter) : `+${new Intl.NumberFormat('ru-RU').format(o.price ?? 0)} ₽`} />
									{/each}
								</div>
								{#if c.product === 'kitchen'}
									<h3 class="display mt-10 text-3xl">Встроенная техника</h3>
									<div class="mt-6 grid gap-3" role="radiogroup" aria-label="Техника">
										{#each D.appliances as a (a.id)}
											<Choice selected={c.appliances === a.id} onclick={() => (configurator.config.appliances = a.id)} label={a.label} note={a.note} extra={a.price ? `+${new Intl.NumberFormat('ru-RU').format(a.price)} ₽` : ''} />
										{/each}
									</div>
								{/if}
							{:else}
								{#if sent}
									<div class="py-10 text-center" in:fade>
										<p class="script text-6xl text-wood">Спасибо!</p>
										<h3 class="display mt-4 text-3xl">Расчёт у дизайнера</h3>
										<p class="mx-auto mt-4 max-w-sm text-muted">Перезвоним в течение 15 минут в рабочее время, уточним детали и предложим удобное время замера.</p>
										<button type="button" class="link-circle mt-10 ml-4" onclick={() => { sent = false; configurator.reset(); }}><span class="dash"></span>Новый расчёт</button>
									</div>
								{:else}
									<h3 class="display text-3xl">Ваша конфигурация</h3>
									<dl class="mt-6 divide-y divide-line border-y border-line">
										{#each configurator.summary as [k, v]}
											<div class="grid grid-cols-[7.5rem_1fr] gap-4 py-3 text-sm sm:grid-cols-[9rem_1fr]">
												<dt class="text-muted">{k}</dt>
												<dd>{v}</dd>
											</div>
										{/each}
									</dl>
									<form class="mt-8" onsubmit={submit} novalidate>
										<p class="text-sm text-muted">Оставьте контакты — пришлём расчёт и перезвоним, чтобы уточнить детали.</p>
										<div class="mt-4 grid gap-2 sm:grid-cols-2 sm:gap-6">
											<label class="block"><span class="sr-only">Имя</span><input name="name" class="field" placeholder="Ваше имя" autocomplete="name" required maxlength="80" /></label>
											<label class="block"><span class="sr-only">Телефон</span><input name="phone" type="tel" class="field" placeholder="+7 (___) ___-__-__" autocomplete="tel" required use:phoneMask /></label>
										</div>
										<!-- honeypot: поле для ботов, людям не видно -->
										<div class="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
											<label>Ваш сайт <input name="website" tabindex="-1" autocomplete="off" /></label>
										</div>
										<label class="mt-5 flex items-start gap-3 text-xs text-muted">
											<input type="checkbox" name="consent" class="mt-0.5 size-4 accent-graphite" />
											<span>Согласен на обработку персональных данных по <a href="/privacy" class="underline underline-offset-2 hover:text-ink">политике конфиденциальности</a></span>
										</label>
										{#if error}<p class="mt-4 text-sm text-[#a5452f]" role="alert">{error}</p>{/if}
										<button type="submit" class="btn btn-dark mt-6 w-full" disabled={sending}>
											{sending ? 'Отправляем…' : `Получить расчёт · ≈ ${fmtRub(price.total)}`}
										</button>
									</form>
								{/if}
							{/if}
						</div>
					{/key}
				</div>

				{#if !(step === STEPS.length - 1 && sent)}
					<div class="mt-10 border-t border-line pt-6">
						<p class="mb-4 flex items-baseline justify-between gap-4 lg:hidden">
							<span class="eyebrow text-muted">Итого</span>
							<span class="display text-2xl tabular-nums">≈ {fmtRub(price.total)}</span>
						</p>
						<div class="flex items-center justify-between">
							<button type="button" class="link-circle ml-4 disabled:opacity-30" onclick={() => go(step - 1)} disabled={step === 0}>
								<Icon name="arrow-left" size={14} /> Назад
							</button>
							{#if step < STEPS.length - 1}
								<button type="button" class="btn btn-dark" onclick={() => go(step + 1)}>
									{step === STEPS.length - 2 ? 'К итогу' : 'Далее'} <Icon name="arrow" size={14} />
								</button>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
