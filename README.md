# sumaq-astro-base

Plantilla base de Astro para sitios estáticos de Sumaq. Incluye SEO (sitemap, robots.txt), fuentes, imágenes optimizadas y cache headers.

## Uso como plantilla

```bash
git clone <url> mi-sitio
cd mi-sitio
pnpm install
cp .env.example .env   # editar SITE_URL
pnpm dev
```

Al iniciar un proyecto nuevo, renombra el paquete en `package.json` y el worker en `wrangler.jsonc`.

## Estructura

```text
/
├── cms/                 # Esquemas YAML del CMS (generados por sumaq-site-builder)
├── public/              # Assets estáticos (_headers, favicons, etc.)
├── src/
│   ├── assets/          # Imágenes locales optimizables con <Image />
│   ├── components/      # Componentes Astro por bloque
│   ├── data/            # Contenido JSON editable por CMS
│   ├── layouts/         # Layouts compartidos
│   └── pages/           # Rutas del sitio
├── astro.config.mjs
├── wrangler.jsonc       # Deploy estático en Cloudflare Workers
└── .env.example
```

## Comandos

| Comando | Acción |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo en `localhost:4321` |
| `pnpm build` | Build de producción en `./dist/` |
| `pnpm preview` | Build + preview local con Wrangler |
| `pnpm deploy` | Build + deploy en Cloudflare Workers |

## Despliegue

Sitio estático en **Cloudflare Workers** (static assets). Sin adaptador Astro — solo HTML/CSS/JS en `dist/`.

```bash
SITE_URL=https://tu-dominio.com pnpm deploy
```

En **Workers Builds** (GitHub):

| Campo | Valor |
| --- | --- |
| Build command | `pnpm install && pnpm build` |
| Deploy command | `pnpm wrangler deploy` |
| Variable | `SITE_URL` |

Renombra `"name"` en `wrangler.jsonc` al crear un proyecto nuevo.

## Incluido

- Astro 7 con TypeScript strict
- Sitemap automático (`@astrojs/sitemap`)
- `robots.txt` generado desde `SITE_URL`
- Fuente Inter vía `astro:assets`
- Optimización de imágenes con `<Image />` (`sharp`)
- Cache inmutable para assets hasheados (`public/_headers`)

## Flujo Sumaq

Punto de partida para **sumaq-site-builder**: convierte un sitio estático generado en componentes Astro + datos JSON + esquemas CMS. No re-scaffoldear el andamiaje.

## Documentación

- [Astro](https://docs.astro.build)
- [Despliegue](https://docs.astro.build/en/guides/deploy/)
