# Bitácora de decisiones

Registro histórico de decisiones y cambios de rumbo de este repositorio. **Solo se amplía:** las
entradas no se reescriben ni se ponen al día. El estado vigente está en `README.md` y `AGENTS.md`.

La historia del workflow de despliegue (Bunny Storage y su retirada, el slug como llave del job, las
cachés del build, la analítica opt-in por pareja, los permisos de los dominios de redirección, los
previews públicos) está en `infra-configuration` `amauta/decision-log.md`, entradas del 23, 24 y
25 ago, 16, 17, 22 y 23 sep y 12 nov de 2026. Aquí solo van las decisiones propias de la plantilla.
El porqué del kit de átomos está en `sumaq-packages` `amauta/decision-log.md`.

## 2026-08-12 · Plantilla Astro estática, con CSS plano

- **Decisión:** `sumaq-astro-base` pasa a ser un starter estático: fuera las herramientas de
  Cloudflare y Vercel, y Tailwind se sustituye por CSS plano.
- **Motivo:** no consta en el commit. La configuración específica de Cloudflare ya se había
  empezado a retirar el 15 jul 2026, en un commit que habla de simplificar el despliegue estático.
- **Sustituye a:** la plantilla con adaptador de Cloudflare, Astro Actions y Tailwind.
- **Fuente:** commits `a6ab3a9` y `c660940`.

## 2026-08-13 · Una sola plantilla, sobre `@sumaq/site-kit`

- **Decisión:** la plantilla delega la configuración en `defineSumaqSite()`, valida `content/`
  contra su schema en el build y fija `@sumaq/site-kit`, `astro` y `sharp` en versión exacta. Es la
  única plantilla de la que nacen los `www-*`; la de `sumaq-cli/templates/` se retira.
- **Motivo:** había dos plantillas divergentes. La versión exacta hace que actualizar un sitio sea
  un acto deliberado: con un rango, todos los sitios cambiarían solos en el siguiente build.
- **Sustituye a:** la configuración de Astro escrita en cada sitio y la plantilla empaquetada en
  `sumaq-cli`.
- **Fuente:** commit `3d34fe4`; `README.md` (reescrito en la limpieza de nov 2026).

## 2026-08-19 · Renombrado a `sumaq-site-template`; `schema/` y `content/`

- **Decisión:** el repositorio deja de llamarse `sumaq-astro-base`. El contrato del contenido vive
  en `schema/` (antes `cms/`) y los datos en `content/`. Se fija `packageManager` y se commitea
  `pnpm-lock.yaml`.
- **Motivo:** nombres definitivos del contrato. Sin `packageManager`, el `corepack enable` del
  workflow usa el pnpm que traiga la imagen del runner y el lockfile puede dejar de cuadrar con
  `--frozen-lockfile`.
- **Sustituye a:** `sumaq-astro-base` y la carpeta `cms/`.
- **Fuente:** commits `f471a0f`, `4a603e1` y `ddb9f5a`.

## 2026-08-20 · El workflow se hereda sin tocar; lo que cambia va en variables por nivel

- **Decisión:** `.gitea/workflows/deploy.yml` no lleva dominio ni URL incrustados y es idéntico en
  todos los sitios. El entorno se describe con variables de organización; el sitio, con variables
  de repo que escribe `sumaq-app`. El fichero vive en `.gitea/workflows/` y no en
  `.github/workflows/`.
- **Motivo:** una variable de sitio puesta en la organización daría a todos los repos los datos
  del primero. El `origin` de la plantilla es GitHub, y allí el workflow intentaría ejecutarse en
  cada push contra un runner que no existe.
- **Sustituye a:** —
- **Fuente:** commits `ddb9f5a` y `3536609`; `README.md` § Despliegue (reescrito en la limpieza de
  nov 2026).

## 2026-08-22 · Las imágenes van en `media/`, fuera de `public/`

- **Decisión:** las imágenes del sitio se guardan en `media/` en la raíz del repo, con
  `media/manifest.json` para lo que escribe el CMS; los adjuntos que no son imagen van a
  `public/files/`. El marcador de posición lo aporta el kit.
