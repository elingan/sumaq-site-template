import { env } from 'cloudflare:workers';

/** Simula un backend externo. Con BACKEND_URL en wrangler, llama a tu API real. */

let mockClicks = 0;

function getBackendUrl(): string | undefined {
	const url = env.BACKEND_URL?.trim();
	return url || undefined;
}

export async function getClickCount(): Promise<number> {
	const backendUrl = getBackendUrl();

	if (backendUrl) {
		const response = await fetch(`${backendUrl}/clicks`);
		if (!response.ok) {
			throw new Error('Backend GET /clicks failed');
		}
		const data = (await response.json()) as { clicks: number };
		return data.clicks;
	}

	return mockClicks;
}

export async function incrementClickCount(): Promise<number> {
	const backendUrl = getBackendUrl();

	if (backendUrl) {
		const response = await fetch(`${backendUrl}/clicks`, { method: 'POST' });
		if (!response.ok) {
			throw new Error('Backend POST /clicks failed');
		}
		const data = (await response.json()) as { clicks: number };
		return data.clicks;
	}

	mockClicks += 1;
	return mockClicks;
}
