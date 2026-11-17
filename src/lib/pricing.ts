// Модель конфигурации и формула цены. Используется в браузере для живого пересчёта.
import data from '#lib/data/configurator.json';

export type ProductId = 'kitchen' | 'wardrobe';
export type LayoutId = 'straight' | 'corner' | 'u';
export type KindId = 'coupe' | 'hinged' | 'walkin' | 'hallway';
export type SideId = 'A' | 'B' | 'C';

export interface Config {
	product: ProductId;
	layout: LayoutId;
	kind: KindId;
	sides: Record<SideId, number>;
	width: number;
	height: number;
	depth: 450 | 600;
	facade: string;
	color: string;
	countertop: string;
	hardware: string;
	filling: string[];
	options: string[];
	appliances: string;
}

export const catalogData = data;

const K = data.products.kitchen;
const W = data.products.wardrobe;

export function defaultConfig(): Config {
	return {
		product: 'kitchen',
		layout: 'corner',
		kind: 'coupe',
		sides: { A: K.sides.A.default, B: K.sides.B.default, C: K.sides.C.default },
		width: W.width.default,
		height: K.height.default,
		depth: 600,
		facade: 'enamel',
		color: 'warm-white',
		countertop: 'quartz',
		hardware: 'arteo',
		filling: ['drawers'],
		options: ['softclose'],
		appliances: 'none'
	};
}

const clamp = (v: unknown, min: number, max: number, fallback: number) => {
	const n = Number(v);
	return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};
const oneOf = <T extends string>(v: unknown, list: readonly T[], fallback: T): T =>
	list.includes(v as T) ? (v as T) : fallback;

/** Приводит произвольный объект (например, из запроса) к валидной конфигурации. */
export function normalize(input: unknown): Config {
	const d = defaultConfig();
	const c = (input && typeof input === 'object' ? input : {}) as Partial<Config>;
	const product = oneOf(c.product, ['kitchen', 'wardrobe'] as const, d.product);
	const facade = data.facades.find((f) => f.id === c.facade) ?? data.facades[1];
	const sides = (c.sides ?? {}) as Partial<Record<SideId, number>>;
	const h = product === 'kitchen' ? K.height : W.height;
	return {
		product,
		layout: oneOf(c.layout, ['straight', 'corner', 'u'] as const, d.layout),
		kind: oneOf(c.kind, ['coupe', 'hinged', 'walkin', 'hallway'] as const, d.kind),
		sides: {
			A: clamp(sides.A, K.sides.A.min, K.sides.A.max, d.sides.A),
			B: clamp(sides.B, K.sides.B.min, K.sides.B.max, d.sides.B),
			C: clamp(sides.C, K.sides.C.min, K.sides.C.max, d.sides.C)
		},
		width: clamp(c.width, W.width.min, W.width.max, d.width),
		height: clamp(c.height, h.min, h.max, h.default),
		depth: c.depth === 450 ? 450 : 600,
		facade: facade.id,
		color: facade.colors.find((x) => x.id === c.color)?.id ?? facade.colors[0].id,
		countertop: oneOf(c.countertop, data.countertops.map((x) => x.id), d.countertop),
		hardware: oneOf(c.hardware, data.hardware.map((x) => x.id), d.hardware),
		filling: Array.isArray(c.filling)
			? c.filling.filter((id) => data.filling.some((f) => f.id === id))
			: d.filling,
		options: Array.isArray(c.options) ? c.options.filter((id) => typeof id === 'string') : d.options,
		appliances: oneOf(c.appliances, data.appliances.map((x) => x.id), d.appliances)
	};
}

export const activeSides = (c: Config): SideId[] =>
	(K.layouts.find((l) => l.id === c.layout)?.sides ?? ['A']) as SideId[];

/** Погонные метры изделия */
export function meters(c: Config): number {
	if (c.product === 'wardrobe') return c.width;
	return activeSides(c).reduce((sum, s) => sum + c.sides[s], 0);
}

