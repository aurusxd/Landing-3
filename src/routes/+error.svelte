<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head><title>{page.status} — Lignum</title><meta name="robots" content="noindex" /></svelte:head>

<section class="flex min-h-[80svh] flex-col items-center justify-center bg-paper px-4 pt-24 text-center">
	<p class="display text-[8rem] leading-none text-wood-light">{page.status}</p>
	<p class="script mt-2 text-5xl text-wood">упс</p>
	<h1 class="display mt-6 text-3xl">{page.status === 404 ? 'Такой страницы нет' : 'Что-то пошло не так'}</h1>
	<a href="/" class="btn btn-dark mt-10">На главную</a>
</section>
