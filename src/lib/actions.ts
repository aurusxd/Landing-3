import type { Action } from 'svelte/action';

const reduced = () =>
	typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Плавное появление блока при попадании в экран. Можно задать задержку: use:reveal={150} */
export const reveal: Action<HTMLElement, number | undefined> = (node, delay = 0) => {
	node.setAttribute('data-reveal', '');
	if (delay) node.style.setProperty('--d', `${delay}ms`);
	if (reduced() || !('IntersectionObserver' in window)) {
		node.classList.add('is-in');
		return;
	}
	const io = new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				if (e.isIntersecting) {
					node.classList.add('is-in');
					io.disconnect();
				}
			}
		},
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
	);
	io.observe(node);
	return { destroy: () => io.disconnect() };
};

/**
 * Параллакс на GSAP ScrollTrigger: элемент сдвигается на `y`/`x` процентов,
 * пока его секция проезжает через экран.
 */
export const parallax: Action<HTMLElement, { y?: number; x?: number; scale?: number } | undefined> = (
	node,
	opts = {}
) => {
	if (reduced()) return;
	let kill: (() => void) | undefined;
	let cancelled = false;
	(async () => {
		const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
		if (cancelled) return;
		gsap.registerPlugin(ScrollTrigger);
		const tween = gsap.fromTo(
			node,
			{ yPercent: -(opts.y ?? 0), xPercent: -(opts.x ?? 0), scale: opts.scale ?? 1 },
			{
				yPercent: opts.y ?? 0,
				xPercent: opts.x ?? 0,
				scale: 1,
				ease: 'none',
				scrollTrigger: {
					trigger: node.parentElement ?? node,
					start: 'top bottom',
					end: 'bottom top',
					scrub: 0.6
				}
			}
		);
		kill = () => {
			tween.scrollTrigger?.kill();
			tween.kill();
		};
	})();
	return {
		destroy() {
			cancelled = true;
			kill?.();
		}
	};
};
