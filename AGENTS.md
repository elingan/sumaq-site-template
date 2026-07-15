# sumaq-astro-base

Plantilla base para sitios estáticos de Sumaq. No re-scaffoldear: extender sobre esta estructura.

## Desarrollo

Al iniciar el dev server, usar modo background:

```
astro dev --background
```

Gestionar con `astro dev stop`, `astro dev status` y `astro dev logs`.

## Despliegue

Modo híbrido en **Cloudflare Workers**: páginas estáticas + API routes on-demand (`prerender = false`).

```bash
SITE_URL=https://dominio.com pnpm deploy
```

| Variable | Cuándo | Dónde |
| --- | --- | --- |
| `SITE_URL` | Build (sitemap, robots.txt) | `.env` / CI |
| `BACKEND_URL` | Runtime (API routes) | `wrangler.jsonc` vars, `.dev.vars` o dashboard Cloudflare |

Wrangler genera la config de deploy en `dist/server/` tras el build. No sobrescribir `main` ni `assets` en `wrangler.jsonc`.

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

Cuando un sitio estático generado debe volverse editable:

1. Partir de esta plantilla (ya configurada).
2. Usar el skill `sumaq-site-builder` para generar componentes, `src/data/*.json` y `cms/*.yaml`.
3. No regenerar `package.json`, `astro.config.mjs` ni `wrangler.jsonc` salvo que el proyecto lo requiera.

## Documentación Astro

https://docs.astro.build

Guías relevantes:

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Componentes Astro](https://docs.astro.build/en/basics/astro-components/)
- [Framework components](https://docs.astro.build/en/guides/framework-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling / Tailwind](https://docs.astro.build/en/guides/styling/)
- [i18n](https://docs.astro.build/en/guides/internationalization/)
