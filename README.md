# Sonido Vivo – Tienda online de instrumentos musicales

Proyecto de la asignatura **DSY1104 Desarrollo Fullstack II** (Duoc UC), Evaluación Parcial 2.
Es el frontend de una tienda online de instrumentos musicales (guitarras, bajos, baterías,
amplificadores y pedales), construido con **React**, **Vite** y **Bootstrap**.

## Tecnologías

- React 19 + Vite
- Bootstrap 5 y react-bootstrap (diseño responsivo)
- react-router-dom (navegación entre páginas sin recargar)
- ESLint (calidad del código)
- Vitest + React Testing Library + jsdom (pruebas unitarias, por indicación docente)

## Cómo instalar y ejecutar

Requisitos: Node.js 20 o superior.

```bash
npm install        # instala las dependencias
npm run dev        # servidor de desarrollo (http://localhost:5173)
npm run build      # genera la versión de producción en dist/
npm run lint       # revisa el código con ESLint
npm test           # ejecuta las pruebas unitarias una vez (Vitest)
npm run test:watch # pruebas en modo continuo mientras programas
npm run coverage   # pruebas + reporte de cobertura (consola y carpeta coverage/)
```

## Estructura de carpetas

```
public/img/   imágenes de los productos (se sirven en /img/...)
src/          código React (Atomic Design: atoms, molecules, organisms, templates)
src/pages/    una página por cada ruta de la tienda
src/data/     "base de datos" simulada con CRUD en localStorage
src/utils/    funciones puras: validaciones, filtros, reportes
src/testUtils/ datos de ejemplo y ayudas compartidas por las pruebas
*.test.js(x)  pruebas unitarias, junto al archivo que prueban
src/context/  carrito y sesión compartidos por toda la app
legacy/       tienda original en HTML + JavaScript (se conserva solo como referencia)
```

## Rutas públicas

| Ruta | Página |
|---|---|
| `/` | Home |
| `/productos` y `/productos/:id` | Listado (con búsqueda) y detalle de producto |
| `/categorias` y `/categorias/:id` | Categorías y productos de una categoría |
| `/ofertas` | Productos en oferta |
| `/nosotros`, `/contacto` | Información y formulario de contacto |
| `/blogs` y `/blogs/:id` | Blogs y detalle de cada uno |
| `/login`, `/registro` | Inicio de sesión y registro (formularios con validaciones) |
| `/carrito` | Carrito de compras |
| `/comprar` | Checkout: datos del cliente y dirección de entrega |
| `/pago-correcto/:id` | Boleta de una compra pagada |
| `/pago-error/:id` | Pago rechazado, con botón para reintentar |
| cualquier otra | Página 404 |

## Panel de administración (solo rol `admin`)

Si alguien sin sesión (o con rol `cliente`) entra a `/admin`, se le redirige al login.
Usuario administrador de prueba: `max@duoc.cl` / `admin123`.

| Ruta | Vista |
|---|---|
| `/admin` | Dashboard: totales leídos de los datos reales y accesos rápidos |
| `/admin/ordenes` y `/admin/ordenes/:id` | Órdenes y boleta de cada orden |
| `/admin/productos` | Lista de productos (editar y eliminar) |
| `/admin/productos/nuevo` y `/admin/productos/:id/editar` | Crear y editar producto |
| `/admin/productos/criticos` | Productos con stock de 5 unidades o menos |
| `/admin/categorias`, `/nueva`, `/:id/editar` | Lista, nueva y editar categoría |
| `/admin/usuarios`, `/nuevo`, `/:id/editar` | Lista, nuevo y editar usuario |
| `/admin/usuarios/:id/historial` | Historial de compras de un usuario |
| `/admin/reportes` | Ventas totales y productos más vendidos |
| `/admin/perfil` | Datos y contraseña del administrador |

## Pruebas unitarias

Se usa **Vitest** (por indicación docente, en reemplazo de Jasmine y Karma) junto con React Testing Library,
jest-dom, user-event y jsdom. La cobertura se mide con `@vitest/coverage-v8`.

Última ejecución de `npm run coverage`: **31 archivos y 279 pruebas aprobadas**.
Cobertura: 100 % sentencias, 99,5 % ramas, 100 % funciones y 100 % líneas.

## Estado del proyecto

La migración de HTML a React está terminada: tienda pública, checkout con pago simulado y panel de
administración. La carpeta `legacy/` conserva las páginas HTML originales solo como referencia.

## Integrantes

Max Herrera, Javiera Sanches y Pablo Quintino.

## Usuarios de prueba

| Correo | Contraseña | Rol |
|---|---|---|
| `max@duoc.cl` | `admin123` | admin (al ingresar va a `/admin`) |
| `javi@gmail.com` | `cliente123` | cliente |

El pago es simulado: se aprueba con un 70 % de probabilidad (`src/utils/simularPago.js`).
Si sale "pago con error", el botón "Volver a realizar el pago" lo intenta de nuevo.
