// Генерация интерьерных изображений через Polza AI (Media API).
// Запуск: npm run images:generate            — сгенерировать недостающие
//         npm run images:generate -- hero    — перегенерировать конкретные (по имени)
// Ключ берётся из POLZA_API_KEY (.env). Сырые PNG сохраняются в scripts/.raw,
// дальше их сжимает npm run images:optimize.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW_DIR = path.join(root, 'scripts', '.raw');
const API = 'https://polza.ai/api/v1/media';
const MODEL = process.env.POLZA_MODEL || 'google/gemini-3-pro-image-preview';

async function loadEnv() {
	try {
		const txt = await fs.readFile(path.join(root, '.env'), 'utf8');
		for (const line of txt.split(/\r?\n/)) {
			const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
			if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
		}
	} catch {}
}

const STYLE =
	'Professional architectural interior photography for a premium custom furniture studio. ' +
	'Warm minimalism, calm and airy composition, soft natural daylight, gentle shadows. ' +
	'Muted palette: graphite, warm natural oak wood, warm white, sand beige, subtle brushed brass accents. ' +
	'Editorial magazine look, full-frame camera, 35mm lens, realistic materials and textures, high detail. ' +
	'No people, no text, no letters, no logos, no watermarks.';

/** name, aspect ratio, prompt */
const IMAGES = [
	['hero', '16:9', 'Wide shot of a spacious modern kitchen with a long island. Handleless matte graphite lower cabinets, warm oak veneer tall cabinets and open shelves, thin light stone countertop, built-in appliances, linear LED under-cabinet lighting, large window with soft morning light, a vase with dry branches on the island. Lots of empty wall space in the upper half of the frame.'],
	['about', '3:4', 'Vertical shot of a kitchen corner: warm oak veneer handleless fronts next to matte graphite cabinets, a thin light quartz countertop with a ceramic bowl and a linen towel, soft side daylight.'],
	['interlude', '16:9', 'Close-up detail of a kitchen: edge of a matte graphite cabinet door and a warm oak veneer front with visible wood grain, thin integrated brass handle profile, light stone countertop edge, shallow depth of field, very calm and minimal.'],
	['interlude-small', '1:1', 'Top-down close-up of an open kitchen drawer made of oak with neatly arranged dark ceramic plates and an organizer insert, soft-close runner visible, soft light.'],
	['cat-kitchen', '4:5', 'Bright modern kitchen with warm white enamel fronts and an oak countertop, minimalist, plants, soft daylight.'],
	['cat-wardrobe', '4:5', 'Modern built-in sliding door wardrobe (floor to ceiling) in a bedroom: two sliding doors, one in bronze-tinted mirror and one in warm oak veneer, thin graphite aluminium frame, minimalist bedroom, soft daylight.'],
	['cat-walkin', '4:5', 'Elegant walk-in closet with open shelving system in warm oak and graphite, hanging clothes in neutral colors, integrated LED strip lighting in shelves, an island with drawers in the middle, soft warm light.'],
	['cat-hallway', '4:5', 'Minimalist entrance hallway with a built-in cabinet: tall closed wardrobe in sand beige matte fronts, an open niche with a wooden bench and coat hooks, a round mirror, a pair of shoes, soft light.'],
	['reviews', '16:9', 'Evening view of a cozy kitchen-dining area: dark graphite kitchen cabinets with warm under-cabinet lighting, an oak dining table with linen chairs, pendant lamp glowing, calm warm atmosphere, darker exposure.'],
	['mat-facade', '1:1', 'Flat lay of furniture facade samples arranged in a neat grid: matte enamel MDF in graphite, sand beige and warm white, a natural oak veneer sample with visible grain, a high gloss plastic sample, on a light linen surface, soft top light.'],
	['mat-top', '1:1', 'Flat lay of kitchen countertop samples: white quartz with soft veins, dark graphite compact laminate, solid oak butcher block piece, light grey ceramic slab, arranged on a neutral surface, soft daylight.'],
	['mat-hardware', '1:1', 'Close-up still life of premium furniture hardware: soft-close concealed hinge, drawer runner, brushed brass slim handle and a graphite handle profile, arranged on a light oak board, studio soft light.'],
	['contacts', '4:5', 'Interior of a small furniture design showroom: a kitchen display with oak and graphite fronts, a large table with material samples and rolled drawings, soft daylight from big windows.'],
	// портфолио: обложка (4:3) + деталь (3:4)
	['p-graphite-1', '4:3', 'L-shaped (corner) kitchen with matte graphite handleless fronts and warm oak tall cabinets, white quartz countertop, minimalist city apartment, daylight.'],
	['p-graphite-2', '3:4', 'Detail of a corner kitchen: matte graphite cabinets meeting warm oak tall column with built-in oven, quartz countertop, a coffee machine, soft daylight.'],
	['p-white-1', '4:3', 'U-shaped Scandinavian kitchen with warm white enamel fronts, light oak countertop and open oak shelves, white tiles, plants, bright daylight.'],
	['p-white-2', '3:4', 'Detail of a white Scandinavian kitchen: open oak shelf with ceramic jars, white enamel fronts with small oak knobs, light countertop.'],
	['p-walkin-1', '4:3', 'Spacious walk-in closet in sand beige enamel with glass-door cabinets, integrated lighting, an upholstered pouf in the center, elegant modern classic style.'],
	['p-walkin-2', '3:4', 'Detail of a walk-in closet: tall glass-front cabinet with lighting, shelves with folded sweaters and bags, sand beige frames, brass handles.'],
	['p-coupe-1', '4:3', 'Large sliding wardrobe in a bedroom with three doors: oak veneer and bronze mirror panels, thin graphite frames, neutral bedroom with a bed and a rug.'],
	['p-coupe-2', '3:4', 'Inside of an open sliding wardrobe: hanging rail with clothes, pull-out trouser rack, drawers, shelves with boxes, warm oak interior, LED lighting.'],
	['p-hall-1', '4:3', 'Loft style entrance hallway: built-in wardrobe in dark graphite with an open oak niche and bench, black metal coat rail, concrete-look wall, round mirror.'],
	['p-hall-2', '3:4', 'Detail of a loft hallway: oak bench with a woven basket under it, black metal hooks with a coat and a bag, graphite cabinet fronts.'],
	['p-sage-1', '4:3', 'Straight kitchen in a kitchen-living room with sage green matte enamel fronts in a modern classic shaker style, brass handles, light marble backsplash, oak floor, sofa visible in the foreground.'],
	['p-sage-2', '3:4', 'Detail of a sage green shaker style kitchen: brass handles, marble countertop with a brass faucet, a vase with eucalyptus.']
];

