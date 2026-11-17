// Клиентский стор конфигуратора: состояние + реактивный пересчёт цены.
import { calculate, defaultConfig, normalize, summary, type Config } from '#lib/pricing.ts';
import { catalogData } from '#lib/pricing.ts';

const STORAGE_KEY = 'lignum:config';

export const STEPS = ['Тип', 'Размеры', 'Фасады', 'Детали', 'Опции', 'Итог'] as const;

class ConfiguratorStore {
	config = $state<Config>(defaultConfig());
	step = $state(0);
	price = $derived(calculate(this.config));
	summary = $derived(summary(this.config));

	/** Применяет пресет (из каталога или портфолио) и открывает нужный шаг */
	apply(preset: Record<string, unknown>, step = 1) {
		const next = { ...$state.snapshot(this.config), ...preset } as Config;
		if (preset.product && preset.product !== this.config.product) {
			next.height = catalogData.products[preset.product as Config['product']].height.default;
		}
		if (preset.facade && !preset.color) {
			next.color = catalogData.facades.find((f) => f.id === preset.facade)?.colors[0].id ?? next.color;
		}
		this.config = normalize(next);
		this.step = step;
		// сохраняем сразу: пресет может применяться со страницы проекта,
		// а конфигуратор на главной при монтировании читает состояние из localStorage
		this.save();
	}

	setProduct(product: Config['product']) {
		if (product === this.config.product) return;
		this.config.product = product;
		this.config.height = catalogData.products[product].height.default;
	}

	setFacade(id: string) {
		this.config.facade = id;
		const f = catalogData.facades.find((x) => x.id === id);
		if (f && !f.colors.some((c) => c.id === this.config.color)) this.config.color = f.colors[0].id;
	}

	toggle(list: 'filling' | 'options', id: string) {
		const arr = this.config[list];
		this.config[list] = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
	}

	reset() {
		this.config = defaultConfig();
		this.step = 0;
	}

	load() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) this.config = normalize(JSON.parse(raw));
		} catch {}
	}

	save() {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify($state.snapshot(this.config)));
		} catch {}
	}
}

export const configurator = new ConfiguratorStore();
