<script lang="ts">
	import Img from '#lib/components/Img.svelte';
	import { parallax, reveal } from '#lib/actions.ts';
</script>

<!-- полноэкранная пауза: фото, монограмма и фраза — как в референсе -->
<section class="relative isolate overflow-hidden bg-graphite text-white" aria-label="Наш подход">
	<div class="absolute inset-0 -z-10">
		<div class="h-[120%] w-full" use:parallax={{ y: 8 }}>
			<Img name="interlude" alt="" sizes="100vw" class="h-full w-full" />
		</div>
		<div class="absolute inset-0 bg-ink/45"></div>
	</div>

	<div class="container-x relative flex min-h-[80svh] flex-col items-center justify-center py-28 text-center">
		<svg class="absolute top-1/2 left-1/2 h-[min(60vw,22rem)] -translate-x-1/2 -translate-y-1/2 text-white/25" viewBox="0 0 36 40" fill="none" stroke="currentColor" stroke-width="0.35" aria-hidden="true">
			<rect x="1" y="1" width="34" height="38" /><path d="M10 1v28h16" /><path d="M26 39V12" />
		</svg>
		<p class="relative display max-w-3xl text-[clamp(1.9rem,4.4vw,3.4rem)] leading-[1.15]" use:reveal>
			Мебель, которая служит годами, начинается <span class="italic">с одного точного замера</span>
		</p>
		<p class="script relative mt-6 text-4xl text-wood-light md:text-5xl" use:reveal={200}>Lignum</p>
	</div>

	<div class="absolute bottom-8 left-[8%] hidden w-56 md:block lg:w-72" use:parallax={{ y: -25 }}>
		<Img name="interlude-small" alt="Ящик из дуба с органайзером для посуды" sizes="288px" class="aspect-square shadow-2xl" />
	</div>
</section>
