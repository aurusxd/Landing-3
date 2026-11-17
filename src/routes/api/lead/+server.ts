import { json } from '@sveltejs/kit';
import { calculate, fmtRub, normalize, summary } from '#lib/pricing.ts';
import { escapeHtml, sendDocument, sendMessage, telegramConfigured } from '#lib/server/telegram.ts';
import { rateLimit } from '#lib/server/rate-limit.ts';
import type { RequestHandler } from './$types';

export const prerender = false;

const MAX_FILE = 4 * 1024 * 1024; // лимит тела запроса на Vercel — 4,5 МБ
const FILE_EXT = /\.(pdf|jpe?g|png|webp|heic|dwg|dxf)$/i;
const MIN_FILL_MS = 1500;

const SOURCES: Record<string, string> = {
	configurator: '🧮 Конфигуратор',
	contacts: '✉️ Форма контактов',
	project: '🖼 Страница проекта'
};

const fail = (status: number, error: string) => json({ ok: false, error }, { status });

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	let form: FormData;
	try {
		form = await request.formData();
	} catch {
		return fail(400, 'Некорректный запрос');
	}

	const str = (k: string, max = 200) => String(form.get(k) ?? '').trim().slice(0, max);

	// 1. Honeypot и слишком быстрое заполнение — молча «принимаем», чтобы не подсказывать боту
	const elapsed = Number(str('elapsed'));
	if (str('website') || (elapsed > 0 && elapsed < MIN_FILL_MS)) {
		return json({ ok: true });
	}

	// 2. Rate limit по IP
	let ip = 'unknown';
	try {
		ip = getClientAddress();
	} catch {}
	if (!rateLimit(ip)) return fail(429, 'Слишком много заявок. Попробуйте через 10 минут или позвоните нам.');

	// 3. Валидация
	const name = str('name', 80);
	const phoneDigits = str('phone', 40).replace(/\D/g, '');
	const comment = str('comment', 1500);
	const source = SOURCES[str('source')] ? str('source') : 'contacts';
	if (!name) return fail(422, 'Укажите имя');
	if (phoneDigits.length !== 11) return fail(422, 'Проверьте номер телефона');
	if (!form.get('consent')) return fail(422, 'Нужно согласие на обработку данных');

	const file = form.get('file');
	const hasFile = file instanceof File && file.size > 0;
	if (hasFile) {
		if (file.size > MAX_FILE) return fail(413, 'Файл больше 4 МБ');
		if (!FILE_EXT.test(file.name)) return fail(415, 'Поддерживаются PDF, JPG, PNG, WEBP, HEIC, DWG, DXF');
	}

	const phone = `+${phoneDigits[0]} (${phoneDigits.slice(1, 4)}) ${phoneDigits.slice(4, 7)}-${phoneDigits.slice(7, 9)}-${phoneDigits.slice(9)}`;

	// 4. Сообщение
	const lines = [
		`<b>Новая заявка · ${SOURCES[source]}</b>`,
		'',
		`👤 ${escapeHtml(name)}`,
		`📞 <a href="tel:+${phoneDigits}">${phone}</a>`
	];
	if (comment) lines.push(`💬 ${escapeHtml(comment)}`);

	if (source === 'configurator' && form.get('config')) {
		try {
			// цену пересчитываем на сервере — значению из браузера не доверяем
			const config = normalize(JSON.parse(str('config', 5000)));
			const price = calculate(config);
			lines.push('', '<b>Конфигурация</b>');
			for (const [k, v] of summary(config)) lines.push(`• ${k}: ${escapeHtml(v)}`);
			lines.push('', `💰 <b>≈ ${fmtRub(price.total)}</b> (${price.meters.toLocaleString('ru-RU')} пог. м, с монтажом)`);
		} catch {
			lines.push('', '⚠️ Не удалось прочитать конфигурацию');
		}
	}
	if (hasFile) lines.push('', `📎 План помещения: ${escapeHtml(file.name)}`);
	lines.push('', `<i>${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} МСК</i>`);

	const text = lines.join('\n');

	// 5. Отправка
	if (!telegramConfigured()) {
		// Бот ещё не подключён (демо-режим): заявка пишется в логи сервера
		console.warn('[lead] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID не заданы, заявка не отправлена:\n' + text);
		return json({ ok: true, demo: true });
	}

	try {
		await sendMessage(text);
		if (hasFile) await sendDocument(file, `📎 План от ${escapeHtml(name)}, ${phone}`);
	} catch (e) {
		console.error('[lead]', e);
		return fail(502, 'Не удалось отправить заявку. Позвоните нам — ответим сразу.');
	}

	return json({ ok: true });
};
