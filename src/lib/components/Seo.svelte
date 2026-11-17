<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import { site } from '#lib/data/content.ts';

	let {
		title,
		description = site.description,
		path = '/',
		image = '/og.jpg',
		noindex = false
	}: { title: string; description?: string; path?: string; image?: string; noindex?: boolean } = $props();

	const url = $derived(PUBLIC_SITE_URL + path);
	const img = $derived(image.startsWith('http') ? image : PUBLIC_SITE_URL + image);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	{#if noindex}<meta name="robots" content="noindex" />{/if}
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="ru_RU" />
	<meta property="og:site_name" content="Lignum" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={img} />
	<meta property="og:image:alt" content={title} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={img} />
</svelte:head>
