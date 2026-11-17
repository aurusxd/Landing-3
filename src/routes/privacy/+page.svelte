<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import { site } from '#lib/data/content.ts';
</script>

<Seo title="Политика конфиденциальности — Lignum" description="Как сайт Lignum относится к данным: без форм заявок, только обезличенная статистика и связь в Telegram." path="/privacy" />

<article class="bg-paper pt-36 pb-24 md:pt-44">
	<div class="container-x max-w-3xl">
		<p class="eyebrow eyebrow-line text-muted">Документы</p>
		<h1 class="display mt-6 text-[clamp(2.2rem,5vw,3.5rem)]">Политика конфиденциальности</h1>
		<p class="mt-4 text-sm text-muted">Редакция от 17 ноября 2026 года</p>

		<div class="prose-policy mt-12 space-y-10 leading-relaxed">
			<section>
				<h2>1. Коротко</h2>
				<p>На сайте студии {site.name} нет форм заявки и личного кабинета. Мы не собираем через сайт имя, телефон, комментарии и файлы — связаться можно по телефону, почте или в Telegram.</p>
				<p>Сайт использует обезличенную статистику Яндекс.Метрики, чтобы понимать, какие разделы полезны. Данные не продаются и не передаются для рекламы.</p>
			</section>

			<section>
				<h2>2. Какие данные обрабатываются</h2>
				<ul>
					<li>обезличенные технические данные: cookie, IP-адрес, тип браузера и устройства, просмотренные страницы;</li>
					<li>действия на сайте: открытие конфигуратора, переходы по шагам, клики по кнопкам — в виде событий Метрики;</li>
					<li>если вы сами напишете в Telegram — ваше сообщение и контакт в мессенджере. Эта переписка регулируется правилами Telegram и хранится в мессенджере.</li>
				</ul>
			</section>

			<section>
				<h2>3. Зачем это нужно</h2>
				<ul>
					<li>понимать, какими разделами пользуются, и улучшать сайт;</li>
					<li>отвечать на вопросы, которые вы задаёте добровольно в Telegram или по почте.</li>
				</ul>
				<p>Мы не используем данные для автоматических рассылок и не принимаем решений, влияющих на права пользователя, на основании статистики.</p>
			</section>

			<section>
				<h2>4. Cookie и Яндекс.Метрика</h2>
				<p>Счётчик Яндекс.Метрики устанавливает cookie и собирает обезличенную статистику. Вы можете отключить cookie в настройках браузера — сайт продолжит работать, но часть статистики не соберётся.</p>
				<p>Подробнее об обработке данных Яндексом — в документах ООО «Яндекс».</p>
			</section>

			<section>
				<h2>5. Передача третьим лицам</h2>
				<p>Кроме сервиса статистики Яндекс.Метрики и мессенджера Telegram (при переходе по ссылке), данные третьим лицам не передаются. Исключение — случаи, прямо предусмотренные законодательством РФ.</p>
			</section>

			<section>
				<h2>6. Ваши права</h2>
				<p>Вы можете запросить информацию об обработке данных, попросить уточнить или удалить их, написав на <a href="mailto:{site.email}">{site.email}</a>. Мы ответим в течение 10 рабочих дней.</p>
			</section>

			<section>
				<h2>7. Изменения</h2>
				<p>Новая редакция политики публикуется на этой странице и вступает в силу с момента публикации.</p>
			</section>
		</div>
	</div>
</article>

<style>
	.prose-policy :global(h2) {
		font-family: var(--font-serif);
		font-size: 1.6rem;
		line-height: 1.2;
		margin-bottom: 0.9rem;
	}
	.prose-policy :global(p) {
		color: var(--color-muted);
		margin-top: 0.75rem;
	}
	.prose-policy :global(ul) {
		color: var(--color-muted);
		list-style: '— ';
		padding-left: 1.25rem;
	}
	.prose-policy :global(li) {
		margin-top: 0.35rem;
	}
	.prose-policy :global(a) {
		color: var(--color-ink);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
</style>
