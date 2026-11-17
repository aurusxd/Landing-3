<script lang="ts">
	import { fade } from 'svelte/transition';
	import Img from '#lib/components/Img.svelte';
	import { reviews } from '#lib/data/content.ts';
	import { parallax } from '#lib/actions.ts';

	let i = $state(0);
	let paused = $state(false);

	$effect(() => {
		if (paused) return;
		const t = setInterval(() => (i = (i + 1) % reviews.length), 7000);
		return () => clearInterval(t);
	});

	const initials = (name: string) => name.split(/\s+/)[0][0];
</script>

<section
	id="reviews"
	class="relative isolate overflow-hidden bg-graphite text-white"
	aria-labelledby="reviews-title"
	onmouseenter={() => (paused = true)}
	onmouseleave={() => (paused = false)}
	onfocusin={() => (paused = true)}
>
	<div class="absolute inset-0 -z-10">
		<div class="h-[115%] w-full" use:parallax={{ y: 6 }}>
			<Img name="reviews" alt="" sizes="100vw" class="h-full w-full" />
		</div>
		<div class="absolute inset-0 bg-ink/60"></div>
	</div>

	<span class="vline absolute top-0 left-1/2 h-20 bg-white" aria-hidden="true"></span>

	<div class="container-x flex min-h-[640px] flex-col items-center justify-center py-28 text-center">
		<h2 id="reviews-title" class="eyebrow text-white/80">Отзывы клиентов</h2>
		<div class="mt-10 grid w-full max-w-3xl" aria-live="polite">
			{#key i}
				<figure class="col-start-1 row-start-1" in:fade={{ duration: 700, delay: 250 }} out:fade={{ duration: 250 }}>
					<blockquote class="display text-[clamp(1.4rem,2.8vw,2.1rem)] leading-snug">«{reviews[i].text}»</blockquote>
					<figcaption class="mt-10 flex flex-col items-center gap-4">
						<span class="grid size-14 place-items-center rounded-full border border-white/40 font-serif text-2xl text-wood-light">{initials(reviews[i].name)}</span>
						<span class="eyebrow">{reviews[i].name}</span>
						<span class="-mt-2 text-xs text-white/60">{reviews[i].meta}</span>
					</figcaption>
				</figure>
			{/key}
		</div>
		<div class="mt-12 flex gap-1" role="tablist" aria-label="Выбор отзыва">
			{#each reviews as r, n}
				<button
					type="button"
					role="tab"
					aria-selected={n === i}
					aria-label="Отзыв: {r.name}"
					onclick={() => (i = n)}
					class="grid size-8 place-items-center"
				>
					<span class="size-2 rotate-45 border border-white transition {n === i ? 'bg-white' : 'bg-transparent'}"></span>
				</button>
			{/each}
		</div>
	</div>

	<span class="vline absolute bottom-0 left-1/2 h-20 bg-white" aria-hidden="true"></span>
</section>
