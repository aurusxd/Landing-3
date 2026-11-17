<script lang="ts">
	type Name =
		| 'menu'
		| 'close'
		| 'phone'
		| 'arrow'
		| 'arrow-left'
		| 'arrow-up'
		| 'plus'
		| 'check'
		| 'upload'
		| 'telegram'
		| 'vk'
		| 'whatsapp'
		| 'play';
	let { name, size = 18, class: klass = '' }: { name: Name; size?: number; class?: string } = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.4"
	stroke-linecap="round"
	stroke-linejoin="round"
	class={klass}
	aria-hidden="true"
>
	{#if name === 'menu'}
		<path d="M4 8h16M4 16h16" />
	{:else if name === 'close'}
		<path d="M6 6l12 12M18 6L6 18" />
	{:else if name === 'phone'}
		<rect x="7" y="2.5" width="10" height="19" rx="1.5" /><path d="M11 18.5h2" />
	{:else if name === 'arrow'}
		<path d="M4 12h16M14 6l6 6-6 6" />
	{:else if name === 'arrow-left'}
		<path d="M20 12H4M10 6l-6 6 6 6" />
	{:else if name === 'arrow-up'}
		<path d="M12 20V4M6 10l6-6 6 6" />
	{:else if name === 'plus'}
		<path d="M12 5v14M5 12h14" />
	{:else if name === 'check'}
		<path d="M5 12.5l4.5 4.5L19 7.5" />
	{:else if name === 'upload'}
		<path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
	{:else if name === 'play'}
		<path d="M9 7l8 5-8 5z" />
	{:else if name === 'telegram'}
		<path d="M21 4.5L2.8 11.4c-.8.3-.8 1.4.1 1.6l4.6 1.4 1.8 5.4c.2.6 1 .8 1.5.3l2.6-2.4 4.7 3.5c.6.4 1.4.1 1.6-.6L22.3 5.8c.2-.9-.6-1.6-1.3-1.3z" /><path d="M7.5 14.4L18 7.5l-8.2 8.3" />
	{:else if name === 'vk'}
		<path d="M3 7h3.2c.3 3.6 2 5.8 3.3 6.2V7h3v3.8c1.6-.2 3-2 3.6-3.8h3c-.4 2.3-2.2 4.2-3.5 5 1.3.6 3.4 2.3 4.2 5h-3.3c-.6-1.8-2.2-3.4-4-3.6V17h-.4C6.3 17 3.3 13.4 3 7z" />
	{:else if name === 'whatsapp'}
		<path d="M4 20l1.2-4.1A8 8 0 1112 20a8 8 0 01-3.9-1z" /><path d="M9 8.5c0 3.2 3.3 6.5 6.5 6.5l1-1.6-2-1-1 .9c-1-.4-2-1.4-2.4-2.4l.9-1-1-2z" />
	{/if}
</svg>
