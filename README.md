# sumaq-astro-base

Plantilla base de Astro 7 para sitios **estáticos** de Sumaq. CSS plano por proyecto + utilidades CMS (`sq-*`), MDX, icons, i18n, sitemap, robots.txt y plugins Vite de desarrollo.

## Crear un proyecto nuevo

```bash
pnpm create astro@latest -- --template elingan/sumaq-astro-base
cd <nombre-del-proyecto>
cp .env.example .env   # editar SITE_URL
pnpm install
pnpm dev
```

Renombra el campo `"name"` en `package.json` al crear el sitio.

## Comandos

| Comando | Acción |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo (`--host`, con QR en terminal) |
| `pnpm build` | Build estático en `./dist/` |
| `pnpm preview` | Preview local del build (`astro preview`) |

## Configuración incluida

- Astro 7, TypeScript strict, alias `@/*`
- Output estático (sin adapter)
- `@astrojs/sitemap` + `src/pages/robots.txt.ts` vía `SITE_URL`
- CSS plano: `global.css` (reset + tokens) + `cms-utils.css` (`sq-*`)
- `@astrojs/mdx`
- `astro-icon` (`src/assets/icons/`)
- i18n nativo: `de` (default, sin prefijo) y `en` (`/en/`)
- Fuentes Google vía `astro:assets` (`--font-inter`)
- Imágenes con `sharp`
- Dev: `vite-plugin-qrcode` + `vite-plugin-devtools-json`
- **Sin** Tailwind ni DaisyUI

## Estilos y CMS

| Archivo | Rol |
| --- | --- |
| `src/styles/global.css` | Reset ligero y tokens (`--color-*`, `--space-*`) |
| `src/styles/cms-utils.css` | Whitelist editable por CMS (`sq-align-*`, `sq-strong`, `sq-muted`, …) |
| CSS del sitio | Diseño del proyecto (p. ej. `site.css`); no utility soup |

El editor CMS solo debe emitir clases `sq-*` documentadas. Ampliar esa lista con criterio; no reintroducir Tailwind.

## Rutas de ejemplo (humo)

| Ruta | Qué verifica |
| --- | --- |
| `/` | Home DE, CSS, Font, Image, Icon, i18n, `sq-*` |
| `/en/` | Locale EN |
| `/demo/` | MDX + Icon + `sq-*` |

Sustituye estas páginas (y `demo.css`) al construir el sitio real.

## Variables de entorno

```bash
# .env
SITE_URL=https://tu-dominio.com
```

`SITE_URL` alimenta sitemap, robots.txt y URLs canónicas en build.

## Estructura

```text
/
├── cms/                 # Esquemas YAML del CMS
├── public/              # Assets estáticos, favicons
├── src/
│   ├── assets/          # Imágenes + icons/
│   ├── components/
│   ├── data/
│   ├── layouts/         # Base.astro, MdxBase.astro
│   ├── pages/           # Rutas (+ en/ para i18n)
│   └── styles/          # global.css, cms-utils.css, demo.css
├── astro.config.mjs
└── .env.example
```

## Despliegue

`pnpm build` genera HTML/CSS/JS en `dist/`. El hosting es externo a esta plantilla: publica el contenido de `dist/`.

## Flujo Sumaq

Punto de partida para **sumaq-site-builder**. No re-scaffoldear el andamiaje.

## Documentación

- [Astro](https://docs.astro.build)
- [i18n](https://docs.astro.build/en/guides/internationalization/)
- [Styling](https://docs.astro.build/en/guides/styling/)
- [MDX](https://docs.astro.build/en/guides/integrations-guide/mdx/)
