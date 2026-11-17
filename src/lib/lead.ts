// Отправка заявки на серверный эндпоинт /api/lead
import { reachGoal } from '#lib/analytics.ts';

export type LeadResult = { ok: true } | { ok: false; error: string };

export async function sendLead(form: FormData, source: 'configurator' | 'contacts' | 'project'): Promise<LeadResult> {
	form.set('source', source);
	try {
		const res = await fetch('/api/lead', { method: 'POST', body: form });
		const data = await res.json().catch(() => ({}));
		if (!res.ok || !data.ok) return { ok: false, error: data.error ?? 'Не удалось отправить заявку. Попробуйте ещё раз.' };
		reachGoal('lead_sent', { source });
		return { ok: true };
	} catch {
		return { ok: false, error: 'Нет соединения. Проверьте интернет и попробуйте снова.' };
	}
}

/** Маска телефона +7 (999) 123-45-67 */
export function phoneMask(node: HTMLInputElement) {
	const format = () => {
		let d = node.value.replace(/\D/g, '');
		if (!d) {
			node.value = '';
			return;
		}
		if (d.startsWith('8')) d = '7' + d.slice(1);
		// при вставке уже отформатированного номера в поле с подставленным «+7 (»
		// получается лишняя семёрка: +7 (+7 (999)… — схлопываем её
		while (d.startsWith('77')) d = d.slice(1);
		if (!d.startsWith('7')) d = '7' + d;
		d = d.slice(0, 11);
		const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
		let out = '+7';
		if (p[0]) out += ` (${p[0]}`;
		if (p[0].length === 3) out += ')';
		if (p[1]) out += ` ${p[1]}`;
		if (p[2]) out += `-${p[2]}`;
		if (p[3]) out += `-${p[3]}`;
		node.value = d.length === 0 ? '' : out;
	};
	const onFocus = () => {
		if (!node.value) node.value = '+7 (';
	};
	const onBlur = () => {
		if (node.value.replace(/\D/g, '').length <= 1) node.value = '';
	};
	node.addEventListener('input', format);
	node.addEventListener('focus', onFocus);
	node.addEventListener('blur', onBlur);
	return {
		destroy() {
			node.removeEventListener('input', format);
			node.removeEventListener('focus', onFocus);
			node.removeEventListener('blur', onBlur);
		}
	};
}

export const phoneValid = (v: string) => v.replace(/\D/g, '').length === 11;
