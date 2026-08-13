// @ts-check
import { defineSumaqSite } from '@sumaq/site-kit/config';
import devtoolsJson from 'vite-plugin-devtools-json';
import { qrcode } from 'vite-plugin-qrcode';

// El kit aporta: salida estática, sitemap, imágenes responsive y la validación
// de `content/*.json` contra `cms/*.yaml` en `astro:build:start`. Si el contenido
// no cumple el schema, el build falla y no se publica nada.
export default defineSumaqSite({
	site: process.env.SITE_URL ?? 'https://example.com',
	image: {
		domains: [],
	},
	vite: {
		plugins: [qrcode(), devtoolsJson()],
	},
});
