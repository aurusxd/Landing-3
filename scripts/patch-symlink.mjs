// @ts-nocheck — служебный патч для сборки, типы Node в проекте не подключены
/**
 * Windows-фикс для adapter-vercel.
 *
 * Adapter создаёт симлинки для serverless-функций. Windows без включённого режима
 * разработчика запрещает симлинки (EPERM), и сборка падала. Здесь мы подменяем
 * только неудачный вызов на junction — он разрешён обычному пользователю.
 * На Linux/Vercel патч ничего не делает.
 */
import fs from 'node:fs';
import path from 'node:path';

if (process.platform === 'win32') {
	const original = fs.symlinkSync.bind(fs);
	fs.symlinkSync = (target, linkPath, type) => {
		try {
			return original(target, linkPath, type);
		} catch (error) {
			const code = error && error.code;
			if (code !== 'EPERM' && code !== 'EACCES') throw error;
			try {
				fs.rmSync(linkPath, { force: true });
			} catch {}
			const absolute = path.resolve(path.dirname(String(linkPath)), String(target));
			return original(absolute, linkPath, 'junction');
		}
	};
}
