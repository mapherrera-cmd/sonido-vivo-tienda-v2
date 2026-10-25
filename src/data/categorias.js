// "Base de datos" simulada de categorías, con CRUD guardado en localStorage.
import { generarId, guardarLista, leerLista } from "./almacenamiento";

const CLAVE_CATEGORIAS = "sv_categorias";

// Categorías iniciales (las mismas que tenía el formulario del admin antiguo).
// Cada producto guarda el id de su categoría en el campo "categoria".
export const CATEGORIAS_INICIALES = [
  { id: "C001", nombre: "Instrumentos de Cuerda", img: "/img/guitarra.jpg" },
  { id: "C002", nombre: "Percusión", img: "/img/bateria.jpg" },
  { id: "C003", nombre: "Amplificadores", img: "/img/amplificador-15w.jpg" },
  { id: "C004", nombre: "Accesorios", img: "/img/pedal.jpg" },
];

// READ: todas las categorías
export function obtenerCategorias() {
  return leerLista(CLAVE_CATEGORIAS, CATEGORIAS_INICIALES);
}

// READ: una categoría por su id (o null si no existe)
export function obtenerCategoriaPorId(id) {
  return obtenerCategorias().find((categoria) => categoria.id === id) || null;
}

// CREATE: agrega una categoría nueva y la devuelve con su id
export function crearCategoria(datos) {
  const categorias = obtenerCategorias();
  const nueva = { img: "", ...datos, id: generarId(categorias, "C") };
  guardarLista(CLAVE_CATEGORIAS, [...categorias, nueva]);
  return nueva;
}

// UPDATE: cambia los campos indicados. Devuelve la categoría actualizada (o null si no existe)
export function actualizarCategoria(id, cambios) {
  const categorias = obtenerCategorias();
  if (!categorias.some((categoria) => categoria.id === id)) return null;

  const actualizadas = categorias.map((categoria) =>
    categoria.id === id ? { ...categoria, ...cambios, id } : categoria
  );
  guardarLista(CLAVE_CATEGORIAS, actualizadas);
  return actualizadas.find((categoria) => categoria.id === id);
}

// DELETE: borra una categoría. Devuelve true si se borró, false si no existía
export function eliminarCategoria(id) {
  const categorias = obtenerCategorias();
  const restantes = categorias.filter((categoria) => categoria.id !== id);
  if (restantes.length === categorias.length) return false;

  guardarLista(CLAVE_CATEGORIAS, restantes);
  return true;
}
