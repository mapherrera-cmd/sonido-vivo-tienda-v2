// Cálculos que usa el panel de administración (dashboard, productos críticos, reportes).
// Son funciones simples: reciben listas (productos, órdenes) y devuelven un resultado.
// No leen localStorage, así son fáciles de probar con datos de ejemplo.

// Un producto es "crítico" cuando le quedan 5 unidades o menos
export const STOCK_CRITICO = 5;

// Productos con stock bajo (incluye los que ya están agotados), del que menos stock tiene al que más
export function obtenerProductosCriticos(productos, umbral = STOCK_CRITICO) {
  return productos
    .filter((producto) => producto.stock <= umbral)
    .sort((a, b) => a.stock - b.stock);
}

// Solo las órdenes que se pagaron (las rechazadas no son ventas)
export function filtrarOrdenesPagadas(ordenes) {
  return ordenes.filter((orden) => orden.estado === "pagada");
}

// Suma el total de todas las órdenes pagadas
export function calcularVentasTotales(ordenes) {
  return filtrarOrdenesPagadas(ordenes).reduce((suma, orden) => suma + orden.total, 0);
}

// Órdenes de un usuario, de la más nueva a la más antigua
export function obtenerOrdenesDeUsuario(ordenes, usuarioId) {
  return ordenes
    .filter((orden) => orden.usuarioId === usuarioId)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

// Cuántas unidades y cuánto dinero dejó cada producto (solo órdenes pagadas).
// Devuelve una lista [{ id, nombre, unidades, ingresos }] ordenada por ingresos, de mayor a menor.
export function calcularVentasPorProducto(ordenes) {
  const porProducto = {};

  filtrarOrdenesPagadas(ordenes).forEach((orden) => {
    orden.items.forEach((item) => {
      if (!porProducto[item.id]) {
        porProducto[item.id] = { id: item.id, nombre: item.nombre, unidades: 0, ingresos: 0 };
      }
      porProducto[item.id].unidades += item.cantidad;
      porProducto[item.id].ingresos += item.precio * item.cantidad;
    });
  });

  return Object.values(porProducto).sort((a, b) => b.ingresos - a.ingresos);
}
