<script lang="ts">
	let { size = 30, withName = true, class: klass = '' }: { size?: number; withName?: boolean; class?: string } = $props();
</script>

<span class="inline-flex flex-col items-center gap-1.5 {klass}">
	<svg width={size} height={size * 1.1} viewBox="0 0 36 40" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
		<rect x="1" y="1" width="34" height="38" />
		<path d="M10 1v28h16" />
		<path d="M26 39V12" />
	</svg>
	{#if withName}
		<span class="text-[0.7rem] font-medium tracking-[0.42em] uppercase pl-[0.42em]">Lignum</span>
	{/if}
</span>
