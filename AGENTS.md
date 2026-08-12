# sumaq-astro-base

Plantilla base para sitios **estáticos** de Sumaq. No re-scaffoldear: extender sobre esta estructura.

## Crear desde la plantilla

```bash
pnpm create astro@latest -- --template elingan/sumaq-astro-base
```

## Desarrollo

Al iniciar el dev server, usar modo background:

```
astro dev --background
```

Gestionar con `astro dev stop`, `astro dev status` y `astro dev logs`.

Scripts del proyecto: `pnpm dev` (`astro dev --host`), `pnpm build`, `pnpm preview`.

## Despliegue

Build estático → `dist/` → publicar en el hosting del cliente (sin adapter Astro).

```bash
SITE_URL=https://dominio.com pnpm build
```

`SITE_URL` alimenta sitemap y `robots.txt` (build time, `.env` / CI).

## Estilos

- **Diseño del sitio:** CSS plano por proyecto (tokens en `global.css`, estilos en p. ej. `site.css`).
- **Retoques CMS:** solo clases `sq-*` de `cms-utils.css` (alineación, strong, muted, etc.).
- **No** Tailwind ni DaisyUI en esta plantilla.

## Estructura esperada

| Ruta | Uso |
| --- | --- |
| `src/pages/` | Rutas Astro (+ `en/` para i18n) |
| `src/components/` | Componentes por bloque de página |
| `src/layouts/` | Layouts compartidos |
| `src/styles/` | `global.css`, `cms-utils.css`, CSS del sitio |
| `src/assets/icons/` | SVG para `astro-icon` |
| `src/data/` | JSON editable por CMS |
| `cms/` | Esquemas YAML del módulo PagesCMS |
| `public/` | Assets estáticos, favicons |

## Flujo con sumaq-site-builder

1. Partir de esta plantilla (ya configurada).
2. Usar el skill `sumaq-site-builder` para generar componentes, `src/data/*.json` y `cms/*.yaml`.
3. No regenerar `package.json` ni `astro.config.mjs` salvo que el proyecto lo requiera.
4. El CMS solo debe permitir clases `sq-*` de la whitelist.

## Documentación Astro

https://docs.astro.build

Guías relevantes:

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Componentes Astro](https://docs.astro.build/en/basics/astro-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling](https://docs.astro.build/en/guides/styling/)
- [i18n](https://docs.astro.build/en/guides/internationalization/)
- [MDX](https://docs.astro.build/en/guides/integrations-guide/mdx/)
