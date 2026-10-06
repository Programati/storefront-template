# storefront-template

Plantilla de tienda **100 % front-end**: catálogo, carrito y pedido por WhatsApp. No tiene backend ni base de datos, a propósito. Se adapta a cada rubro cambiando solo la carpeta `src/store-pack/`.

- Demo (campo de pruebas, muestra el preset `pasteleria`): https://tienda-core.netlify.app
- Referencia de UX: https://dulceolivia.netlify.app

Para clientes que necesitan dominio propio, backend y base de datos, eso se arma aparte.

> **Número de WhatsApp de ejemplo:** el core trae `5491100000000` en `config.ts`, un número ficticio. Los pedidos de la demo no llegan a nadie. En cada tienda real, reemplazalo por el del cliente antes de publicar.
> **El core viene con una pastelería de ejemplo en `src/store-pack/`** (preset `pasteleria`). Es solo la demo: un repo de otro rubro tiene que reemplazarla antes de tocar nada (ver el checklist y la sección Presets). La tienda neutra anterior (Producto Alfa, Beta y Gamma) quedó guardada como preset `demo`.

## Qué hace

- Catálogo con categorías, búsqueda local, variantes, grupos de opciones y productos agotados.
- Carrito persistido en `localStorage` (guarda solo ids y cantidades; los precios se recalculan desde el catálogo).
- Precios por volumen (promos por cantidad).
- Pedido por WhatsApp como ticket con código (por ejemplo `DO-7K2F`).
- Imágenes servidas desde ImageKit, con un provider `placeholder` para desarrollo.

## Stack

React + TypeScript (strict) + Vite + Tailwind + shadcn/ui (base-ui) + react-router (modo datos) + Vitest. Las versiones exactas están en `package.json` y `pnpm-lock.yaml`.

- **Node:** el de `.nvmrc`.
- **pnpm:** el de `packageManager` en `package.json` (se activa con Corepack).
- **React Compiler: no está activo.** `vite.config.ts` usa `react()` plano.

## Empezar

```bash
corepack enable
pnpm install
pnpm dev
```

## Scripts

| Script                 | Qué hace                                                             |
| ---------------------- | -------------------------------------------------------------------- |
| `pnpm dev`             | Servidor de desarrollo                                               |
| `pnpm build`           | `tsc -b` (tipa `src/` y `scripts/`) y build de Vite                  |
| `pnpm lint`            | ESLint                                                               |
| `pnpm test`            | Vitest (una pasada)                                                  |
| `pnpm test:watch`      | Vitest en modo watch                                                 |
| `pnpm preview`         | Sirve el build local                                                 |
| `pnpm images:check`    | Chequeo **local** de fotos faltantes, huérfanas o en conflicto       |
| `pnpm images:prepare`  | Convierte las fotos de `images-raw/` a WebP en `images-ready/`       |
| `pnpm build:analyze`   | Build con informe de bundle en `dist/analyze-data.md` (experimental) |
| `pnpm bundle:check`    | Falla si el JS gzip supera el tope de `bundle-budget.json`           |
| `pnpm preset:use <id>` | Aplica un preset sobre `src/store-pack/`                             |

## Arquitectura

```
src/
  app/          providers, router, layout
  components/
    ui/         shadcn (generado)
    shared/     presentacionales: reciben todo por props
  features/     cart, catalog, checkout, pricing
  pages/        una por ruta (home/ tiene las secciones de la home)
  hooks/ lib/ types/
  store-pack/   LO ÚNICO QUE CAMBIA POR CLIENTE
  presets/      packs listos por rubro (<id>/ con los 5 archivos)
scripts/        imágenes, bundle, presets
```

Capas: `components/ui` ← `components/shared` ← `features/*` ← `pages`. `features/catalog` no importa de `features/cart`; `checkout` importa de `cart` y `pricing`.

### `src/store-pack/`

| Archivo      | Qué define                                                                     |
| ------------ | ------------------------------------------------------------------------------ |
| `config.ts`  | Nombre, WhatsApp, moneda, entregas, estilo del mensaje, imágenes               |
| `catalog.ts` | Categorías, productos, variantes, opciones y promos                            |
| `content.ts` | Secciones de la home, en orden (hero, categorías, destacados, cómo pedir, FAQ) |
| `theme.css`  | Paleta y fuente (solo valores, claro y oscuro)                                 |
| `fonts.ts`   | Imports de `@fontsource`                                                       |

