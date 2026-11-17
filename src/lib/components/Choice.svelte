<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';

	let {
		selected,
		onclick,
		label,
		note = '',
		extra = '',
		multi = false,
		icon
	}: {
		selected: boolean;
		onclick: () => void;
		label: string;
		note?: string;
		extra?: string;
		multi?: boolean;
		icon?: Snippet;
	} = $props();
</script>

<button
	type="button"
	role={multi ? 'checkbox' : 'radio'}
	aria-checked={selected}
	{onclick}
	class="group relative flex w-full items-start gap-4 border p-4 text-left transition duration-300 sm:p-5
	{selected ? 'border-graphite bg-white shadow-[0_10px_30px_-18px_rgba(35,39,42,0.5)]' : 'border-line bg-white/50 hover:border-wood-light hover:bg-white'}"
>
	{#if icon}
		<span class="shrink-0 text-wood">{@render icon()}</span>
	{/if}
	<span class="min-w-0 flex-1">
		<span class="block font-serif text-xl leading-tight">{label}</span>
		{#if note}<span class="mt-1 block text-[0.8rem] leading-snug text-muted">{note}</span>{/if}
		{#if extra}<span class="eyebrow mt-2.5 block !text-[0.62rem] text-wood-dark">{extra}</span>{/if}
	</span>
	<span
		class="grid size-5 shrink-0 place-items-center border transition {multi ? '' : 'rounded-full'}
		{selected ? 'border-graphite bg-graphite text-white' : 'border-line text-transparent group-hover:border-wood-light'}"
	>
		<Icon name="check" size={12} />
	</span>
</button>
