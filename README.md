# sumaq-astro-base

Plantilla base de Astro para sitios estáticos de Sumaq. Incluye SEO (sitemap, robots.txt), fuentes, cache headers y despliegue en Cloudflare.

## Uso como plantilla

```bash
# Clonar o copiar el repo
git clone <url> mi-sitio
cd mi-sitio

# Instalar dependencias
pnpm install

# Configurar dominio
cp .env.example .env
# Editar SITE_URL en .env

# Desarrollo
pnpm dev
```

Al iniciar un proyecto nuevo, renombra el paquete en `package.json` y el worker en `wrangler.jsonc`.

## Estructura

```text
/
├── cms/                 # Esquemas YAML del CMS (generados por sumaq-site-builder)
├── public/              # Assets estáticos (_headers, favicons, etc.)
├── src/
│   ├── components/      # Componentes Astro por bloque
│   ├── data/            # Contenido JSON editable por CMS
│   ├── layouts/         # Layouts compartidos
│   └── pages/           # Rutas del sitio
├── astro.config.mjs
├── wrangler.jsonc       # Despliegue en Cloudflare (assets estáticos)
└── .env.example
```

## Comandos

| Comando | Acción |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo en `localhost:4321` |
| `pnpm build` | Build de producción en `./dist/` |
| `pnpm preview` | Previsualizar el build localmente |
| `pnpm deploy` | Build + despliegue en Cloudflare |

## Despliegue

Sitio estático en **Cloudflare Workers** (static assets). No requiere adaptador SSR.

```bash
SITE_URL=https://tu-dominio.com pnpm deploy
```

En CI/CD (Workers Builds):

- **Build command:** `pnpm build`
- **Deploy command:** `pnpm wrangler deploy`
- **Variable de entorno:** `SITE_URL`

## Incluido

- Astro 7 con TypeScript strict
- Sitemap automático (`@astrojs/sitemap`)
- `robots.txt` generado desde `SITE_URL`
- Fuente Inter vía `astro:assets`
- Cache inmutable para assets hasheados (`public/_headers`)

## Flujo Sumaq

Esta plantilla es el punto de partida para [sumaq-site-builder](https://github.com/sumaq): convierte un sitio estático generado en componentes Astro + datos JSON + esquemas CMS. El andamiaje (config, deploy, SEO) ya viene del template; no re-scaffoldear.

## Documentación

- [Astro](https://docs.astro.build)
- [Despliegue en Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/)
