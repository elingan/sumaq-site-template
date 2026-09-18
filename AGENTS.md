# sumaq-site-template

Plantilla única de los sitios `www-*` de cliente. Astro 7 estático sobre
`@sumaq/site-kit`. **No re-scaffoldear**: extender sobre esta estructura.

## La regla que no se rompe

**Las secciones son de este sitio; el kit aporta átomos.** Cada bloque del schema tiene su
sección en `src/sections/`, con el marcado y las clases que pida el diseño, compuesta con
átomos de `@sumaq/site-kit` (`Section`, `SectionHeader`, `Text`, `Heading`, `Button`,
`Actions`, `DataList`, `TagList`, `ContactLinks`, `Media`). Tres reglas:

1. Si el átomo existe, se usa: no se reescribe su lógica (vacío, `tel:`, imágenes).
2. **Un átomo del kit no se copia al repo**: se extiende por props o slot, o se envuelve
   en `src/ui/`.
3. Si falta un átomo, se escribe en el sitio; si un segundo sitio lo necesita, se
   propone subirlo al kit.

Sus props, derivadas del código: `node_modules/@sumaq/site-kit/src/tokens/component-props.json`.

En este repo hay seis cosas propias:

| Qué | Dónde |
| --- | --- |
| Contenido | `content/*.json` |
| Contrato del contenido | `schema/*.yaml` |
| Imágenes y adjuntos | `media/*`, `public/files/*` |
| Secciones | `src/sections/*.astro` |
| Composición de la página | `src/pages/*.astro` |
| Diseño | `src/styles/site.css` |

`.gitea/workflows/deploy.yml` **no** es una de ellas: se hereda tal cual y es idéntico en
los ~100 sitios. Si un despliegue necesita algo distinto, se arregla ahí y lo heredan
todos.

## Añadir una página

1. `schema/page.<nombre>.yaml` — el contrato. Identificadores (`name`) en inglés,
   etiquetas (`label`) en el idioma de la clienta. Marca `required: true` en todo campo
   sin el cual la página queda rota.
2. `content/<nombre>.json` — los datos, con la misma forma.
3. `src/sections/<Bloque>.astro` — una sección por bloque nuevo, compuesta con átomos.
4. `src/pages/<nombre>.astro` — importa las secciones y les pasa su rama del JSON.
5. Estilos nuevos en `site.css`, con las clases que hayas puesto en las secciones.

El build valida 2 contra 1 y, al terminar, `sumaq-check-site` comprueba el HTML (`lang`,
un `h1`, `alt`, `canonical`, ningún elemento vacío, secciones etiquetadas). Falla si algo
no cuadra.

## Desarrollo

```bash
pnpm dev      # astro dev --host, con QR
pnpm build    # valida contenido y emite dist/
```

Al iniciar el dev server, usar modo background:

```
astro dev --background
```

Gestionar con `astro dev stop`, `astro dev status` y `astro dev logs`.

## Imágenes

`media/` en la raíz, **nunca `public/media/`**: fuera de `public/` es donde Astro las
procesa (hash + `srcset`). El string de `content/*.json` (`/media/x-a3f9c1d2.webp`) es una
**clave, no una URL** — renderiza con `<Media>` del kit; interpolarla en un `src=` da un
404 silencioso, y el build lo caza. Adjuntos no-imagen a `public/files/` (`/files/x.pdf`),
que sí necesitan URL estable. El placeholder lo pone el kit con `<Media fallback />`.

## Estilos

- **Reset y `sq-*` del kit**: los trae `@sumaq/site-kit/tokens.css`. No redefinir aquí.
  Las clases de las secciones son del sitio.
- **Tokens del sitio**: `:root` en `global.css`. El kit espera al menos `--color-text`,
  `--color-bg`, `--color-muted`, `--color-accent`.
- **Diseño**: `site.css`, CSS plano. Sin Tailwind ni DaisyUI.

## Átomos disponibles en el kit

`Text`, `Heading`, `Button`, `Actions`, `DataList`, `TagList`, `ContactLinks`, `Media`,
`Prose`, más `Section` / `SectionHeader` / `SectionHeading`, `Base`, `Seo` y
`BlockRenderer` (sin catálogo propio: recibe el mapa `type → sección` del sitio).
`data-cms` es opcional: los átomos lo escriben si se les pasa `cms`, y nada lo consume hoy.

## Versiones

Versión exacta sin `^` para `@sumaq/site-kit`, `astro` y `sharp`, y `pnpm-lock.yaml`
commiteado. `sharp` va como dependencia directa del sitio aunque el kit lo declare como
peer: Astro lo resuelve desde la raíz del proyecto que construye.

`packageManager` fija la versión de pnpm. Sin él, el `corepack enable` del workflow usa la
que traiga la imagen del runner y el formato del lockfile puede dejar de cuadrar con
`--frozen-lockfile`.

**El lockfile se regenera sin el enlace local del kit.** En desarrollo `@sumaq/site-kit`
suele estar enlazado desde `sumaq-packages` (`scripts/link-into.sh`); un
`pnpm install --lockfile-only` sobre ese `node_modules` grabaría un `link:` que en CI no
resuelve. Hazlo en una copia limpia:

```bash
tmp=$(mktemp -d) && cp package.json pnpm-workspace.yaml .node-version "$tmp/" \
  && (cd "$tmp" && pnpm install --lockfile-only) && cp "$tmp/pnpm-lock.yaml" .
```

## Despliegue

Lo hace `.gitea/workflows/deploy.yml`, heredado sin cambios. El entorno lo dice
`SITE_DEPLOY_TARGET`, variable de **organización** (`docroot` en el lab, `sites` en
`kallpa-server`). El sitio lo dicen `SITE_DOMAIN` y `SITE_URL`, variables de **repo** que
escribe `sumaq-app` al fijar el dominio; sin ellas el dominio se deriva del nombre del repo
(`www-demo-graz-at` → `demo-graz.at`) y la URL cae a la del lab. Ambos runners responden a
la label `sumaq-site`. Detalle en el [README](README.md#despliegue).

## Documentación Astro

https://docs.astro.build — [Routing](https://docs.astro.build/en/guides/routing/) ·
[Componentes](https://docs.astro.build/en/basics/astro-components/) ·
[Styling](https://docs.astro.build/en/guides/styling/)
