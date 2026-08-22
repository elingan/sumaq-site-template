# sumaq-site-template

Plantilla **única** de la que nace cada repo `www-*` de cliente. Astro 7 estático
sobre [`@sumaq/site-kit`](https://github.com/elingan/sumaq-packages): el kit trae la
configuración, los layouts y los bloques; este repo trae el contenido, la composición
de la página y el diseño.

> **No hay una segunda plantilla.** Si encuentras otra (`sumaq-cli/templates/`), es
> anterior a la unificación del 13 de agosto de 2026 y no debe usarse.

## Qué aporta cada lado

| | Dónde vive | Qué es |
| --- | --- | --- |
| Configuración de Astro, sitemap, validación de contenido | `@sumaq/site-kit/config` | `defineSumaqSite()` |
| Layout, cabecera, pie, SEO, 16 bloques | `@sumaq/site-kit` | markup con `sq-*` y `data-cms` |
| Reset CSS y vocabulario `sq-*` del CMS | `@sumaq/site-kit/tokens.css` | inventario único |
| **Contenido** | `content/*.json` | lo que edita la clienta |
| **Contrato del contenido** | `schema/*.yaml` | lo que el editor y el build validan |
| **Composición de la página** | `src/pages/*.astro` | qué bloques y en qué orden |
| **Diseño** | `src/styles/site.css` | lo que se vende |

La regla que sostiene el modelo: **el markup no se copia nunca**. Si un bloque no
encaja, se cambia en el kit y lo heredan los ~100 sitios; no se forkea aquí.

## Crear un sitio nuevo

```bash
pnpm create astro@latest -- --template elingan/sumaq-site-template
cd www-cliente-at
cp .env.example .env          # editar SITE_URL
pnpm install
pnpm dev
```

Después, renombra `"name"` en `package.json` al del repo (`www-cliente-at`).

`@sumaq/site-kit` y `@sumaq/cms-schema` están **publicados y son públicos** en npmjs, así
que `pnpm install` funciona sin más — igual que en el runner. El aviso anterior sobre un 404
en `@sumaq/cms-schema` estaba obsoleto.

Para desarrollar el kit y el sitio a la vez, enlaza los paquetes locales:

```bash
cd ../sumaq-packages && ./scripts/install.sh
./scripts/link-into.sh ../sites/www-cliente-at --only site-kit
```

Con el enlace puesto, **no regeneres `pnpm-lock.yaml` en ese árbol**: grabaría un `link:`
que el runner no resuelve. Ver [`AGENTS.md`](AGENTS.md#versiones).

## Comandos

| Comando | Acción |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo (`--host`, con QR en terminal) |
| `pnpm build` | Build estático en `./dist/` — **valida el contenido antes de emitir** |
| `pnpm preview` | Preview local del build |

## La puerta de validación

`defineSumaqSite()` engancha `@sumaq/cms-schema` en `astro:build:start`: contrasta cada
`content/*.json` con su `schema/*.yaml` **antes** de generar páginas. Si un campo marcado
`required: true` está vacío, el build falla y no se sube nada:

```
✗ content/index.json no cumple schema/page.index.yaml

  hero.title             Titel is required
  contact.cards[0].phone Telefon is required

  El sitio no se ha publicado. No se ha subido nada a Bunny.
```

**Marca `required: true` en todo campo sin el cual la página queda rota.** Un schema sin
campos obligatorios convierte la puerta en decorativa: solo atrapa corrupción estructural
(una lista donde iba un objeto), que es el caso raro. El caso frecuente —una terapeuta
borra su teléfono— pasaría limpio.

## Estructura

```text
/
├── .gitea/workflows/
│   └── deploy.yml        # Publicación. Idéntico en todos los sitios, no se toca
├── schema/               # Contrato del contenido (schemas YAML)
│   └── page.index.yaml
├── content/              # Contenido editable (app o IDE)
│   └── index.json
├── media/                # Imágenes: Astro las procesa (hash + srcset)
│   ├── logo.svg
│   └── manifest.json     # lqip + alt + dimensiones, lo escribe el CMS
├── public/               # Assets estáticos servidos tal cual
│   ├── files/            # Adjuntos no-imagen del CMS (pdf, csv…)
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Base.astro    # Envuelve el Base del kit: logo, CSS, header/footer
│   ├── pages/
│   │   ├── index.astro   # Composición de bloques
│   │   └── robots.txt.ts
│   └── styles/
│       ├── global.css    # Importa tokens del kit + tokens del sitio
│       └── site.css      # El diseño
├── astro.config.mjs      # defineSumaqSite()
└── pnpm-workspace.yaml   # allowBuilds: esbuild, sharp
```

## Imágenes

Van en **`media/`**, hermana de `schema/` y `content/`, **no en `public/`**. Ahí Astro
las procesa: hash de contenido en el nombre, `srcset` a cuatro anchos y una URL
`/_astro/…` que cambia sola cuando cambia la imagen (lo que invalida la caché del CDN
sin purgar nada). En `public/` se copiarían literales y no las tocaría nadie.

Eso convierte el string del contenido en una **clave, no una URL**:

```jsonc
"image": { "alt": "Retrato", "src": "/media/portrait-a3f9c1d2.webp" }
```

Nada sirve esa ruta. **Renderiza siempre con `<Media>` del kit** — interpolar el string
en un `src=` da un 404 silencioso:

```astro
---
import { Media } from '@sumaq/site-kit';
---
<Media src={data.hero.image} sizes="(max-width: 900px) 100vw, 25rem" />
```

El build lo verifica: toda referencia `/media/*` del contenido tiene que existir en
`media/`, y un `/uploads/*` heredado del CMS es error directo.

**Imágenes puestas a mano.** Copia el fichero en `media/` y ya está: el CMS no las
conoce, no las borra y no las sobrescribe. Referenciarlas desde un componente con
`import` directo también funciona.

**Adjuntos no-imagen** (pdf, csv) van a `public/files/` y se referencian como
`/files/tarifas-a3f9c1d2.pdf`. Se copian tal cual porque su URL tiene que seguir
funcionando para quien el cliente se la haya pasado.

**Placeholder.** Lo trae el kit; ningún sitio necesita su propio fichero. Se activa por
bloque con `<Media fallback />` — un hero vacío se ve mejor con un hueco, una rejilla de
tarjetas no. Si quieres el tuyo, pon `media/placeholder.webp` y gana sobre el del kit.

## Estilos

Tres capas, y la frontera importa:

1. **Reset y vocabulario `sq-*`** → `@sumaq/site-kit/tokens.css`. No los redefinas: el
   editor de la app solo emite clases de esa lista, y duplicarlas aquí desincroniza el
   sitio del editor.
2. **Tokens del sitio** → `:root` en `global.css`. Color, tipografía, espaciado. El kit
   espera al menos `--color-text`, `--color-bg`, `--color-muted` y `--color-accent`.
3. **Diseño** → `site.css`. Cámbialo entero. Dos sitios con el mismo `Hero` pueden ser
   irreconocibles entre sí.

Sin Tailwind ni DaisyUI, a propósito.

## Sitios multiidioma

La plantilla es monolingüe (`de`). Ningún cliente ha pedido i18n todavía, así que
`defineSumaqSite()` no lo expone. Cuando haga falta, el cambio son dos líneas en
`config.ts` del kit — pero hay que decidir a la vez cómo se traducen `schema/` y `content/`,
que es la parte cara. Ver la nota en `packages/site-kit/src/config.ts`.

## Versiones

`@sumaq/site-kit`, `astro` y `sharp` se fijan en **versión exacta, sin `^`**, y
`pnpm-lock.yaml` se commitea. Un rango haría que ~100 sitios cambiaran solos en el
siguiente build; con versión exacta, actualizar es un acto deliberado que la app
orquesta commit a commit.

`sharp` es `peerDependency` del kit y **dependencia directa de cada sitio**: Astro lo
resuelve desde la raíz del proyecto que construye, no desde el paquete que lo declara.

## Despliegue

`pnpm build` genera `dist/`. Quien publica es
[`.gitea/workflows/deploy.yml`](.gitea/workflows/deploy.yml), que **cada sitio hereda de
aquí sin tocarlo**: no lleva el dominio ni la URL incrustados, así que el fichero es
idéntico en los ~100 repos. Lo que cambia son tres variables de Actions, y el nivel al
que vive cada una dice a qué pertenece el dato:

| Variable | Nivel | Lab local | `kallpa-server` |
| --- | --- | --- | --- |
| `SITE_DEPLOY_TARGET` | organización | `docroot` — `cp` al docroot que sirve Caddy | `bunny` — `PUT` a la Storage Zone y purga |
| `SITE_DOMAIN` | repo | sin valor: se deriva del nombre del repo | el dominio real del sitio, que escribe `sumaq-app` |
| `SITE_URL` | repo | sin valor: se usa `http://<dominio>.localhost:8080` | la URL pública, que escribe `sumaq-app` |

El destino es del **entorno**, así que una variable de organización lo describe bien. El
dominio y la URL son del **sitio**: puestos en la organización le darían a los ~100 repos
el dominio del primero. Los escribe `sumaq-app` en el repo cuando un admin fija el dominio
(`setSiteDomainCommand` → `syncSiteDeployVars`), y ahí ganan sobre cualquier valor de la
organización.

Sin `SITE_DOMAIN` el workflow deriva el dominio del nombre del repo —`www-demo-graz-at` →
`demo-graz.at`, la misma convención que `local-server/seed.sh`—. Esa derivación es exacta
para el lab y para cualquier dominio de dos etiquetas, y falsa para un `.co.uk` o un
subdominio: de ahí que exista la variable. Sin `SITE_URL` el build emitiría
`https://example.com` en `robots.txt` y en el sitemap; el valor del lab hace que apunten a
donde el sitio se sirve de verdad.

Va en `.gitea/workflows/` y no en `.github/workflows/` a propósito: el `origin` de esta
plantilla es GitHub, y allí el workflow intentaría ejecutarse en cada push contra un runner
que no existe.

Los dos runners responden a la misma label **`sumaq-site`**. No hace falta elegir runner en
el workflow porque no hay ninguna instancia donde ambos sean candidatos: un repo del Gitea
local solo puede construir en el runner del lab, y uno de `kallpa-server` solo en el suyo.

## Documentación

- [Contrato de bloque](https://github.com/elingan/sumaq-packages) — `amauta/packages/block-contract.md`
- [Astro](https://docs.astro.build) · [Styling](https://docs.astro.build/en/guides/styling/)
