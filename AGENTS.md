# sumaq-astro-base

Plantilla base para sitios **estáticos** de Sumaq. No re-scaffoldear: extender sobre esta estructura.

## Desarrollo

Al iniciar el dev server, usar modo background:

```
astro dev --background
```

Gestionar con `astro dev stop`, `astro dev status` y `astro dev logs`.

## Despliegue

Build estático → `dist/` → **Cloudflare Workers** (static assets vía Wrangler).

```bash
SITE_URL=https://dominio.com pnpm deploy
```

Workers Builds: build `pnpm build`, deploy `pnpm wrangler deploy`. Configurar subdominio `workers.dev` en el dashboard de Cloudflare para obtener URL temporal.

`SITE_URL` alimenta sitemap y `robots.txt` (build time, `.env` / CI).

## Estructura esperada

| Ruta | Uso |
| --- | --- |
| `src/pages/` | Rutas Astro |
| `src/components/` | Componentes por bloque de página |
| `src/layouts/` | Layouts compartidos |
| `src/data/` | JSON editable por CMS |
| `cms/` | Esquemas YAML del módulo PagesCMS |
| `public/` | Assets estáticos, `_headers`, favicons |

## Flujo con sumaq-site-builder

1. Partir de esta plantilla (ya configurada).
2. Usar el skill `sumaq-site-builder` para generar componentes, `src/data/*.json` y `cms/*.yaml`.
3. No regenerar `package.json`, `astro.config.mjs` ni `wrangler.jsonc` salvo que el proyecto lo requiera.

## Documentación Astro

https://docs.astro.build

Guías relevantes:

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Componentes Astro](https://docs.astro.build/en/basics/astro-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling / Tailwind](https://docs.astro.build/en/guides/styling/)
- [i18n](https://docs.astro.build/en/guides/internationalization/)
