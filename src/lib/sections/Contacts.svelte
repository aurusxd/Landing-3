<script lang="ts">
	import { fade } from 'svelte/transition';
	import Img from '#lib/components/Img.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { site } from '#lib/data/content.ts';
	import { phoneMask, phoneValid, sendLead } from '#lib/lead.ts';
	import { parallax, reveal } from '#lib/actions.ts';

	const MAX_MB = 4;
	const ACCEPT = '.pdf,.jpg,.jpeg,.png,.webp,.heic,.dwg,.dxf';

	let fileName = $state('');
	let dragging = $state(false);
	let sending = $state(false);
	let sent = $state(false);
	let error = $state('');
	let fileInput = $state<HTMLInputElement>()!;
	const mountedAt = Date.now();

	function pick(files: FileList | null | undefined) {
		const f = files?.[0];
		error = '';
		if (!f) return (fileName = '');
		if (f.size > MAX_MB * 1024 * 1024) {
			error = `Файл больше ${MAX_MB} МБ — пришлите его в Telegram после звонка`;
			fileInput.value = '';
			return (fileName = '');
		}
		fileName = f.name;
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		if (e.dataTransfer?.files?.length) {
			fileInput.files = e.dataTransfer.files;
			pick(e.dataTransfer.files);
		}
	}

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		const form = e.currentTarget as HTMLFormElement;
		const fd = new FormData(form);
		error = '';
		if (!String(fd.get('name')).trim()) return (error = 'Как к вам обращаться?');
		if (!phoneValid(String(fd.get('phone')))) return (error = 'Проверьте номер телефона');
		if (!fd.get('consent')) return (error = 'Нужно согласие на обработку данных');
		if (!fileName) fd.delete('file');
		fd.set('elapsed', String(Date.now() - mountedAt));
		sending = true;
		const res = await sendLead(fd, 'contacts');
		sending = false;
		if (res.ok) {
			sent = true;
			form.reset();
			fileName = '';
		} else error = res.error;
	}
</script>

<section id="contacts" class="relative overflow-hidden bg-paper py-24 md:py-36" aria-labelledby="contacts-title">
	<div class="bg-word top-10 left-1/2 -translate-x-1/2 text-graphite" aria-hidden="true">
		<span class="block" data-word="Контакты" use:parallax={{ x: 5 }}></span>
	</div>

	<div class="container-x relative grid items-start gap-16 lg:grid-cols-2 lg:gap-24">
		<div class="frame frame-left mx-auto hidden w-full max-w-md lg:block" use:reveal>
			<Img name="contacts" alt="Шоурум Lignum с образцами материалов" sizes="40vw" class="relative aspect-[4/5]" />
			<div class="absolute -right-10 bottom-10 bg-graphite p-7 text-white shadow-2xl">
				<p class="eyebrow text-wood-light">Шоурум</p>
				<p class="mt-3 font-serif text-xl">{site.street}</p>
				<p class="mt-1 text-sm text-white/65">{site.hours}</p>
			</div>
		</div>

		<div use:reveal={120}>
			<p class="eyebrow eyebrow-line text-muted">Контакты</p>
			<h2 id="contacts-title" class="display mt-6 text-[clamp(2.25rem,4.6vw,3.75rem)]">
				Обсудим <span class="script text-[1.1em] text-wood">ваш проект</span>
			</h2>
			<p class="mt-5 max-w-md text-muted">Пришлите план помещения или фото — подготовим предварительный расчёт до замера.</p>

			<div class="mt-8 grid gap-6 border-y border-line py-6 sm:grid-cols-2">
				<div>
					<p class="eyebrow !text-[0.6rem] text-muted">Телефон</p>
					<a href={site.phoneHref} class="mt-1 block font-serif text-2xl hover:text-wood">{site.phone}</a>
				</div>
				<div>
					<p class="eyebrow !text-[0.6rem] text-muted">Почта</p>
					<a href="mailto:{site.email}" class="mt-1 block font-serif text-2xl hover:text-wood">{site.email}</a>
				</div>
				<div class="sm:col-span-2 lg:hidden">
					<p class="eyebrow !text-[0.6rem] text-muted">Шоурум</p>
					<p class="mt-1">{site.address}, {site.hours.toLowerCase()}</p>
				</div>
			</div>

			{#if sent}
				<div class="py-12" in:fade>
					<p class="script text-6xl text-wood">Спасибо!</p>
					<p class="mt-4 max-w-sm text-muted">Заявка у нас. Перезвоним в течение 15 минут в рабочее время.</p>
					<button type="button" class="link-circle mt-8 ml-4" onclick={() => (sent = false)}><span class="dash"></span>Отправить ещё</button>
				</div>
			{:else}
				<form class="relative mt-8" onsubmit={submit} novalidate>
					<div class="grid gap-2 sm:grid-cols-2 sm:gap-6">
						<label class="block"><span class="sr-only">Имя</span><input name="name" class="field" placeholder="Ваше имя" autocomplete="name" required maxlength="80" /></label>
						<label class="block"><span class="sr-only">Телефон</span><input name="phone" type="tel" class="field" placeholder="+7 (___) ___-__-__" autocomplete="tel" required use:phoneMask /></label>
					</div>
					<label class="mt-2 block"><span class="sr-only">Комментарий</span><textarea name="comment" rows="3" class="field resize-none" placeholder="Что хотите сделать? Размеры, пожелания, сроки" maxlength="1500"></textarea></label>

					<label
						class="mt-6 flex cursor-pointer items-center gap-4 border border-dashed p-5 transition {dragging ? 'border-wood bg-white' : 'border-line hover:border-wood-light'}"
						ondragover={(e) => {
							e.preventDefault();
							dragging = true;
						}}
						ondragleave={() => (dragging = false)}
						ondrop={onDrop}
					>
						<span class="grid size-11 shrink-0 place-items-center rounded-full bg-sand text-wood-dark"><Icon name="upload" size={18} /></span>
						<span class="min-w-0 flex-1 text-sm">
							{#if fileName}
								<span class="block truncate text-ink">{fileName}</span>
								<span class="text-xs text-muted">Нажмите, чтобы заменить</span>
							{:else}
								<span class="block text-ink">План помещения</span>
								<span class="text-xs text-muted">PDF, JPG, PNG, DWG — до {MAX_MB} МБ. Перетащите или нажмите</span>
							{/if}
						</span>
						<input bind:this={fileInput} type="file" name="file" accept={ACCEPT} class="sr-only" onchange={(e) => pick(e.currentTarget.files)} />
					</label>

					<div class="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
						<label>Ваш сайт <input name="website" tabindex="-1" autocomplete="off" /></label>
					</div>

					<label class="mt-5 flex items-start gap-3 text-xs text-muted">
						<input type="checkbox" name="consent" class="mt-0.5 size-4 accent-graphite" />
						<span>Согласен на обработку персональных данных по <a href="/privacy" class="underline underline-offset-2 hover:text-ink">политике конфиденциальности</a></span>
					</label>
					{#if error}<p class="mt-4 text-sm text-[#a5452f]" role="alert">{error}</p>{/if}
					<button type="submit" class="btn btn-dark mt-7 w-full sm:w-auto" disabled={sending}>{sending ? 'Отправляем…' : 'Отправить заявку'}</button>
				</form>
			{/if}
		</div>
	</div>
</section>
