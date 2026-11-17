// Проверка связки с Telegram: читает .env, проверяет токен, доступ к чату
// и (по флагу --send) отправляет тестовое сообщение.
// Запуск: npm run telegram:check
//         npm run telegram:check -- --send
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

try {
	const txt = await fs.readFile(path.join(root, '.env'), 'utf8');
	for (const line of txt.split(/\r?\n/)) {
		const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
		if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
	}
} catch {}

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const send = process.argv.includes('--send');

if (!token || !chatId) {
	console.error('✗ В .env не заданы TELEGRAM_BOT_TOKEN и/или TELEGRAM_CHAT_ID.');
	console.error('  Инструкция — в README.md, раздел «Заявки в Telegram».');
	process.exit(1);
}

const api = (method) => `https://api.telegram.org/bot${token}/${method}`;

try {
	const me = await (await fetch(api('getMe'))).json();
	if (!me.ok) throw new Error(me.description ?? 'getMe failed');
	console.log(`✓ Бот: @${me.result.username} (${me.result.first_name})`);

	const chat = await (await fetch(api('getChat') + `?chat_id=${encodeURIComponent(chatId)}`)).json();
	if (!chat.ok) throw new Error(`${chat.description ?? 'getChat failed'} — добавьте бота в чат/канал администратором`);
	const c = chat.result;
	console.log(`✓ Чат: ${c.title ?? c.username ?? c.first_name ?? c.id} (${c.type}, id ${c.id})`);

	if (send) {
		const res = await (
			await fetch(api('sendMessage'), {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ chat_id: chatId, text: '✅ Lignum: заявки с сайта подключены. Это тестовое сообщение.' })
			})
		).json();
		if (!res.ok) throw new Error(res.description ?? 'sendMessage failed');
		console.log('✓ Тестовое сообщение отправлено.');
	} else {
		console.log('• Чтобы отправить тестовое сообщение: npm run telegram:check -- --send');
	}
} catch (e) {
	console.error('✗', e.message);
	process.exit(1);
}
