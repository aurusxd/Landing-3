<script lang="ts">
	import manifest from '#lib/data/images.json';

	type Entry = { w: number; h: number; widths: number[]; bg: string; file?: string };

	let {
		name,
		alt,
		sizes = '100vw',
		eager = false,
		class: klass = '',
		imgClass = ''
	}: {
		name: string;
		alt: string;
		sizes?: string;
		eager?: boolean;
		class?: string;
		imgClass?: string;
	} = $props();

	const entry = $derived((manifest as Record<string, Entry>)[name]);
	const file = $derived(entry?.file ?? name);
	const srcset = $derived(entry?.widths.map((w) => `/images/${file}-${w}.webp ${w}w`).join(', '));
	const src = $derived(entry ? `/images/${file}-${entry.widths[Math.min(1, entry.widths.length - 1)]}.webp` : undefined);
</script>

<div class="overflow-hidden {klass}" style:background-color={entry?.bg ?? '#e7e0d5'}>
	{#if entry}
		<img
			{src}
			{srcset}
			{sizes}
			{alt}
			width={entry.w}
			height={entry.h}
			loading={eager ? 'eager' : 'lazy'}
			fetchpriority={eager ? 'high' : 'auto'}
			decoding={eager ? 'sync' : 'async'}
			class="h-full w-full object-cover {imgClass}"
		/>
	{/if}
</div>
