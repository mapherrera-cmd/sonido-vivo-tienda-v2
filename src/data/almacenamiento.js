// Funciones de apoyo para guardar y leer listas en localStorage.
// Todos los "CRUD" (productos, categorías, usuarios) usan estas mismas funciones.

// Guarda una lista completa bajo una clave (la convierte a texto JSON).
export function guardarLista(clave, lista) {
  try {
    localStorage.setItem(clave, JSON.stringify(lista));
  } catch (error) {
    console.error("No se pudo guardar en localStorage:", error);
  }
}

// Lee una lista desde localStorage.
// Si todavía no existe (primera vez que se abre la tienda), guarda y devuelve la lista inicial.
export function leerLista(clave, listaInicial) {
  try {
    const texto = localStorage.getItem(clave);
    if (texto === null) {
      guardarLista(clave, listaInicial);
      return [...listaInicial];
    }
    return JSON.parse(texto);
  } catch (error) {
    console.error("No se pudo leer de localStorage:", error);
    return [...listaInicial];
  }
}

// Crea un id nuevo con un prefijo, por ejemplo "P009" (productos) o "U003" (usuarios).
// Busca el número más alto que existe en la lista y le suma 1.
export function generarId(lista, prefijo) {
  const numeros = lista
    .map((item) => parseInt(String(item.id).replace(prefijo, ""), 10))
    .filter((numero) => !Number.isNaN(numero));
  const siguiente = numeros.length > 0 ? Math.max(...numeros) + 1 : 1;
  return prefijo + String(siguiente).padStart(3, "0");
}
