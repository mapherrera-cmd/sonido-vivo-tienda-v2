// "Base de datos" simulada de órdenes de compra, guardada en localStorage.
// Cada orden guarda una "foto" de lo que se compró (nombre y precio en ese momento),
// así la boleta no cambia aunque después se edite el producto.
import { generarId, guardarLista, leerLista } from "./almacenamiento";

const CLAVE_ORDENES = "sv_ordenes";

// Una orden tiene esta forma:
// { id: "ORD-001", fecha, estado: "pagada" | "rechazada", usuarioId,
//   cliente: { nombre, apellidos, correo },
//   entrega: { calle, departamento, region, comuna, indicaciones },
//   items: [{ id, nombre, img, precio, cantidad }], total }

// READ: todas las órdenes
export function obtenerOrdenes() {
  return leerLista(CLAVE_ORDENES, []);
}

// READ: una orden por su número (o null si no existe)
export function obtenerOrdenPorId(id) {
  return obtenerOrdenes().find((orden) => orden.id === id) || null;
}

// CREATE: guarda una orden nueva. Le pone el número (id) y la fecha.
export function crearOrden(datos) {
  const ordenes = obtenerOrdenes();
  const nueva = {
    ...datos,
    id: generarId(ordenes, "ORD-"),
    fecha: new Date().toISOString(),
  };
  guardarLista(CLAVE_ORDENES, [...ordenes, nueva]);
  return nueva;
}

// UPDATE: cambia campos de una orden (por ejemplo su estado). Devuelve la orden o null si no existe
export function actualizarOrden(id, cambios) {
  const ordenes = obtenerOrdenes();
  if (!ordenes.some((orden) => orden.id === id)) return null;

  const actualizadas = ordenes.map((orden) => (orden.id === id ? { ...orden, ...cambios, id } : orden));
  guardarLista(CLAVE_ORDENES, actualizadas);
  return actualizadas.find((orden) => orden.id === id);
}
