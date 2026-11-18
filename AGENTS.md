# sumaq-site-template

Plantilla única de los sitios `www-*` de cliente: Astro estático sobre `@sumaq/site-kit`.
**No re-scaffoldear**: se extiende sobre esta estructura. Qué es, cómo nace un sitio, idiomas y
despliegue están en el [README](README.md); aquí van las reglas para editar.

## La regla que no se rompe

**Las secciones son de este sitio; el kit aporta átomos.** Cada bloque del schema tiene su sección
en `src/sections/`, con el marcado y las clases que pida el diseño, compuesta con átomos de
`@sumaq/site-kit`.

1. Si el átomo existe, se usa: no se reescribe su lógica (vacío, `tel:`, imágenes, formulario).
2. **Un átomo del kit no se copia al repo**: se extiende por props o slot, o se envuelve en
   `src/ui/` (ver [`src/ui/README.md`](src/ui/README.md)).
3. Si falta un átomo, se escribe en el sitio; si un segundo sitio lo necesita, se propone subirlo
   al kit.

Qué átomos hay lo dice el README del kit; sus props, derivadas del código, están en
`node_modules/@sumaq/site-kit/src/tokens/component-props.json`.

## Qué es propio de un sitio

| Qué | Dónde |
| --- | --- |
| Contenido | `content/*.json` |
| Contrato del contenido | `schema/*.yaml` |
| Imágenes y adjuntos | `media/*`, `public/files/*` |
| Secciones | `src/sections/*.astro` |
| Composición de la página | `src/pages/*.astro` |
| Diseño | `src/styles/site.css` |

**No lo son**, y no se editan en un sitio:

- `.gitea/workflows/deploy.yml`: se hereda tal cual y es idéntico en todos los sitios. Si un
  despliegue necesita algo distinto, se arregla en la plantilla y lo heredan todos.
- Idiomas, dominio, URL y analítica: llegan por variables que escribe `sumaq-app`. No se incrustan
  en `astro.config.mjs` ni en el contenido.

## Añadir una página

1. `schema/page.<nombre>.yaml`: el contrato. Identificadores (`name`) en inglés, etiquetas
   (`label`) en el idioma de la clienta. Marca `required: true` en todo campo sin el cual la página
   queda rota.
2. `content/<nombre>.json`: los datos, con la misma forma.
3. `src/sections/<Bloque>.astro`: una sección por bloque nuevo, compuesta con átomos.
4. `src/pages/<nombre>.astro`: importa las secciones y les pasa su rama del JSON.
5. Estilos nuevos en `site.css`, con las clases que hayas puesto en las secciones.

`pnpm build` valida 2 contra 1 y, al terminar, `sumaq-check-site` comprueba el HTML de `dist/`.
Falla si algo no cuadra: no se da una página por hecha sin un build en verde.

## `content/profile.json`

Página reservada con los datos de la consulta (nombre, profesión, contacto); su contrato es
`schema/page.profile.yaml` y no tiene ruta. No se duplican esos datos en otra página: la sección
que los necesite los lee con `loadProfile(Astro.currentLocale)` de
`@sumaq/site-kit/structured-data`, como hace `src/sections/Contact.astro`. El JSON-LD lo genera el
kit desde ese fichero; no se escribe a mano.

## Formulario de contacto

Se usa `ContactForm` del kit, con los textos en un campo `form` del schema (el de `contact` en
`schema/page.index.yaml` sirve de modelo). No se escribe un `<form>` propio ni se pone un correo
de destino en el sitio. El componente no emite nada si el build no recibe el origen de `sumaq-app`,
así que la sección tiene que quedar bien también sin él.

## Imágenes

- `media/` en la raíz, **nunca `public/media/`**: fuera de `public/` es donde Astro las procesa.
- La cadena de `content/*.json` (`/media/x-a3f9c1d2.webp`) es una **clave, no una URL**: se pinta
  con `<Media>` del kit. Interpolarla en un `src=` da un 404 silencioso, y el build lo detecta.
- Adjuntos que no son imagen, a `public/files/` (`/files/x.pdf`).
- El marcador de posición lo pone el kit con `<Media fallback />`; no se añade uno al repo.

## Estilos

- **Reset y `sq-*` del kit**: los trae `@sumaq/site-kit/tokens.css`. No se redefinen. Las clases
  de las secciones son del sitio.
- **Tokens del sitio**: `:root` en `global.css`. El kit espera al menos `--color-text`,
  `--color-bg`, `--color-muted` y `--color-accent`.
- **Diseño**: `site.css`, CSS plano. Sin Tailwind ni DaisyUI.

## Versiones y lockfile

`@sumaq/site-kit`, `astro` y `sharp` van en versión exacta, sin `^`, y `pnpm-lock.yaml` se
commitea. `packageManager` fija la versión de pnpm: sin él, el `corepack enable` del workflow usa
la que traiga la imagen del runner y el lockfile puede dejar de cuadrar con `--frozen-lockfile`.

**El lockfile se regenera sin el enlace local del kit.** En desarrollo `@sumaq/site-kit` puede
estar enlazado desde `sumaq-packages` (`scripts/link-into.sh`); un `pnpm install --lockfile-only`
sobre ese árbol grabaría un `link:` que el runner no resuelve. Se hace en una copia limpia:

```bash
tmp=$(mktemp -d) && cp package.json pnpm-workspace.yaml .node-version "$tmp/" \
  && (cd "$tmp" && pnpm install --lockfile-only) && cp "$tmp/pnpm-lock.yaml" .
```

## Despliegue

Lo hace `.gitea/workflows/deploy.yml`; su cabecera es la lista completa de variables. Dos cosas que
conviene no confundir:

- Sin `SITE_SLUG` el job no se ejecuta: un repositorio recién generado no publica nada.
- Sin `SITE_DOMAIN` el dominio se deriva **del slug**, no del nombre del repositorio
  (`demo-graz-at` → `demo-graz.at`). Sin `SITE_URL`, la URL es la del laboratorio solo cuando el
  destino es `docroot`; con destino `sites` es `https://<dominio>/`.
