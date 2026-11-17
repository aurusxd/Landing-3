<script lang="ts">
	let {
		label,
		value = $bindable(),
		min,
		max,
		step,
		unit = 'м'
	}: { label: string; value: number; min: number; max: number; step: number; unit?: string } = $props();

	const id = $props.id();
	const pct = $derived(((value - min) / (max - min)) * 100);
	const decimals = $derived(step < 0.1 ? 2 : 1);

	function nudge(d: number) {
		value = Math.min(max, Math.max(min, +(value + d * step).toFixed(2)));
	}
	function onInput(e: Event) {
		const v = parseFloat((e.currentTarget as HTMLInputElement).value.replace(',', '.'));
		if (Number.isFinite(v)) value = Math.min(max, Math.max(min, v));
	}
</script>

<div>
	<div class="flex items-end justify-between gap-4">
		<label for={id} class="eyebrow text-muted">{label}</label>
		<div class="flex items-center gap-1">
			<button type="button" class="grid size-8 place-items-center rounded-full border border-line text-lg leading-none transition hover:border-graphite" onclick={() => nudge(-1)} aria-label="Уменьшить: {label}">−</button>
			<input
				type="text"
				inputmode="decimal"
				class="w-20 bg-transparent text-center font-serif text-2xl tabular-nums outline-none"
				value={value.toLocaleString('ru-RU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
				onchange={onInput}
				aria-label="{label}, {unit}"
			/>
			<span class="text-sm text-muted">{unit}</span>
			<button type="button" class="ml-1 grid size-8 place-items-center rounded-full border border-line text-lg leading-none transition hover:border-graphite" onclick={() => nudge(1)} aria-label="Увеличить: {label}">+</button>
		</div>
	</div>
	<input
		{id}
		type="range"
		{min}
		{max}
		{step}
		bind:value
		class="range mt-4 w-full"
		style:--pct="{pct}%"
	/>
	<div class="mt-1.5 flex justify-between text-[0.7rem] text-muted">
		<span>{min.toLocaleString('ru-RU')} {unit}</span><span>{max.toLocaleString('ru-RU')} {unit}</span>
	</div>
</div>

<style>
	.range {
		appearance: none;
		height: 22px;
		background: linear-gradient(var(--color-graphite), var(--color-graphite)) 0 50% / var(--pct) 2px no-repeat,
			linear-gradient(var(--color-line), var(--color-line)) 0 50% / 100% 2px no-repeat;
		cursor: pointer;
	}
	.range::-webkit-slider-thumb {
		appearance: none;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #fff;
		border: 1px solid var(--color-graphite);
		box-shadow: 0 0 0 5px rgba(176, 138, 91, 0.18);
		transition: transform 0.2s;
	}
	.range::-webkit-slider-thumb:hover {
		transform: scale(1.12);
	}
	.range::-moz-range-thumb {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #fff;
		border: 1px solid var(--color-graphite);
		box-shadow: 0 0 0 5px rgba(176, 138, 91, 0.18);
	}
</style>
