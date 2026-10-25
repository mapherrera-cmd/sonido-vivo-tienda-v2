// Hook para usar el carrito desde cualquier componente:
//   const { items, agregar, quitar, cambiarCantidad, vaciar, total, cantidadTotal } = useCarrito();
import { useContext } from "react";
import { CarritoContext } from "../context/carritoContext";

export function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (contexto === null) {
    throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  }
  return contexto;
}
