import { PUBLIC_SITE_URL } from '$app/env/public';
import projects from '#lib/data/projects.json';

export const prerender = true;

export function GET() {
	const today = new Date().toISOString().slice(0, 10);
	const urls = [
		{ loc: '/', priority: '1.0' },
		...projects.map((p) => ({ loc: `/portfolio/${p.slug}`, priority: '0.7' })),
		{ loc: '/privacy', priority: '0.2' }
	];
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${PUBLIC_SITE_URL}${u.loc === '/' ? '/' : u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`;
	return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