async function generate([name, aspect, prompt], key) {
	const res = await fetch(API, {
		method: 'POST',
		headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({
			model: MODEL,
			input: { prompt: `${prompt} ${STYLE}`, aspect_ratio: aspect, image_resolution: '2K', output_format: 'png' }
		})
	});
	let job = await res.json();
	if (!res.ok) throw new Error(`${name}: ${res.status} ${JSON.stringify(job)}`);

	const started = Date.now();
	while (job.status !== 'completed') {
		if (job.status === 'failed') throw new Error(`${name}: failed ${JSON.stringify(job.error)}`);
		if (Date.now() - started > 6 * 60_000) throw new Error(`${name}: timeout`);
		await new Promise((r) => setTimeout(r, 4000));
		const poll = await fetch(`${API}/${job.id}`, { headers: { Authorization: `Bearer ${key}` } });
		job = await poll.json();
	}
	const url = job.data?.url ?? job.data?.[0]?.url;
	if (!url) throw new Error(`${name}: no url in ${JSON.stringify(job)}`);
	const img = await fetch(url);
	await fs.writeFile(path.join(RAW_DIR, `${name}.png`), Buffer.from(await img.arrayBuffer()));
	console.log(`✓ ${name} (${job.usage?.cost_rub ?? '?'} ₽)`);
}

await loadEnv();
const key = process.env.POLZA_API_KEY;
if (!key) {
	console.error('Нет POLZA_API_KEY в .env');
	process.exit(1);
}
await fs.mkdir(RAW_DIR, { recursive: true });

const only = process.argv.slice(2);
const existing = new Set((await fs.readdir(RAW_DIR)).map((f) => f.replace(/\.png$/, '')));
const queue = IMAGES.filter(([n]) => (only.length ? only.includes(n) : !existing.has(n)));
console.log(`Генерация: ${queue.length} шт., модель ${MODEL}`);

const failed = [];
const workers = Array.from({ length: 4 }, async () => {
	while (queue.length) {
		const item = queue.shift();
		try {
			await generate(item, key);
		} catch (e) {
			console.error(`✗ ${e.message}`);
			failed.push(item[0]);
		}
	}
});
await Promise.all(workers);
if (failed.length) {
	console.error(`Не удалось: ${failed.join(', ')}`);
	process.exit(1);
}
