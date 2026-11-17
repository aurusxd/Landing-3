<script lang="ts">
	import { slide } from 'svelte/transition';
	import Icon from '#lib/components/Icon.svelte';
	import { faq, site } from '#lib/data/content.ts';
	import { reachGoal } from '#lib/analytics.ts';
	import { reveal } from '#lib/actions.ts';

	let open = $state<number | null>(0);

	// Микроразметка FAQ — помогает попасть в расширенные сниппеты Яндекса и Google
	const faqLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faq.map((item) => ({
			'@type': 'Question',
			name: item.q,
			acceptedAnswer: { '@type': 'Answer', text: item.a }
		}))
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${faqLd}</script>`}
</svelte:head>

<section id="faq" class="relative bg-white py-24 md:py-32" aria-labelledby="faq-title">
	<div class="container-x grid gap-14 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
		<div use:reveal>
			<p class="eyebrow eyebrow-line text-muted">FAQ</p>
			<h2 id="faq-title" class="display mt-6 text-[clamp(2.25rem,4.6vw,3.75rem)]">Частые вопросы</h2>
			<p class="script mt-10 text-4xl text-wood">Не нашли ответ?</p>
			<p class="mt-3 max-w-xs text-sm text-muted">Позвоните или напишите Анне — она ответит в течение 15 минут.</p>
			<a href={site.phoneHref} class="display mt-6 block text-3xl transition hover:text-wood">{site.phone}</a>
			<a href={site.socials.telegram} class="link-circle mt-6 ml-4" target="_blank" rel="noopener" onclick={() => reachGoal('telegram_click', { source: 'faq' })}><span class="dash"></span>Написать Анне в Telegram</a>
		</div>

		<dl class="border-t border-line" use:reveal={120}>
			{#each faq as item, i}
				<div class="border-b border-line">
					<dt>
						<button
							type="button"
							class="group flex w-full items-center justify-between gap-6 py-6 text-left"
							aria-expanded={open === i}
							aria-controls="faq-{i}"
							onclick={() => (open = open === i ? null : i)}
						>
							<span class="font-serif text-xl leading-snug transition group-hover:text-wood-dark sm:text-2xl">{item.q}</span>
							<span class="grid size-10 shrink-0 place-items-center rounded-full border border-line transition duration-500 {open === i ? 'rotate-45 border-graphite bg-graphite text-white' : 'group-hover:border-graphite'}">
								<Icon name="plus" size={16} />
							</span>
						</button>
					</dt>
					{#if open === i}
						<dd id="faq-{i}" class="max-w-2xl pb-7 pr-14 text-[0.95rem] leading-relaxed text-muted" transition:slide={{ duration: 400 }}>
							{item.a}
						</dd>
					{/if}
				</div>
			{/each}
		</dl>
	</div>
</section>
