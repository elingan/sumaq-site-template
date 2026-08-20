# sumaq-site-template

Plantilla única de los sitios `www-*` de cliente. Astro 7 estático sobre
`@sumaq/site-kit`. **No re-scaffoldear**: extender sobre esta estructura.

## La regla que no se rompe

El markup vive en el kit. Si un bloque no encaja, **se arregla en
`@sumaq/site-kit` y lo heredan los ~100 sitios**. No se copia un `.astro` del kit a
`src/components/` para retocarlo: eso reintroduce el fork que el kit vino a eliminar.

En este repo solo hay cuatro cosas propias:

| Qué | Dónde |
| --- | --- |
| Contenido | `content/*.json` |
| Contrato del contenido | `schema/*.yaml` |
| Composición de la página | `src/pages/*.astro` |
| Diseño | `src/styles/site.css` |

`.gitea/workflows/deploy.yml` **no** es una de ellas: se hereda tal cual y es idéntico en
los ~100 sitios. Si un despliegue necesita algo distinto, se arregla ahí y lo heredan
todos — el mismo principio que con el markup del kit.

## Añadir una página

1. `schema/page.<nombre>.yaml` — el contrato. Identificadores (`name`) en inglés,
   etiquetas (`label`) en el idioma de la clienta. Marca `required: true` en todo campo
   sin el cual la página queda rota.
2. `content/<nombre>.json` — los datos, con la misma forma.
3. `src/pages/<nombre>.astro` — importa bloques de `@sumaq/site-kit` y les pasa su rama
   del JSON.
4. Estilos nuevos, si hacen falta, en `site.css` usando clases `sq-*` existentes.

El build valida 2 contra 1 y falla si no cuadran.

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

## Estilos

- **Reset y `sq-*`**: los trae `@sumaq/site-kit/tokens.css`. No redefinir aquí — el
  editor de la app solo emite clases de esa lista y duplicarlas la desincroniza.
- **Tokens del sitio**: `:root` en `global.css`. El kit espera al menos `--color-text`,
  `--color-bg`, `--color-muted`, `--color-accent`.
- **Diseño**: `site.css`, CSS plano. Sin Tailwind ni DaisyUI.

## Bloques disponibles en el kit

`Hero`, `Services`, `Contact`, `TeamTeaser`, `TeamDirectory`, `IntroCta`,
`LocationsOverview`, `Audience`, `Pricing`, `CtaBand`, `PageBanner`, `Generic`,
`BlockRenderer`, `EmergencyPrimary`, `EmergencyGrid`, `EmergencyHelplines`.

Todos emiten `data-cms` en los campos editables — es lo que permitirá la vista previa en
vivo del editor.

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
`SITE_DEPLOY_TARGET`, variable de **organización** (`docroot` en el lab, `bunny` en
`kallpa-server`). El sitio lo dicen `SITE_DOMAIN` y `SITE_URL`, variables de **repo** que
escribe `sumaq-app` al fijar el dominio; sin ellas el dominio se deriva del nombre del repo
(`www-demo-graz-at` → `demo-graz.at`) y la URL cae a la del lab. Ambos runners responden a
la label `sumaq-site`. Detalle en el [README](README.md#despliegue).

## Documentación Astro

https://docs.astro.build — [Routing](https://docs.astro.build/en/guides/routing/) ·
[Componentes](https://docs.astro.build/en/basics/astro-components/) ·
[Styling](https://docs.astro.build/en/guides/styling/)
