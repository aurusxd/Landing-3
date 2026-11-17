// Сжимает сырые PNG из scripts/.raw в static/images/*.webp нескольких ширин,
// пишет манифест src/lib/data/images.json (размеры, ширины, средний цвет для плейсхолдера),
// а также собирает OG-картинку, favicon и apple-touch-icon.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW = path.join(root, 'scripts', '.raw');
const SOURCES = path.join(root, 'scripts', 'sources');
const OUT = path.join(root, 'static', 'images');
const WIDTHS = [480, 960, 1440, 2048];

await fs.mkdir(OUT, { recursive: true });
await fs.mkdir(RAW, { recursive: true });

const exists = async (p) => {
	try {
		await fs.access(p);
		return true;
	} catch {
		return false;
	}
};

// --- Фото гардеробной, которого не было в наборе.
// Pexels #7005019, бесплатная лицензия Pexels. Приводим к тёплой палитре сайта.
if (!(await exists(path.join(RAW, 'cat-walkin.png')))) {
	await sharp(path.join(SOURCES, 'walkin.jpg'))
		.resize({ width: 2400 })
		.modulate({ brightness: 1.04, saturation: 0.92 })
		.recomb([
			[1.05, 0.02, 0],
			[0.01, 1.0, 0],
			[0, 0, 0.92]
		])
		.extract({ left: 600, top: 600, width: 1800, height: 2250 })
		.png()
		.toFile(path.join(RAW, 'cat-walkin.png'));
	console.log('✓ cat-walkin из scripts/sources/walkin.jpg');
}

// --- Крупные планы для страниц проектов: режем из уже готовых интерьеров.
const CROPS = [
	{ name: 'p-white-2', from: 'cat-kitchen.png', area: { left: 0, top: 480, width: 1340, height: 1786 } },
	{ name: 'p-coupe-2', from: 'cat-wardrobe.png', area: { left: 300, top: 150, width: 1300, height: 1733 } },
	{ name: 'p-hall-2', from: 'cat-hallway.png', area: { left: 620, top: 520, width: 1230, height: 1640 } },
	{ name: 'p-walkin-2', from: 'cat-walkin.png', area: { left: 400, top: 250, width: 1350, height: 1800 } }
];
for (const crop of CROPS) {
	const dest = path.join(RAW, `${crop.name}.png`);
	if (await exists(dest)) continue;
	if (!(await exists(path.join(RAW, crop.from)))) continue;
	await sharp(path.join(RAW, crop.from)).extract(crop.area).png().toFile(dest);
	console.log(`✓ ${crop.name} — кроп ${crop.from}`);
}

const files = (await fs.readdir(RAW)).filter((f) => f.endsWith('.png'));
if (!files.length) {
	console.error('В scripts/.raw нет PNG. Сначала сгенерируйте картинки: npm run images:generate');
	console.error('Если исходники утеряны, восстановите их из репозитория или сгенерируйте заново —');
	console.error('готовые webp уже лежат в static/images, манифест при этом не перезаписывается.');
	process.exit(1);
}

// Сохраняем уже описанные картинки: при частичной пересборке манифест не должен «поредеть».
const manifest = JSON.parse(await fs.readFile(path.join(root, 'src', 'lib', 'data', 'images.json'), 'utf8').catch(() => '{}'));

for (const file of files) {
	const name = file.replace(/\.png$/, '');
	const src = sharp(path.join(RAW, file));
	const { width, height } = await src.metadata();
	const { dominant } = await src.stats();
	const widths = WIDTHS.filter((w) => w < width).concat(width > 2048 ? [] : [width]).slice(0, 4);
	for (const w of widths) {
		await sharp(path.join(RAW, file))
			.resize({ width: w })
			.webp({ quality: w <= 480 ? 70 : 74, effort: 5 })
			.toFile(path.join(OUT, `${name}-${w}.webp`));
	}
	const hex = '#' + [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, '0')).join('');
	manifest[name] = { w: width, h: height, widths, bg: hex };
	console.log(`✓ ${name}: ${widths.join(', ')}`);
}

// Переиспользуем удачные кадры там, где отдельная съёмка не нужна.
// file указывает, какой набор webp отдавать (см. Img.svelte).
const ALIASES = {
	about: 'p-graphite-2',
	'p-white-1': 'cat-kitchen',
	'p-walkin-1': 'cat-walkin',
	'p-coupe-1': 'cat-wardrobe',
	'p-hall-1': 'cat-hallway',
	'p-evening-1': 'reviews',
	'p-evening-2': 'interlude'
};
for (const [name, src] of Object.entries(ALIASES)) {
	if (!manifest[name] && manifest[src]) {
		manifest[name] = { ...manifest[src], file: src };
	}
}

await fs.writeFile(path.join(root, 'src', 'lib', 'data', 'images.json'), JSON.stringify(manifest, null, '\t') + '\n');

// --- favicon / apple-touch-icon из монограммы
const mono = (bg, fg, size, pad) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  ${bg ? `<rect width="64" height="64" rx="${pad ? 0 : 12}" fill="${bg}"/>` : ''}
  <g fill="none" stroke="${fg}" stroke-width="2.4">
    <rect x="14" y="12" width="36" height="40"/>
    <path d="M24 12v28h16"/>
    <path d="M40 52V24"/>
  </g>
</svg>`;
await fs.writeFile(path.join(root, 'static', 'favicon.svg'), mono('#23272A', '#CDAE85', 64, false).trim() + '\n');
await sharp(Buffer.from(mono('#23272A', '#CDAE85', 180, true))).png().toFile(path.join(root, 'static', 'apple-touch-icon.png'));

// --- OG-картинка 1200×630: hero + затемнение + монограмма и название
if (files.includes('hero.png')) {
	const overlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1c1f21" stop-opacity=".45"/><stop offset="1" stop-color="#1c1f21" stop-opacity=".7"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g transform="translate(564 150)" fill="none" stroke="#fff" stroke-width="2.4">
    <rect x="0" y="0" width="72" height="80"/><path d="M20 0v56h32"/><path d="M52 80V24"/>
  </g>
  <text x="600" y="300" text-anchor="middle" fill="#fff" font-family="Georgia, 'Times New Roman', serif" font-size="30" letter-spacing="12">LIGNUM</text>
  <text x="600" y="392" text-anchor="middle" fill="#fff" font-family="Georgia, 'Times New Roman', serif" font-size="58">Кухни и шкафы на заказ</text>
  <text x="600" y="452" text-anchor="middle" fill="#CDAE85" font-family="Arial, sans-serif" font-size="20" letter-spacing="6">РАСЧЁТ ЦЕНЫ ОНЛАЙН ЗА 2 МИНУТЫ</text>
</svg>`;
	await sharp(path.join(RAW, 'hero.png'))
		.resize(1200, 630, { fit: 'cover' })
		.composite([{ input: Buffer.from(overlay) }])
		.jpeg({ quality: 82, mozjpeg: true })
		.toFile(path.join(root, 'static', 'og.jpg'));
	console.log('✓ og.jpg');
}
