// Regiones y comunas disponibles para el registro y el checkout.
// Son las mismas que tenía el formulario antiguo (legacy/validaciones.js).
// "id" es lo que se guarda en el usuario y en la orden; "nombre" es lo que ve la persona.
export const REGIONES = [
  {
    id: "valparaiso",
    nombre: "Región de Valparaíso",
    comunas: ["Viña del Mar", "Valparaíso", "Quilpué", "Concón"],
  },
  {
    id: "metropolitana",
    nombre: "Región Metropolitana",
    comunas: ["Santiago", "Providencia", "Maipú", "Las Condes"],
  },
  {
    id: "biobio",
    nombre: "Región del Biobío",
    comunas: ["Concepción", "Talcahuano", "Chillán"],
  },
];

// Devuelve las comunas de una región (lista vacía si la región no existe o está vacía)
export function obtenerComunas(idRegion) {
  const region = REGIONES.find((r) => r.id === idRegion);
  return region ? region.comunas : [];
}

// Devuelve el nombre legible de una región ("" si no existe)
export function obtenerNombreRegion(idRegion) {
  const region = REGIONES.find((r) => r.id === idRegion);
  return region ? region.nombre : "";
}
