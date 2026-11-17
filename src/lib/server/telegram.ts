import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from '$app/env/private';

export const telegramConfigured = () => Boolean(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID);

export const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function call(method: string, body: FormData | Record<string, unknown>) {
	const isForm = body instanceof FormData;
	const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`, {
		method: 'POST',
		headers: isForm ? undefined : { 'Content-Type': 'application/json' },
		body: isForm ? body : JSON.stringify(body),
		signal: AbortSignal.timeout(10_000)
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok || !data.ok) throw new Error(`Telegram ${method}: ${res.status} ${data.description ?? ''}`);
	return data;
}

export async function sendMessage(html: string) {
	return call('sendMessage', {
		chat_id: TELEGRAM_CHAT_ID,
		text: html,
		parse_mode: 'HTML',
		link_preview_options: { is_disabled: true }
	});
}

export async function sendDocument(file: File, caption: string) {
	const fd = new FormData();
	fd.set('chat_id', TELEGRAM_CHAT_ID!);
	fd.set('caption', caption.slice(0, 1000));
	fd.set('parse_mode', 'HTML');
	fd.set('document', file, file.name);
	return call('sendDocument', fd);
}
