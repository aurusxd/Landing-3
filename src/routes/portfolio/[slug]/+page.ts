import { error } from '@sveltejs/kit';
import projects from '#lib/data/projects.json';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => projects.map((p) => ({ slug: p.slug }));

export const load: PageLoad = ({ params }) => {
	const index = projects.findIndex((p) => p.slug === params.slug);
	if (index === -1) error(404, 'Проект не найден');
	return {
		project: projects[index],
		prev: projects[(index - 1 + projects.length) % projects.length],
		next: projects[(index + 1) % projects.length]
	};
};