Nadie importa `store-pack` directo salvo `StoreProvider` y `fonts`: el resto lee todo con `useStoreConfig()`, `useCatalog()` y `useStoreContent()`.

**Regla de oro:** si al trabajar para un cliente tocás algo que no sea `store-pack/` ni `presets/`, el cambio va **primero al core** y después se copia al repo del cliente (cherry-pick).

### Contenido de la home

`content.home.sections` es una lista: el orden de la lista es el orden en pantalla, y quitar un ítem oculta la sección. Tipos disponibles: `hero`, `categories`, `featured`, `howToOrder`, `faq`. Los textos de la interfaz del core ("Agregar", mensajes de validación) no se configuran acá.
`content.demoNotice` (opcional) muestra una franja arriba de todo con ese texto. Es para vistas de demostración: sin el campo, no se muestra nada.

### Presets

Un preset es una carpeta `src/presets/<id>/` con los mismos 5 archivos que `store-pack/`.

```bash
pnpm preset:use --list
pnpm preset:use <id>
```

- Valida que estén los 5 archivos **antes** de copiar, así `store-pack/` nunca queda a medio reemplazar.
- El id solo admite minúsculas, números y guiones.
- Se niega a correr si `src/store-pack` tiene cambios sin commitear. `--force` los pisa.
- Si el preset usa fuentes que no están instaladas, avisa qué `pnpm add` falta.

Presets incluidos:

| Preset       | Qué es                                                                             |
| ------------ | ---------------------------------------------------------------------------------- |
| `pasteleria` | Pastelería de ejemplo (budines, tartas, dulces). Es la que trae `store-pack/` hoy. |
| `demo`       | Tienda neutra de pruebas (Producto Alfa, Beta y Gamma). Usa la fuente Poppins.     |

Los `config.ts` de los presets apuntan al ImageKit del core (`images.baseUrl`). En un repo de cliente hay que cambiarlo por la cuenta propia.

## Tema y fuentes

- `theme.css` define **valores** (`:root` y `.dark`). `src/index.css` hace el mapeo en `@theme inline`. Un token de color nuevo necesita las dos cosas.
- Cambiar de fuente: `pnpm add @fontsource/<fuente>`, importar **solo** los pesos usados en `fonts.ts` y actualizar `--font-sans` en `theme.css`.
- Hay un test de contraste (texto ≥ 4.5:1, iconos ≥ 3:1, en claro y oscuro). Si falla, se corrige el color, no el test.

## Imágenes

Una cuenta de ImageKit por cliente. **Las claves privadas nunca van en el repo.**

- Rutas relativas con la convención `products/<slug>.webp`. Galería: `<slug>-2.webp`, `<slug>-3.webp`… Reemplazo de una foto: `<slug>-v2.webp`.
- Flujo: cuenta de ImageKit → `images` en `config.ts` → `catalog.ts` → fotos en `images-raw/` → `pnpm images:check` → `pnpm images:prepare` → subir `images-ready/products/*` (sin sufijo aleatorio) → commit de `catalog.ts`. Las imágenes no se commitean.
- `images:check` **no corre en CI** (necesita `images-raw/`). Lo que sí corre en CI es `scripts/images/catalogPaths.test.ts`, que valida las rutas del catálogo.

## Calidad

- **Tests:** `*.test.ts(x)` junto al código. Los que leen archivos con Node van como `*.node.test.ts` (dentro de `scripts/` no hace falta). Los de componentes llevan `// @vitest-environment jsdom` como **primera línea**.
- **Catálogo:** `validateCatalog` y `catalogQuality.test` detectan productos sin variantes, ids repetidos, reglas de precio rotas y `alt` vacío o repetido. Si fallan, se corrige el dato.
- **CI** (`.github/workflows/ci.yml`): lint, test, build y `bundle:check`. `main` exige PR y el check `check` en verde.
- **Bundle:** el tope está en `bundle-budget.json`. Si lo superás, la guardia falla y hay que decidir: optimizar o subir el tope a conciencia.
- **Dependabot:** semanal. Ignora `rolldown` minor y major. Un PR de Dependabot desfasado se arregla comentando `@dependabot rebase`.

## Seguridad

