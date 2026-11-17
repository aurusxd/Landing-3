<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { activeSides, colorOf, countertopOf, type Config } from '#lib/pricing.ts';

	let { config, inside = false }: { config: Config; inside?: boolean } = $props();

	// --- плавная анимация размеров
	const opts = { duration: 600, easing: cubicOut };
	const tA = Tween.of(() => config.sides.A, opts);
	const tB = Tween.of(() => (activeSides(config).includes('B') ? config.sides.B : 0), opts);
	const tC = Tween.of(() => (activeSides(config).includes('C') ? config.sides.C : 0), opts);
	const tW = Tween.of(() => config.width, opts);
	const tH = Tween.of(() => config.height, opts);

	// --- геометрия холста
	const VB_W = 640;
	const FLOOR = 330;
	const MAX_W = 520;
	const MAX_H = 270;
	const X0 = 40;

	const color = $derived(colorOf(config));
	const fill = $derived(color.hex);
	const grain = $derived('grain' in color && color.grain);
	const top = $derived(countertopOf(config).hex);
	const light = $derived(config.options.includes('light'));
	const handles = $derived(config.hardware !== 'klarr');

	function shade(hex: string, k: number) {
		const n = parseInt(hex.slice(1), 16);
		const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
		return `rgb(${f(n >> 16)}, ${f((n >> 8) & 255)}, ${f(n & 255)})`;
	}
	function luminance(hex: string) {
		const n = parseInt(hex.slice(1), 16);
		return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
	}
	const handleColor = $derived(luminance(fill) > 0.55 ? '#9a7748' : '#d9c3a0');
	const seam = $derived(luminance(fill) > 0.5 ? 'rgba(35,39,42,0.22)' : 'rgba(255,255,255,0.16)');

	const fmt = (m: number) => m.toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + ' м';

	// ======== КУХНЯ ========
	const kitchen = $derived.by(() => {
		const sides = [
			{ id: 'A', len: tA.current },
			{ id: 'B', len: tB.current },
			{ id: 'C', len: tC.current }
		].filter((s) => s.len > 0.05);
		const total = sides.reduce((s, x) => s + x.len, 0);
		const h = tH.current;
		const s = Math.min(MAX_W / total, MAX_H / h);
		const width = total * s;
		const x = X0 + (MAX_W - width) / 2;
		let cursor = x;
		const segs = sides.map((side, si) => {
			const w = side.len * s;
			const n = Math.max(1, Math.round(side.len / 0.6));
			const seg = { ...side, x: cursor, w, n, mw: w / n, si };
			cursor += w;
			return seg;
		});
		return { segs, s, x, width, h };
	});
	const y = (m: number) => FLOOR - m * kitchen.s;

	// ======== ШКАФ ========
	const wardrobe = $derived.by(() => {
		const w = tW.current;
		const h = tH.current;
		const s = Math.min(MAX_W / w, MAX_H / h);
		const W = w * s;
		const H = h * s;
		return { w, h, s, W, H, x: X0 + (MAX_W - W) / 2, y: FLOOR - H };
	});
</script>

