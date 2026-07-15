import type { APIRoute } from 'astro';
import { getClickCount, incrementClickCount } from '../../server/backend/clicks';

export const prerender = false;

export const GET: APIRoute = async () => {
	try {
		const clicks = await getClickCount();
		return Response.json({ clicks });
	} catch {
		return Response.json({ error: 'No se pudo obtener el contador' }, { status: 502 });
	}
};

export const POST: APIRoute = async () => {
	try {
		const clicks = await incrementClickCount();
		return Response.json({ clicks });
	} catch {
		return Response.json({ error: 'No se pudo registrar el click' }, { status: 502 });
	}
};