export const facadeOf = (c: Config) => data.facades.find((f) => f.id === c.facade) ?? data.facades[0];
export const colorOf = (c: Config) => facadeOf(c).colors.find((x) => x.id === c.color) ?? facadeOf(c).colors[0];
export const countertopOf = (c: Config) => data.countertops.find((x) => x.id === c.countertop) ?? data.countertops[0];
export const hardwareOf = (c: Config) => data.hardware.find((x) => x.id === c.hardware) ?? data.hardware[0];
export const kindOf = (c: Config) => W.kinds.find((x) => x.id === c.kind) ?? W.kinds[0];
export const layoutOf = (c: Config) => K.layouts.find((x) => x.id === c.layout) ?? K.layouts[0];
export const appliancesOf = (c: Config) => data.appliances.find((x) => x.id === c.appliances) ?? data.appliances[0];

/** Опции, доступные для текущего изделия */
export function availableOptions(c: Config) {
	const list = data.options[c.product] as { id: string; label: string; note: string; perMeter?: number; price?: number; only?: string[] }[];
	return list.filter((o) => !o.only || (c.product === 'wardrobe' && o.only.includes(c.kind)));
}

export interface PriceLine {
	label: string;
	value: number;
}

export interface Price {
	total: number;
	meters: number;
	lines: PriceLine[];
}

const round = (n: number) => Math.round(n / 100) * 100;

export function calculate(c: Config): Price {
	const m = meters(c);
	const heightCoef = 1 + (c.height - data.heightBase) * data.heightFactor;
	const facade = facadeOf(c);
	const hw = hardwareOf(c);
	const perMeter = c.product === 'kitchen' ? K.pricePerMeter : kindOf(c).pricePerMeter;
	const depthCoef = c.product === 'wardrobe' && c.depth === 450 ? 0.92 : 1;

	const lines: PriceLine[] = [];
	const base = m * perMeter * heightCoef * depthCoef * facade.coef * hw.coef;
	lines.push({ label: `Корпус и фасады, ${fmtMeters(m)}`, value: round(base) });

	if (c.product === 'kitchen') {
		const top = countertopOf(c);
		lines.push({ label: `Столешница: ${top.label}`, value: round(m * top.pricePerMeter) });
		const app = appliancesOf(c);
		if (app.price) lines.push({ label: app.label, value: app.price });
	} else {
		for (const id of c.filling) {
			const f = data.filling.find((x) => x.id === id);
			if (f) lines.push({ label: f.label, value: f.price });
		}
	}

	for (const o of availableOptions(c)) {
		if (!c.options.includes(o.id)) continue;
		const v = o.perMeter ? o.perMeter * m : (o.price ?? 0);
		lines.push({ label: o.label, value: round(v) });
	}

	const subtotal = lines.reduce((s, l) => s + l.value, 0);
	const install = round((subtotal - (c.product === 'kitchen' ? appliancesOf(c).price : 0)) * (data.installPercent / 100));
	lines.push({ label: 'Доставка и монтаж', value: install });

	return { total: round(subtotal + install), meters: m, lines };
}

export const fmtRub = (n: number) => new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₽';
export const fmtMeters = (n: number) => `${n.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} пог. м`;
export const fmtM = (n: number) => `${n.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} м`;

/** Человекочитаемая сводка конфигурации (для экрана «Итог» и для Telegram) */
export function summary(c: Config): [string, string][] {
	const rows: [string, string][] = [];
	if (c.product === 'kitchen') {
		rows.push(['Изделие', `Кухня, ${layoutOf(c).label.toLowerCase()}`]);
		rows.push(['Размеры', activeSides(c).map((s) => `${s}: ${fmtM(c.sides[s])}`).join(', ') + `; высота ${fmtM(c.height)}`]);
	} else {
		rows.push(['Изделие', kindOf(c).label]);
		rows.push(['Размеры', `ширина ${fmtM(c.width)}, высота ${fmtM(c.height)}, глубина ${c.depth} мм`]);
	}
	rows.push(['Фасады', `${facadeOf(c).label}, ${colorOf(c).label}`]);
	rows.push(['Фурнитура', `${hardwareOf(c).label} (${hardwareOf(c).brand})`]);
	if (c.product === 'kitchen') {
		rows.push(['Столешница', countertopOf(c).label]);
		rows.push(['Техника', appliancesOf(c).label]);
	} else {
		const f = c.filling.map((id) => data.filling.find((x) => x.id === id)?.label).filter(Boolean);
		rows.push(['Наполнение', f.length ? f.join(', ') : 'базовое (полки и штанга)']);
	}
	const o = availableOptions(c).filter((x) => c.options.includes(x.id)).map((x) => x.label);
	rows.push(['Опции', o.length ? o.join(', ') : 'нет']);
	return rows;
}
