<script lang="ts">
	import Img from '#lib/components/Img.svelte';
	import { parallax, reveal } from '#lib/actions.ts';
</script>

<section id="about" class="relative overflow-hidden bg-white py-24 md:py-36" aria-labelledby="about-title">
	<div class="bg-word top-6 left-1/2 -translate-x-1/2 md:top-10" aria-hidden="true">
		<span class="block" data-word="Lignum" use:parallax={{ x: 6 }}></span>
	</div>

	<div class="container-x relative grid items-center gap-16 md:grid-cols-2 md:gap-12 lg:gap-24">
		<div class="max-w-lg md:pl-[6%]" use:reveal>
			<p class="eyebrow eyebrow-line text-muted">Студия корпусной мебели</p>
			<h2 id="about-title" class="display dropcap mt-7 text-[clamp(1.9rem,3.4vw,2.6rem)] leading-[1.15]">
				Мы делаем кухни и шкафы, которые повторяют ваш дом до миллиметра
			</h2>
			<p class="mt-7 clear-both text-[0.95rem] leading-relaxed text-muted">
				С 2016 года проектируем и производим мебель на собственном производстве в Подмосковье. Сами замеряем, сами
				делаем проект, сами собираем и монтируем — поэтому отвечаем за результат целиком и даём гарантию 5 лет.
			</p>
			<p class="mt-4 text-[0.95rem] leading-relaxed text-muted">
				Хотите понять бюджет до встречи с дизайнером? Соберите кухню или шкаф в онлайн-конфигураторе — он считает по
				тем же расценкам, что и наши менеджеры.
			</p>
			<a href="/#process" class="link-circle mt-10 ml-4"><span class="dash"></span>Как мы работаем</a>
		</div>

		<div class="frame mx-auto w-[82%] max-w-md md:w-full" use:reveal={150}>
			<Img name="about" alt="Угол кухни: фасады из шпона дуба и матовый графит" sizes="(min-width: 768px) 40vw, 80vw" class="relative aspect-[3/4]" />
			<p class="script absolute -bottom-10 -left-6 text-5xl text-wood md:-left-14 md:text-6xl" aria-hidden="true">с любовью к дереву</p>
		</div>
	</div>
</section>

<style>
	.dropcap::first-letter {
		float: left;
		font-family: var(--font-serif);
		font-size: 2.9em;
		font-weight: 300;
		line-height: 0.72;
		margin: 0.08em -0.06em 0 0;
	}
</style>
