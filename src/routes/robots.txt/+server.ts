import { PUBLIC_SITE_URL } from '$app/env/public';

export const prerender = true;

export function GET() {
	const host = new URL(PUBLIC_SITE_URL).host;
	return new Response(
		`User-agent: *
Allow: /

Host: ${host}
Sitemap: ${PUBLIC_SITE_URL}/sitemap.xml
`,
		{ headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
	);
}