- **Motivo:** `public/media/` se copiaba literal: las imágenes salían sin optimizar y con nombre
  estable, así que cambiar una foto servía la vieja hasta la purga del CDN. Fuera de `public/`,
  Astro les pone hash de contenido y `srcset`.
- **Sustituye a:** `public/media/` y los marcadores de posición propios de cada sitio.
- **Fuente:** commit `7b1ca84`.

## 2026-08-31 · Dominios que solo redirigen, publicados por el workflow

- **Decisión:** el workflow publica una carpeta por cada dominio de `SITE_REDIRECTS`, con el
  destino en un fichero `_redirect` y un `index.html` de respaldo.
- **Motivo:** en el servidor de sitios un hostname es una carpeta: dar de alta un dominio de
  redirección no exige tocar la configuración del servidor.
- **Sustituye a:** —
- **Fuente:** commit `0b652d4`; cabecera de `.gitea/workflows/deploy.yml`.

## 2026-09-17 · Los idiomas del sitio los dicta `sumaq-app` por variables

- **Decisión:** `astro.config.mjs` lee `SITE_LOCALE` (idioma por defecto, sin prefijo, datos en la
  raíz de `content/`) y `SITE_LOCALES` (añadidos, cada uno bajo su prefijo y con datos en
  `content/<idioma>/`). Sin `SITE_LOCALES` no se configura i18n.
- **Motivo:** el idioma por defecto sin prefijo mantiene las URL de los sitios ya publicados y deja
  sus datos donde están; un sitio de un solo idioma se construye igual que antes.
- **Sustituye a:** la plantilla monolingüe (`de`), sin i18n en `defineSumaqSite()`.
- **Fuente:** commit `38c2065`.

## 2026-09-19 · Las secciones son del sitio

- **Decisión:** `Hero`, `Services` y `Contact` pasan del kit a `src/sections/`, compuestas con
  átomos de `@sumaq/site-kit` 1.x. `src/ui/` queda para envoltorios opcionales de átomos.
- **Motivo:** el kit dejó de traer bloques en la 1.0 (ver `sumaq-packages`
  `amauta/decision-log.md`).
- **Sustituye a:** los bloques del kit 0.x importados desde `src/pages/`.
- **Fuente:** commit `a1c5d88`.

## 2026-10-21 · Formulario de contacto

- **Decisión:** la sección de contacto incluye `ContactForm` del kit, con sus textos en el campo
  `form` de `schema/page.index.yaml`; el workflow pasa al build `SITE_FORMS_ORIGIN` y el slug.
- **Motivo:** el formulario solo se publica mientras el admin lo tenga activado en `sumaq-app`:
  sin la variable, el componente no emite nada.
- **Sustituye a:** —
- **Fuente:** commit `c5d6cd2`; cabecera de `.gitea/workflows/deploy.yml`.

## 2026-10-30 · Los datos de la consulta, en `content/profile.json`

- **Decisión:** nombre, profesión y contacto viven en `content/profile.json`, con su contrato en
  `schema/page.profile.yaml`. La sección de contacto los lee de ahí en vez de `contact.cards[]`, y
  el kit genera el JSON-LD del mismo fichero.
- **Motivo:** que lo que lee el buscador y lo que ve la persona no puedan contradecirse.
- **Sustituye a:** `contact.cards[]` en `content/index.json`.
- **Fuente:** commit `97f9ae0`; comentario de `src/sections/Contact.astro`.

## 2026-11-18 · Depuración de la documentación

- **Decisión:** `README.md` (para personas) y `AGENTS.md` (para agentes) dejan de repetirse y se
  ponen al día con el código: idiomas, `profile.json`, formulario, previews públicos y cómo nace un
  sitio. La tabla de variables del README se sustituye por un enlace a la cabecera de
  `.gitea/workflows/deploy.yml`, y la historia fechada que llevaba el README pasa a esta bitácora.
- **Motivo:** el README describía la plantilla del 22 sep 2026 (monolingüe, siete variables, el
  dominio derivado del nombre del repo) y duplicaba `AGENTS.md`.
- **Sustituye a:** —
- **Fuente:** auditoría de documentación del 18 nov 2026.