<svg viewBox="0 0 {VB_W} 400" class="h-auto w-full" role="img" aria-label="Схема изделия: {config.product === 'kitchen' ? 'кухня' : 'шкаф'}, фасады {color.label}">
	<defs>
		<pattern id="grain" width="14" height="60" patternUnits="userSpaceOnUse">
			<path d="M3 0c2 15-2 30 0 60M9 0c-1.5 20 2 35 0 60M12.5 0c1 10-1 40 0 60" stroke="rgba(40,25,10,0.13)" stroke-width="0.8" fill="none" />
		</pattern>
		<linearGradient id="mirror" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" stop-color="#8d7963" />
			<stop offset="0.45" stop-color="#cdbda7" />
			<stop offset="0.55" stop-color="#b5a38d" />
			<stop offset="1" stop-color="#7a6853" />
		</linearGradient>
		<linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="#ffd9a0" stop-opacity="0.95" />
			<stop offset="1" stop-color="#ffd9a0" stop-opacity="0" />
		</linearGradient>
		<filter id="soft" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="2" /></filter>
	</defs>

	<!-- пол -->
	<line x1="10" x2={VB_W - 10} y1={FLOOR} y2={FLOOR} stroke="#cfc6b8" stroke-width="1" />

	{#if config.product === 'kitchen'}
		{@const k = kitchen}
		{@const upperBottom = 1.45}
		{@const hasUpper = k.h - upperBottom > 0.3}
		{#each k.segs as seg (seg.id)}
			<!-- цоколь -->
			<rect x={seg.x} y={y(0.1)} width={seg.w} height={0.1 * k.s} fill={shade(fill, 0.7)} class="fx" />
			<!-- нижние модули -->
			{#each { length: seg.n } as _, i}
				{@const mx = seg.x + i * seg.mw}
				{@const isOven = config.appliances !== 'none' && seg.si === 0 && i === Math.min(1, seg.n - 1)}
				{#if isOven}
					<rect x={mx} y={y(0.86)} width={seg.mw} height={0.76 * k.s} fill="#2a2d30" class="fx" />
					<rect x={mx + seg.mw * 0.1} y={y(0.74)} width={seg.mw * 0.8} height={0.4 * k.s} fill="#141618" stroke="#4a4d50" stroke-width="1" rx="1" />
					<rect x={mx + seg.mw * 0.15} y={y(0.84)} width={seg.mw * 0.7} height="3" fill="#55585b" />
				{:else}
					<rect x={mx} y={y(0.86)} width={seg.mw} height={0.76 * k.s} fill={fill} stroke={seam} stroke-width="1" class="fx" />
					{#if grain}<rect x={mx} y={y(0.86)} width={seg.mw} height={0.76 * k.s} fill="url(#grain)" />{/if}
					{#if i % 3 === 1}
						<!-- блок ящиков -->
						<line x1={mx} x2={mx + seg.mw} y1={y(0.6)} y2={y(0.6)} stroke={seam} />
						<line x1={mx} x2={mx + seg.mw} y1={y(0.35)} y2={y(0.35)} stroke={seam} />
						{#if handles}
							{#each [0.82, 0.56, 0.31] as hy}
								<line x1={mx + seg.mw * 0.35} x2={mx + seg.mw * 0.65} y1={y(hy)} y2={y(hy)} stroke={handleColor} stroke-width="2" stroke-linecap="round" />
							{/each}
						{/if}
					{:else if handles}
						<line x1={mx + seg.mw * 0.35} x2={mx + seg.mw * 0.65} y1={y(0.81)} y2={y(0.81)} stroke={handleColor} stroke-width="2" stroke-linecap="round" />
					{/if}
				{/if}
				<!-- верхние модули -->
				{#if hasUpper}
					<rect x={mx} y={y(k.h)} width={seg.mw} height={(k.h - upperBottom) * k.s} fill={fill} stroke={seam} stroke-width="1" class="fx" />
					{#if grain}<rect x={mx} y={y(k.h)} width={seg.mw} height={(k.h - upperBottom) * k.s} fill="url(#grain)" />{/if}
					{#if handles}
						<line x1={mx + seg.mw * 0.35} x2={mx + seg.mw * 0.65} y1={y(upperBottom) - 5} y2={y(upperBottom) - 5} stroke={handleColor} stroke-width="2" stroke-linecap="round" />
					{/if}
				{/if}
			{/each}
			<!-- столешница -->
			<rect x={seg.x - (seg.si === 0 ? 3 : 0)} y={y(0.9)} width={seg.w + (seg.si === k.segs.length - 1 ? 3 : 0) + (seg.si === 0 ? 3 : 0)} height={0.04 * k.s + 1} fill={top} stroke="rgba(0,0,0,0.12)" stroke-width="0.6" class="fx" />
			{#if config.appliances !== 'none' && seg.si === 0}
				{@const ox = seg.x + Math.min(1, seg.n - 1) * seg.mw}
				<rect x={ox + seg.mw * 0.12} y={y(0.9) - 2.5} width={seg.mw * 0.76} height="2.5" fill="#151719" />
			{/if}
			{#if config.options.includes('sink') && seg.si === k.segs.length - 1}
				{@const sx = seg.x + seg.w - seg.mw * 1.5}
				<path d="M{sx} {y(0.9)} v-{0.28 * k.s} q0 -8 9 -8 h6" fill="none" stroke="#8c8f92" stroke-width="2.5" stroke-linecap="round" />
			{/if}
			<!-- подсветка -->
			{#if light && hasUpper}
				<rect x={seg.x + 2} y={y(upperBottom)} width={seg.w - 4} height={(upperBottom - 0.9) * k.s * 0.65} fill="url(#glow)" class="glow" />
				<rect x={seg.x + 2} y={y(upperBottom)} width={seg.w - 4} height="2" fill="#ffe2b3" filter="url(#soft)" />
			{/if}
			<!-- угол развёртки -->
			{#if seg.si > 0}
				<line x1={seg.x} x2={seg.x} y1={y(k.h) - 14} y2={FLOOR + 6} stroke="#b08a5b" stroke-dasharray="3 4" stroke-width="1" />
			{/if}
			<!-- размер стороны -->
			<g class="text-muted dims">
				<line x1={seg.x + 2} x2={seg.x + seg.w - 2} y1={FLOOR + 26} y2={FLOOR + 26} stroke="currentColor" stroke-width="0.8" />
				<line x1={seg.x + 2} x2={seg.x + 2} y1={FLOOR + 21} y2={FLOOR + 31} stroke="currentColor" stroke-width="0.8" />
				<line x1={seg.x + seg.w - 2} x2={seg.x + seg.w - 2} y1={FLOOR + 21} y2={FLOOR + 31} stroke="currentColor" stroke-width="0.8" />
				<text x={seg.x + seg.w / 2} y={FLOOR + 48} text-anchor="middle" class="dim">{k.segs.length > 1 ? `${seg.id} · ` : ''}{fmt(seg.len)}</text>
			</g>
		{/each}
		<!-- высота -->
		<g class="text-muted dims">
			<line x1={k.x + k.width + 18} x2={k.x + k.width + 18} y1={y(k.h)} y2={FLOOR} stroke="currentColor" stroke-width="0.8" />
			<text x={k.x + k.width + 30} y={(y(k.h) + FLOOR) / 2} class="dim" transform="rotate(-90 {k.x + k.width + 30} {(y(k.h) + FLOOR) / 2})" text-anchor="middle">{fmt(k.h)}</text>
		</g>
		<!-- мини-план сверху -->
		{#if k.segs.length > 1}
			<g transform="translate({VB_W - 92} 14)" class="text-wood plan">
				<rect width="78" height="58" fill="none" stroke="#ddd5c9" />
				{#if config.layout === 'corner'}
					<path d="M10 10h58M10 10v38" stroke="currentColor" stroke-width="6" fill="none" />
				{:else}
					<path d="M10 48V10h58v38" stroke="currentColor" stroke-width="6" fill="none" />
				{/if}
				<text x="39" y="26" text-anchor="middle" class="dim-sm">план</text>
			</g>
		{/if}
	{:else}
		{@const wd = wardrobe}
		{@const sy = (m: number) => FLOOR - m * wd.s}
		{@const kind = config.kind}
		{@const showInside = inside && kind !== 'walkin'}
		{@const closedW = kind === 'hallway' ? wd.W * 0.58 : wd.W}
		<!-- корпус -->
		<rect x={wd.x - 3} y={wd.y - 3} width={wd.W + 6} height={wd.H + 3} fill={kind === 'walkin' ? 'none' : shade(fill, 0.82)} class="fx" />

		{#if kind === 'walkin' || showInside || kind === 'hallway'}
			<!-- внутреннее наполнение -->
			{@const iw = kind === 'walkin' || showInside ? wd.W : 0}
			{@const sections = Math.max(1, Math.round(wd.w / 0.85))}
			{@const sw = (kind === 'hallway' && !showInside ? 0 : kind === 'hallway' ? closedW : wd.W) / sections}
			{#if sw > 0}
				<rect x={wd.x} y={wd.y} width={kind === 'hallway' ? closedW : wd.W} height={wd.H} fill="#efe9df" />
				{#each { length: sections } as _, i}
					{@const x = wd.x + i * sw}
					<rect x={x} y={wd.y} width={sw} height={wd.H} fill="none" stroke={kind === 'walkin' ? fill : '#d8cfc2'} stroke-width={kind === 'walkin' ? 4 : 1.5} class="fx" />
					<!-- верхняя полка -->
					<line x1={x} x2={x + sw} y1={sy(wd.h - 0.4)} y2={sy(wd.h - 0.4)} stroke={kind === 'walkin' ? fill : '#cfc5b6'} stroke-width="3" class="fx" />
					{#if i % 3 === 0}
						<!-- штанга с одеждой -->
						{@const ry = sy(wd.h - 0.5)}
						<line x1={x + 4} x2={x + sw - 4} y1={ry} y2={ry} stroke="#8c8f92" stroke-width="2" />
						{#each { length: Math.max(2, Math.floor(sw / 9)) } as _, j}
							{@const cx = x + 8 + j * 9}
							{#if cx < x + sw - 6}
								<path d="M{cx} {ry} l-3 6 h6 z M{cx - 4} {ry + 6} h8 v{wd.H * 0.42} h-8 z" fill={['#c9bba6', '#8f9aa0', '#e4dccf', '#6d6158', '#b7a58d'][j % 5]} stroke="none" />
							{/if}
						{/each}
						{#if config.filling.includes('shoes')}
							{#each [0.12, 0.28] as sh}
								<line x1={x + 4} x2={x + sw - 4} y1={sy(sh)} y2={sy(sh + 0.08)} stroke="#b08a5b" stroke-width="2" />
							{/each}
						{/if}
						{#if config.filling.includes('pantograph')}
							<path d="M{x + sw / 2} {sy(wd.h - 0.45)} v14 m-6 0 h12" stroke="#b08a5b" stroke-width="2" fill="none" />
						{/if}
					{:else if i % 3 === 1}
						<!-- полки -->
						{#each [0.35, 0.65, 0.95, 1.25] as p}
							{#if p < wd.h - 0.6}
								<line x1={x} x2={x + sw} y1={sy(wd.h - 0.4 - p)} y2={sy(wd.h - 0.4 - p)} stroke={kind === 'walkin' ? fill : '#cfc5b6'} stroke-width="2.5" class="fx" />
								<rect x={x + 6} y={sy(wd.h - 0.4 - p) - 10} width={sw * 0.5} height="9" fill="#d9cfc0" rx="1" />
							{/if}
						{/each}
						{#if config.filling.includes('drawers')}
							{#each [0, 1, 2] as d}
								<rect x={x + 2} y={sy(0.2 + d * 0.22)} width={sw - 4} height={0.2 * wd.s} fill={fill} stroke={seam} class="fx" />
							{/each}
						{/if}
					{:else}
						<!-- брючница / корзины -->
						{@const ry = sy(wd.h - 0.5)}
						<line x1={x + 4} x2={x + sw - 4} y1={ry} y2={ry} stroke="#8c8f92" stroke-width="2" />
						{#each { length: Math.max(2, Math.floor(sw / 10)) } as _, j}
							{@const cx = x + 8 + j * 10}
							{#if cx < x + sw - 6}
								<path d="M{cx} {ry} l-3 6 h6 z M{cx - 4} {ry + 6} h8 v{wd.H * 0.28} h-8 z" fill={['#e4dccf', '#6d6158', '#a9b3b6'][j % 3]} />
							{/if}
						{/each}
						{#if config.filling.includes('trousers')}
							{#each { length: 5 } as _, t}
								<line x1={x + 6 + t * ((sw - 12) / 4)} x2={x + 6 + t * ((sw - 12) / 4)} y1={sy(0.95)} y2={sy(0.6)} stroke="#8c8f92" stroke-width="1.2" />
							{/each}
						{/if}
						{#if config.filling.includes('baskets')}
							{#each [0.1, 0.32] as b}
								<rect x={x + 4} y={sy(b + 0.18)} width={sw - 8} height={0.18 * wd.s} fill="none" stroke="#8c8f92" stroke-dasharray="2 2" />
							{/each}
						{/if}
					{/if}
					{#if light}
						<rect x={x + 3} y={wd.y + 2} width={sw - 6} height={wd.H * 0.35} fill="url(#glow)" class="glow" />
					{/if}
				{/each}
			{/if}
		{/if}

		{#if kind === 'coupe' || kind === 'hinged' || kind === 'hallway'}
			<!-- двери -->
			{@const doorArea = closedW}
			{@const n = kind === 'coupe' ? Math.min(5, Math.max(2, Math.round(wd.w / 0.95))) : Math.max(kind === 'hallway' ? 1 : 2, Math.round((doorArea / wd.s) / 0.5))}
			{@const dw = doorArea / n}
			{@const mezz = kind !== 'coupe' ? 0.45 * wd.s : 0}
			<g class="doors" style:opacity={showInside ? 0.14 : 1}>
				{#each { length: n } as _, i}
					{@const mirror = config.options.includes('mirrorDoors') && i % 2 === 1}
					{@const dx = wd.x + i * dw}
					{#if mezz}
						<rect x={dx} y={wd.y} width={dw} height={mezz} fill={fill} stroke={seam} class="fx" />
						{#if grain}<rect x={dx} y={wd.y} width={dw} height={mezz} fill="url(#grain)" />{/if}
					{/if}
					<rect x={dx} y={wd.y + mezz} width={dw} height={wd.H - mezz} fill={mirror ? 'url(#mirror)' : fill} stroke={kind === 'coupe' ? '#2d3236' : seam} stroke-width={kind === 'coupe' ? 2.5 : 1} class="fx" />
					{#if grain && !mirror}<rect x={dx} y={wd.y + mezz} width={dw} height={wd.H - mezz} fill="url(#grain)" />{/if}
					{#if kind !== 'coupe' && handles}
						{@const hx = i % 2 === 0 ? dx + dw - 7 : dx + 7}
						<line x1={hx} x2={hx} y1={sy(1.05)} y2={sy(0.85)} stroke={handleColor} stroke-width="2.2" stroke-linecap="round" />
					{/if}
				{/each}
				{#if kind === 'coupe'}
					<line x1={wd.x - 3} x2={wd.x + wd.W + 3} y1={wd.y + 1} y2={wd.y + 1} stroke="#2d3236" stroke-width="3" />
				{/if}
			</g>
		{/if}

		{#if kind === 'hallway'}
			<!-- открытая ниша: задняя стенка, полка, крючки, банкетка -->
			{@const nx = wd.x + closedW}
			{@const nw = wd.W - closedW}
			<rect x={nx} y={wd.y} width={nw} height={wd.H} fill="#e9e2d6" />
			<rect x={nx} y={wd.y} width={nw} height={0.45 * wd.s} fill={fill} stroke={seam} class="fx" />
			<line x1={nx} x2={nx + nw} y1={sy(wd.h - 0.6)} y2={sy(wd.h - 0.6)} stroke={shade(fill, 0.85)} stroke-width="3" class="fx" />
			{#each { length: Math.max(2, Math.floor(nw / 18)) } as _, j}
				<circle cx={nx + 12 + j * 18} cy={sy(1.7)} r="2.2" fill="#2d3236" />
			{/each}
			<rect x={nx + 4} y={sy(0.47)} width={nw - 8} height={0.05 * wd.s + 2} fill="#b88f62" />
			<line x1={nx + 8} x2={nx + 8} y1={sy(0.42)} y2={FLOOR} stroke="#2d3236" stroke-width="2" />
			<line x1={nx + nw - 8} x2={nx + nw - 8} y1={sy(0.42)} y2={FLOOR} stroke="#2d3236" stroke-width="2" />
			<rect x={nx + nw * 0.25} y={sy(0.28)} width={nw * 0.45} height={0.22 * wd.s} fill="#c9b79a" rx="2" />
		{/if}

		<!-- размеры -->
		<g class="text-muted dims">
			<line x1={wd.x} x2={wd.x + wd.W} y1={FLOOR + 26} y2={FLOOR + 26} stroke="currentColor" stroke-width="0.8" />
			<line x1={wd.x} x2={wd.x} y1={FLOOR + 21} y2={FLOOR + 31} stroke="currentColor" stroke-width="0.8" />
			<line x1={wd.x + wd.W} x2={wd.x + wd.W} y1={FLOOR + 21} y2={FLOOR + 31} stroke="currentColor" stroke-width="0.8" />
			<text x={wd.x + wd.W / 2} y={FLOOR + 48} text-anchor="middle" class="dim">{fmt(wd.w)}</text>
			<line x1={wd.x + wd.W + 18} x2={wd.x + wd.W + 18} y1={wd.y} y2={FLOOR} stroke="currentColor" stroke-width="0.8" />
			<text x={wd.x + wd.W + 30} y={(wd.y + FLOOR) / 2} class="dim" transform="rotate(-90 {wd.x + wd.W + 30} {(wd.y + FLOOR) / 2})" text-anchor="middle">{fmt(wd.h)}</text>
		</g>
		{#if inside && kind !== 'walkin'}
			<text x={wd.x + 8} y={wd.y - 12} class="dim-sm" fill="#b08a5b">вид без дверей</text>
		{/if}
	{/if}
</svg>

<style>
	.fx {
		transition: fill 0.6s ease, stroke 0.6s ease;
	}
	.glow {
		animation: glow-in 0.8s ease both;
	}
	@keyframes glow-in {
		from {
			opacity: 0;
		}
	}
	.doors {
		transition: opacity 0.6s ease;
	}
	.dim {
		font: 500 13px var(--font-sans);
		fill: currentColor;
		letter-spacing: 0.04em;
	}
	.dim-sm {
		font: 600 9px var(--font-sans);
		fill: currentColor;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	/* На узких экранах схема уменьшается вместе с подписями, поэтому размерные
	   линии и план убираем — остаются сами модули, фасады и цвет. */
	@media (max-width: 639px) {
		.dims,
		.plan {
			display: none;
		}
	}
</style>
