// @ts-check
import { defineSumaqSite } from '@sumaq/site-kit/config';
import devtoolsJson from 'vite-plugin-devtools-json';
import { qrcode } from 'vite-plugin-qrcode';

/**
 * Los idiomas los dicta sumaq-app por variables de Actions, no este fichero.
 *
 * `SITE_LOCALE` es el idioma por defecto —se sirve sin prefijo y sus datos viven
 * en la raíz de `content/`— y `SITE_LOCALES` son los añadidos, separados por `;`,
 * cada uno bajo su prefijo y leyendo de `content/<idioma>/`.
 *
 * Sin `SITE_LOCALES` no se configura i18n en absoluto: un sitio de un solo idioma
 * se construye exactamente igual que antes de que esto existiera, que es el caso
 * de casi todos.
 */
const defaultLocale = process.env.SITE_LOCALE ?? 'de';
const extraLocales = (process.env.SITE_LOCALES ?? '').split(';').filter(Boolean);

// El kit aporta: salida estática, sitemap, imágenes responsive y la validación
// de `content/*.json` contra `schema/*.yaml` en `astro:build:start`. Si el contenido
// no cumple el schema, el build falla y no se publica nada.
export default defineSumaqSite({
	site: process.env.SITE_URL ?? 'https://example.com',
	i18n:
		extraLocales.length > 0
			? { defaultLocale, locales: [defaultLocale, ...extraLocales] }
			: undefined,
	image: {
		domains: [],
	},
	vite: {
		plugins: [qrcode(), devtoolsJson()],
	},
});