- `public/_headers` define nosniff, Referrer-Policy, X-Frame-Options DENY, Permissions-Policy y una CSP restrictiva (cada header en **una sola línea**). Un `<meta http-equiv>` no sirve para CSP ni X-Frame-Options.
- La CSP solo permite imágenes de `'self'` e `ik.imagekit.io`. Toda librería nueva puede inyectar `<style>` o cargar recursos externos y romperse bajo la CSP: probala en el build real.
- Texto del cliente saneado antes de armar el mensaje de WhatsApp, sin `dangerouslySetInnerHTML`, links externos con `rel="noopener noreferrer"`.
- Sin variables `VITE_` con claves: todo lo que empieza con `VITE_` termina en el bundle público.

## Despliegue (Netlify)

Sin `netlify.toml`: build `pnpm run build`, publica `dist`. `.nvmrc` y `packageManager` mandan sobre la configuración de la UI. Cada merge a `main` dispara un deploy a producción, así que conviene agrupar cambios en pocos PRs.

## Flujo de trabajo (Git)

Rama `tipo/descripcion` → push → PR → CI verde → merge en GitHub con **Merge commit** (no squash) → borrar la rama. Commits convencionales, uno por cambio lógico. Nunca se mergea localmente a `main`.

**Regla de dependencias:** todo cambio de dependencias o de `packageManager` se commitea con `package.json` y `pnpm-lock.yaml` **juntos** (si no, el CI falla con `ERR_PNPM_FROZEN_LOCKFILE_WITH_OUTDATED_LOCKFILE`). Al subir Vite, revisar `pnpm why rolldown` y alinear la dependencia directa `rolldown`.

## Checklist: repo nuevo para un cliente

**Antes de empezar**

- [ ] Revisar el `LICENSE` heredado del template: el archivo viaja a cada repo nuevo. En un repo privado de cliente, decidir si se conserva, se reemplaza o se quita.
- [ ] Crear el repo desde este template y un sitio de Netlify propio.
- [ ] El repo nace con la pastelería en `src/store-pack/`. Si el rubro es otro, reemplazala antes de editar nada: `pnpm preset:use demo` (neutro) u otro preset, o a mano. Si el preset usa una fuente que falta, `preset:use` avisa qué instalar.
- [ ] Reemplazar el `whatsappNumber` ficticio de `config.ts` (`5491100000000`) por el número real del cliente, formato E.164 sin `+`. Probar un pedido de punta a punta para confirmar que llega al chat correcto.
- [ ] Confirmar `.nvmrc` y `packageManager` en el repo nuevo.
- [ ] Revisar los créditos de Netlify en el panel de uso.

**Marca y contenido**

- [ ] `config.ts`: nombre, tagline, moneda, entregas, estilo del mensaje, `scheduling`.
- [ ] `content.ts`: hero, "cómo pedir" y FAQ propios.
- [ ] `theme.css`: paleta; correr `pnpm test` para ver el contraste.
- [ ] Fuente: instalar, importar solo los pesos usados y actualizar `--font-sans`.
- [ ] Favicon del cliente (`public/favicon.svg`).
- [ ] `content.ts`: borrar `demoNotice` si el repo es de un cliente real (el preset `pasteleria` lo trae puesto).

**Catálogo e imágenes**

- [ ] `catalog.ts` con los precios del cliente.
- [ ] `alt` de cada imagen: describe lo que se ve, sin repetir el nombre del producto ni empezar con "imagen de…". `alt=""` solo si es decorativa (verificar el fallback `role="img"` de `SmartImage`).
- [ ] Cuenta de ImageKit propia: cambiar `images.baseUrl` en `config.ts` (los presets apuntan a la cuenta del core) y seguir el flujo de imágenes de la sección anterior.
- [ ] Si el cliente usa el provider `placeholder`, agregar `placehold.co` a `img-src` en la CSP.

**Antes de publicar**

- [ ] `pnpm lint && pnpm test && pnpm build && pnpm bundle:check` en verde.
- [ ] `curl -sI` al dominio del cliente para comprobar que los headers se aplican.
- [ ] Probar en móvil el flujo completo (agregar, pedido, WhatsApp, pantalla de gracias).
- [ ] Si se actualizó `sonner`, repetir la prueba del foco cuando un toast abre un panel.

## Licencia

MIT. Ver [LICENSE](LICENSE).

## Limitaciones conocidas

- Es una SPA pura: Lighthouse marca "LCP request discovery" en rojo.
- Sin resolver todavía: `siteUrl`, canonical, `og:*`, sitemap y JSON-LD.
