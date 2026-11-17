declare global {
	namespace App {}
	interface Window {
		ym?: (id: number, method: string, ...args: unknown[]) => void;
	}
}

export {};
