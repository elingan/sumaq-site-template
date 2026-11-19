# sumaq-site-template

Plantilla **única** de la que nace cada repositorio `www-*` de cliente. Es un sitio Astro estático
sobre [`@sumaq/site-kit`](https://github.com/elingan/sumaq-packages/tree/main/packages/site-kit):
el kit trae la configuración, el layout y los **átomos**; este repositorio trae el contenido, **las
secciones**, la composición de la página y el diseño.

Las reglas para quien edita un sitio (personas o agentes) están en [`AGENTS.md`](AGENTS.md); la
historia de las decisiones, en [`amauta/decision-log.md`](amauta/decision-log.md).

## Qué aporta cada lado

| | Dónde vive | Qué es |
| --- | --- | --- |
| Configuración de Astro, sitemap, validación del contenido | `@sumaq/site-kit/config` | `defineSumaqSite()` |
| Layout, cabecera, pie, SEO, datos estructurados | `@sumaq/site-kit` | `Base`, `Seo` y el chrome |
| Átomos (`Text`, `Heading`, `Button`, `Media`, `ContactForm`…) | `@sumaq/site-kit` | la lógica común: regla de vacío, enlaces, imágenes, accesibilidad |
| Reglas comunes sobre `dist/` | `sumaq-check-site` | se ejecuta al terminar el build |
| Reset CSS y clases `sq-*` | `@sumaq/site-kit/tokens.css` | lo que emiten `Section`, el chrome y los átomos |
| **Contenido** | `content/*.json` | lo que edita la clienta |
| **Contrato del contenido** | `schema/*.yaml` | lo que validan el editor y el build |
| **Secciones** | `src/sections/*.astro` | el marcado de cada bloque, compuesto con átomos |
| **Composición de la página** | `src/pages/*.astro` | qué secciones y en qué orden |
| **Diseño** | `src/styles/site.css` | propio de cada sitio |

La regla que sostiene el modelo: **las secciones son del sitio y el kit aporta átomos**. Un átomo
se usa o se envuelve, pero no se copia. El catálogo de átomos y sus reglas están en el README del
kit (`sumaq-packages` `packages/site-kit/README.md`).

## Cómo nace un sitio

Un sitio no se crea a mano. Hay dos caminos, y los dos parten de esta plantilla:

- **`sumaq-app`** genera el repositorio `www-*` en Gitea a partir de la plantilla, que tiene que
  estar publicada en la organización y marcada como plantilla (`CMS_SITE_TEMPLATE_REPO`). El
  repositorio nace privado y con todo el contenido de `main`, incluido el workflow de despliegue.
  Después la app escribe en él las variables de Actions que lo identifican.
- **`sumaq-studio`** copia la plantilla en la carpeta del proyecto cuando esta todavía no es un
  sitio: sin `.git`, sin pisar lo que ya exista, y con el `name` de `package.json` cambiado al de la
  carpeta. El origen es el repositorio de GitHub, o lo que diga `SUMAQ_SITE_TEMPLATE`.

Recién generado, el repositorio aún no es el sitio de nadie: el workflow no construye nada hasta
que `sumaq-app` escribe `SITE_SLUG`.

## Trabajar en local

```bash
pnpm install
pnpm dev        # servidor de desarrollo, accesible en la red local y con QR en la terminal
pnpm build      # valida el contenido y emite dist/
pnpm preview    # sirve el build
```

`astro.config.mjs` lee `SITE_URL`, `SITE_LOCALE` y `SITE_LOCALES` del entorno del proceso. Sin
`SITE_URL` el sitio se construye con `https://example.com`. Las variables de analítica están
descritas en [`.env.example`](.env.example).

Para desarrollar el kit y el sitio a la vez se enlaza el kit local con `scripts/link-into.sh` de
`sumaq-packages`. Con el enlace puesto no se regenera el lockfile (ver
[`AGENTS.md`](AGENTS.md#versiones-y-lockfile)).

## La puerta de validación

`defineSumaqSite()` contrasta cada `content/*.json` con su `schema/*.yaml` **antes** de generar
páginas. Si un campo marcado `required: true` está vacío, el build falla y no se publica nada:

```
✗ content/index.json no cumple schema/page.index.yaml

  hero.title             Titel is required

  El sitio no se ha publicado. No se ha subido nada al servidor.
```

Un schema sin campos obligatorios deja la puerta en decorativa: solo atraparía un error de
estructura, no el caso frecuente de un dato que alguien ha borrado.

Al terminar, `sumaq-check-site` revisa el HTML de `dist/` y falla si no se cumplen las reglas
comunes (lista en el README del kit).

## Estructura

```text
/
├── .gitea/workflows/
│   └── deploy.yml          # Publicación. Idéntico en todos los sitios, no se toca
├── schema/                 # Contrato del contenido
│   ├── page.index.yaml
│   └── page.profile.yaml
├── content/                # Contenido editable
│   ├── index.json
│   └── profile.json
├── media/                  # Imágenes: Astro las procesa
│   ├── logo.svg
│   └── manifest.json       # lo escribe el CMS
├── public/
│   └── files/              # Adjuntos que no son imagen
├── src/
│   ├── layouts/Base.astro  # Envuelve el Base del kit: CSS, cabecera y pie por defecto
│   ├── pages/              # Composición de secciones y robots.txt
│   ├── sections/           # Hero, Services, Contact
│   ├── ui/                 # Envoltorios opcionales de átomos (ver su README)
│   └── styles/
│       ├── global.css      # Tokens del kit + tokens del sitio
│       └── site.css        # El diseño
└── astro.config.mjs        # defineSumaqSite()
```

## Datos de la consulta: `content/profile.json`

Nombre, profesión, contacto, dirección y horario viven en `content/profile.json`, con su contrato
en `schema/page.profile.yaml`. Es una página del contenido sin ruta: tiene schema y datos, pero no
se publica como página.

De ese fichero salen dos cosas: la tarjeta de la sección de contacto (`src/sections/Contact.astro`
lo lee con `loadProfile()`) y los datos estructurados que el kit emite para los buscadores. Al
tener un solo origen, lo que ve la persona y lo que lee el buscador no pueden contradecirse.

## Formulario de contacto

La sección de contacto incluye `ContactForm` del kit. Sus textos están en el campo `form` de
`contact` (`schema/page.index.yaml`).

El formulario **solo se publica si el admin lo tiene activado en `sumaq-app`**: la app escribe
entonces `SITE_FORMS_ORIGIN` en el repositorio y el siguiente build lo pinta. Sin esa variable el
componente no emite nada y la sección se queda en la tarjeta. Los envíos van a `sumaq-app`; el
sitio no conoce ningún correo.

## Idiomas

Los idiomas los dicta `sumaq-app` por variables, no este repositorio:

- `SITE_LOCALE` es el idioma por defecto. Se sirve sin prefijo y sus datos están en la raíz de
  `content/`. Sin ella, `de`.
- `SITE_LOCALES` son los idiomas añadidos, separados por `;`. Cada uno se sirve bajo su prefijo
  (`/en/`) y lee sus datos de `content/<idioma>/`.

Sin `SITE_LOCALES` no se configura i18n: un sitio de un solo idioma se construye sin nada de esto.
El schema y las imágenes se comparten entre idiomas.

## Imágenes

Van en `media/`, en la raíz, **no en `public/`**: ahí Astro les pone hash de contenido y `srcset`.
Por eso la cadena `/media/…` del contenido es una clave y no una URL, y se pinta siempre con
`<Media>` del kit. Los adjuntos que no son imagen van a `public/files/`, que sí conserva la URL.
El detalle está en el README del kit, § Imágenes.

## Versiones

`@sumaq/site-kit`, `astro` y `sharp` se fijan en **versión exacta**, y `pnpm-lock.yaml` se
commitea: con un rango, todos los sitios cambiarían solos en el siguiente build. `sharp` es
dependencia directa del sitio porque Astro lo resuelve desde la raíz del proyecto que construye.

## Despliegue

Publica [`.gitea/workflows/deploy.yml`](.gitea/workflows/deploy.yml), que cada sitio hereda **sin
tocarlo**: no lleva el dominio ni la URL incrustados. Lo que cambia de un sitio a otro son
variables de Actions, y **la única lista completa es la cabecera de ese fichero**, que dice de
cada una a qué nivel vive (organización o repositorio), quién la escribe y qué pasa si falta.

Lo esencial:

- `SITE_DEPLOY_TARGET` (organización) dice el entorno: `docroot` copia el build al docroot del
  laboratorio local; `sites` lo sincroniza por `rsync` con el servidor de sitios.
- `SITE_SLUG` (repositorio) habilita el workflow. Sin ella el job se salta.
- `SITE_DOMAIN` y `SITE_URL` (repositorio) dicen dónde se publica. Sin `SITE_DOMAIN`, el dominio
  **se deriva del slug** (el último guion pasa a punto), lo que solo acierta con dominios de dos
  etiquetas.
- Las variables de repositorio las escribe `sumaq-app`.

**Previews públicos.** Mientras un sitio no tiene su dominio activado, `sumaq-app` escribe en
`SITE_DOMAIN` y `SITE_URL` el host de preview (`<slug>.sumaqsite-preview.eu`); para el workflow es
un dominio más. Ver `infra-configuration` `amauta/specs/client-sites.md`.

El fichero vive en `.gitea/workflows/` y no en `.github/workflows/` porque el `origin` de la
plantilla es GitHub, donde no hay runner que lo ejecute.

## Documentación

- Kit de átomos: `sumaq-packages` `packages/site-kit/README.md`.
- Contrato del contenido: `sumaq-packages` `packages/cms-schema/README.md`.
- Servidor de sitios, dominios y previews: `infra-configuration` `amauta/specs/client-sites.md`.
- [Astro](https://docs.astro.build)
