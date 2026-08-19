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

## Documentación Astro

https://docs.astro.build — [Routing](https://docs.astro.build/en/guides/routing/) ·
[Componentes](https://docs.astro.build/en/basics/astro-components/) ·
[Styling](https://docs.astro.build/en/guides/styling/)
