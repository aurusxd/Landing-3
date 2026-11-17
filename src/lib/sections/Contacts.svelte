<script lang="ts">
	import Img from '#lib/components/Img.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { site } from '#lib/data/content.ts';
	import { reachGoal } from '#lib/analytics.ts';
	import { parallax, reveal } from '#lib/actions.ts';
</script>

<section id="contacts" class="relative overflow-hidden bg-paper py-24 md:py-36" aria-labelledby="contacts-title">
	<div class="bg-word top-10 left-1/2 -translate-x-1/2 text-graphite" aria-hidden="true">
		<span class="block" data-word="Контакты" use:parallax={{ x: 5 }}></span>
	</div>

	<div class="container-x relative grid items-start gap-16 lg:grid-cols-2 lg:gap-24">
		<div class="frame frame-left mx-auto hidden w-full max-w-md lg:block" use:reveal>
			<Img name="contacts" alt="Шоурум Lignum с образцами материалов" sizes="40vw" class="relative aspect-[4/5]" />
			<div class="absolute -right-10 bottom-10 bg-graphite p-7 text-white shadow-2xl">
				<p class="eyebrow text-wood-light">Шоурум</p>
				<p class="mt-3 font-serif text-xl">{site.street}</p>
				<p class="mt-1 text-sm text-white/65">{site.hours}</p>
			</div>
		</div>

		<div use:reveal={120}>
			<p class="eyebrow eyebrow-line text-muted">Контакты</p>
			<h2 id="contacts-title" class="display mt-6 text-[clamp(2.25rem,4.6vw,3.75rem)]">
				Обсудим <span class="script text-[1.1em] text-wood">ваш проект</span>
			</h2>
			<p class="mt-5 max-w-md text-muted">
				Напишите Анне в Telegram — она ответит на вопросы, посмотрит планировку и предложит удобное время замера.
			</p>

			<div class="mt-8 border border-line bg-white p-6 sm:p-8">
				<div class="flex items-start gap-4">
					<span class="grid size-12 shrink-0 place-items-center rounded-full bg-graphite text-white">
						<Icon name="telegram" size={20} />
					</span>
					<div class="min-w-0">
						<p class="eyebrow !text-[0.6rem] text-muted">Telegram</p>
						<a
							href={site.telegramUrl}
							target="_blank"
							rel="noopener"
							class="mt-1 block font-serif text-3xl break-words transition hover:text-wood"
						>{site.telegramHandle}</a>
						<p class="mt-1 text-sm text-muted">{site.manager}. Отвечает в рабочее время, обычно в течение 15 минут.</p>
					</div>
				</div>

				<a
					href={site.telegramUrl}
					target="_blank"
					rel="noopener"
					class="btn btn-dark mt-6 w-full"
					onclick={() => reachGoal('telegram_click', { source: 'contacts' })}
				>
					Написать Анне в Telegram <Icon name="arrow" size={14} />
				</a>
				<p class="mt-3 text-center text-xs leading-relaxed text-muted">
					Пришлите план помещения или фото — этого достаточно для первого расчёта.
				</p>
			</div>

			<div class="mt-8 grid gap-6 border-y border-line py-6 sm:grid-cols-2">
				<div>
					<p class="eyebrow !text-[0.6rem] text-muted">Телефон</p>
					<a href={site.phoneHref} class="mt-1 block font-serif text-2xl hover:text-wood" onclick={() => reachGoal('phone_click')}>{site.phone}</a>
				</div>
				<div>
					<p class="eyebrow !text-[0.6rem] text-muted">Почта</p>
					<a href="mailto:{site.email}" class="mt-1 block font-serif text-2xl hover:text-wood">{site.email}</a>
				</div>
				<div class="sm:col-span-2 lg:hidden">
					<p class="eyebrow !text-[0.6rem] text-muted">Шоурум</p>
					<p class="mt-1">{site.address}, {site.hours.toLowerCase()}</p>
				</div>
			</div>

			<p class="mt-5 text-xs leading-relaxed text-muted">
				Сайт не собирает имя, телефон и файлы через формы. Вся переписка — сразу в Telegram, без анкет и звонков без вашего согласия.
			</p>
		</div>
	</div>
</section>
