// Función pura (sin React): filtra por texto y categoría, y ordena por precio.
// Al ser pura, es fácil de probar con Vitest en la fase de testing.
import { obtenerPrecioFinal } from "../data/productos";

export function filtrarYOrdenarProductos(productos, { buscar = "", categoria = "", orden = "" } = {}) {
  const texto = buscar.trim().toLowerCase();

  // 1) Filtrar: el texto debe estar en el nombre o la descripción, y la categoría debe coincidir (si se eligió una)
  const filtrados = productos.filter((p) => {
    const coincideTexto =
      p.nombre.toLowerCase().includes(texto) || p.descripcion.toLowerCase().includes(texto);
    const coincideCategoria = categoria === "" || p.categoria === categoria;
    return coincideTexto && coincideCategoria;
  });

  // 2) Ordenar por el precio que se cobra (precio de oferta si corresponde).
  // Se copia el arreglo con [...] para no modificar el original.
  if (orden === "menor") {
    return [...filtrados].sort((a, b) => obtenerPrecioFinal(a) - obtenerPrecioFinal(b));
  }
  if (orden === "mayor") {
    return [...filtrados].sort((a, b) => obtenerPrecioFinal(b) - obtenerPrecioFinal(a));
  }
  return filtrados;
}
