// Скачивает шрифты Google Fonts (кириллица + латиница) в static/fonts и пишет src/lib/styles/fonts.css
import fs from 'node:fs/promises';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const url = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Manrope:wght@300..600&family=Great+Vibes&display=swap';
const css = await (await fetch(url, { headers: { 'User-Agent': UA } })).text();
const blocks = css.split(/(?=\/\* )/).filter((b) => /^\/\* (cyrillic|latin) \*\//.test(b));
let out = '';
for (const b of blocks) {
  const src = b.match(/url\((https:[^)]+)\)/)[1];
  const fam = b.match(/font-family: '([^']+)'/)[1].replace(/\s/g, '');
  const style = b.match(/font-style: (\w+)/)[1];
  const weight = b.match(/font-weight: ([\d ]+);/)[1].replace(' ', '-');
  const subset = b.match(/^\/\* (\w+)/)[1];
  const file = `${fam}-${style}-${weight}-${subset}.woff2`.toLowerCase();
  await fs.writeFile(`static/fonts/${file}`, Buffer.from(await (await fetch(src)).arrayBuffer()));
  out += b.replace(src, `/fonts/${file}`);
}
await fs.mkdir('src/lib/styles', { recursive: true });
await fs.writeFile('src/lib/styles/fonts.css', out.trim() + '\n');
console.log(blocks.length, 'faces');
