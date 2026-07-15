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
│   ├── assets/          # Imágenes locales optimizables con <Image />
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
- Optimización de imágenes con `<Image />` (`sharp`) — local y remota
- Cache inmutable para assets hasheados (`public/_headers`)

## Imágenes

El componente [`<Image />`](https://docs.astro.build/en/guides/images/) de `astro:assets` optimiza imágenes en el build (WebP, dimensiones, lazy loading).

### Local (`src/assets/`)

Importa el archivo y pásalo a `src`:

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<Image src={heroImage} alt="Descripción" width={800} height={450} />
```

Ver ejemplo en `src/pages/index.astro`.

### Remota (URL pública)

Para optimizar imágenes externas, autoriza el dominio en `astro.config.mjs`:

```js
export default defineConfig({
  image: {
    domains: ['images.unsplash.com'],
  },
});
```

Luego usa la URL completa con `width` y `height` (obligatorios si no usas `inferSize`):

```astro
<Image
  src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=450&fit=crop"
  alt="Paisaje de montaña"
  width={800}
  height={450}
/>
```

Solo se optimizan dominios listados en `image.domains` o `image.remotePatterns`. Para añadir un CDN o CMS, agrega su hostname a esa configuración.

Documentación: [Imágenes en Astro](https://docs.astro.build/en/guides/images/) · [Dominios remotos](https://docs.astro.build/en/guides/images/#authorizing-remote-images)

## Flujo Sumaq

Esta plantilla es el punto de partida para [sumaq-site-builder](https://github.com/sumaq): convierte un sitio estático generado en componentes Astro + datos JSON + esquemas CMS. El andamiaje (config, deploy, SEO) ya viene del template; no re-scaffoldear.

## Documentación

- [Astro](https://docs.astro.build)
- [Despliegue en Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/)
