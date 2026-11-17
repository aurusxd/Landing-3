// Простой rate limit в памяти: N запросов за окно на один IP.
// На Vercel память живёт в пределах «тёплого» инстанса функции — от массовой
// отправки с одного адреса этого достаточно. Для жёсткого лимита — Upstash/Vercel KV.
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60_000): boolean {
	const now = Date.now();
	const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
	if (list.length >= limit) {
		hits.set(key, list);
		return false;
	}
	list.push(now);
	hits.set(key, list);
	if (hits.size > 5000) {
		for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
	}
	return true;
}
