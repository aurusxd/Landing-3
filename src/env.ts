import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_SITE_URL: {
		public: true,
		static: true,
		schema: (v) => (v?.trim() || 'https://lignum.ru').replace(/\/$/, ''),
		description: 'Публичный адрес сайта без слеша в конце'
	},
	PUBLIC_YM_ID: {
		public: true,
		static: true,
		schema: (v) => v?.trim() ?? '',
		description: 'Номер счётчика Яндекс.Метрики'
	}
});
