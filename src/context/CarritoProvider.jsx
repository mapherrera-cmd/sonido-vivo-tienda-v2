// Guarda el carrito en un solo lugar y lo comparte con todas las páginas.
// Cada vez que el carrito cambia, se guarda en localStorage (así sobrevive a recargar).
import { useEffect, useState } from "react";
import { CarritoContext } from "./carritoContext";
import { guardarLista, leerLista } from "../data/almacenamiento";
import { obtenerPrecioFinal } from "../data/productos";

const CLAVE_CARRITO = "sv_carrito";

export function CarritoProvider({ children }) {
  // Al iniciar, lee el carrito guardado (o una lista vacía si no hay nada)
  const [items, setItems] = useState(() => leerLista(CLAVE_CARRITO, []));

  // Cada vez que "items" cambia, lo guarda en localStorage
  useEffect(() => {
    guardarLista(CLAVE_CARRITO, items);
  }, [items]);

  // Agrega 1 unidad del producto (sin pasarse del stock disponible)
  const agregar = (producto) => {
    if (producto.stock <= 0) return;

    setItems((anteriores) => {
      const existe = anteriores.find((item) => item.id === producto.id);
      if (existe) {
        return anteriores.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: Math.min(item.cantidad + 1, item.stock) }
            : item
        );
      }
      // Producto nuevo en el carrito: guarda los datos necesarios y el precio que se cobra
      return [
        ...anteriores,
        {
          id: producto.id,
          nombre: producto.nombre,
          img: producto.img,
          stock: producto.stock,
          precio: obtenerPrecioFinal(producto),
          cantidad: 1,
        },
      ];
    });
  };

  // Saca un producto del carrito
  const quitar = (id) => {
    setItems((anteriores) => anteriores.filter((item) => item.id !== id));
  };

  // Cambia la cantidad de un producto (si queda en 0 o menos, se quita)
  const cambiarCantidad = (id, cantidad) => {
    if (cantidad < 1) {
      quitar(id);
      return;
    }
    setItems((anteriores) =>
      anteriores.map((item) =>
        item.id === id ? { ...item, cantidad: Math.min(cantidad, item.stock) } : item
      )
    );
  };

  // Deja el carrito vacío
  const vaciar = () => setItems([]);

  // Valores calculados a partir de los items
  const total = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
  const cantidadTotal = items.reduce((suma, item) => suma + item.cantidad, 0);

  const valor = { items, agregar, quitar, cambiarCantidad, vaciar, total, cantidadTotal };

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}
