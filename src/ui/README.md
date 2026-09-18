# `src/ui/`

Envoltorios **opcionales** que fijan las clases de este sitio sobre un átomo del kit, para no repetir
la misma combinación en cada sección:

```astro
---
// src/ui/PillButton.astro
import { Button } from "@sumaq/site-kit";
const { class: extra, ...props } = Astro.props;
---
<Button {...props} class:list={["btn--pill", extra]} />
```

Reglas:

- **Se envuelve, no se copia.** Un átomo del kit (`Button`, `Media`, `DataList`…) no se duplica en el
  repo: se extiende por props o slot, o se envuelve aquí (R6).
- Si falta un átomo, se escribe en `src/sections/` o aquí. Si un segundo sitio lo necesita, se propone
  subirlo al kit.
- Carpeta vacía es lo normal: la mayoría de los sitios no la necesitan.
