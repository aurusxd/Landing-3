// Цели Яндекс.Метрики. Если счётчик не задан (PUBLIC_YM_ID пуст), вызовы просто игнорируются.
import { PUBLIC_YM_ID } from '$app/env/public';

export type Goal = 'configurator_open' | 'configurator_step' | 'lead_sent' | 'phone_click';

const fired = new Set<Goal>();

export function reachGoal(goal: Goal, params?: Record<string, unknown>, { once = false } = {}) {
	if (once && fired.has(goal)) return;
	fired.add(goal);
	const id = Number(PUBLIC_YM_ID);
	if (!id || typeof window === 'undefined') return;
	window.ym?.(id, 'reachGoal', goal, params);
}
