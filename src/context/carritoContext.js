// Aquí solo se crea el "contexto" del carrito: un espacio compartido por toda la app.
// Quien lo llena es CarritoProvider; quien lo lee es el hook useCarrito.
import { createContext } from "react";

export const CarritoContext = createContext(null);
