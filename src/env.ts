import { defineEnvVars } from '@sveltejs/kit/env';

const optional = (value: string | undefined) => value?.trim() || undefined;

export const variables = defineEnvVars({
	TELEGRAM_BOT_TOKEN: { schema: optional, description: 'Токен Telegram-бота от @BotFather' },
	TELEGRAM_CHAT_ID: { schema: optional, description: 'ID чата, куда бот отправляет заявки' },
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
