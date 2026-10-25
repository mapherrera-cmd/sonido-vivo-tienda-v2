// Ayuda para las pruebas de páginas: dibuja TODA la aplicación (rutas + sesión + carrito)
// partiendo en la ruta que indiquemos, sin abrir un navegador real.
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { CarritoProvider } from "../context/CarritoProvider";
import { SesionProvider } from "../context/SesionProvider";
import { obtenerOrdenes, crearOrden } from "../data/ordenes";

// Ids de los usuarios iniciales (ver data/usuarios.js)
export const ID_ADMIN = "U001";
export const ID_CLIENTE = "U002";

// ruta: URL donde parte la app, por ejemplo "/productos".
// usuarioId: si se entrega, se deja una sesión iniciada antes de dibujar.
// carrito: lista de items que ya estarían guardados en el carrito.
export function renderizarApp(ruta = "/", { usuarioId = null, carrito = null } = {}) {
  if (usuarioId) localStorage.setItem("sv_sesion", usuarioId);
  if (carrito) localStorage.setItem("sv_carrito", JSON.stringify(carrito));

  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <SesionProvider>
        <CarritoProvider>
          <App />
        </CarritoProvider>
      </SesionProvider>
    </MemoryRouter>
  );
}

// Un producto ya puesto en el carrito (2 pedales a $49.990 = $99.980)
export const ITEM_PEDAL = {
  id: "P004",
  nombre: "Pedal Boss Distortion DS-1",
  img: "/img/pedal.jpg",
  stock: 20,
  precio: 49990,
  cantidad: 2,
};

// Guarda una orden de ejemplo y la devuelve (para probar boletas, historial y reportes)
export function guardarOrdenDePrueba({ estado = "pagada", usuarioId = ID_CLIENTE, departamento = "", indicaciones = "" } = {}) {
  return crearOrden({
    usuarioId,
    cliente: { nombre: "Javiera", apellidos: "Sanches", correo: "javi@gmail.com" },
    entrega: { calle: "Los Alerces 123", departamento, region: "metropolitana", comuna: "Santiago", indicaciones },
    items: [{ id: "P004", nombre: "Pedal Boss Distortion DS-1", img: "/img/pedal.jpg", precio: 49990, cantidad: 2 }],
    total: 99980,
    estado,
  });
}

// Cuántas órdenes hay guardadas (atajo para las comprobaciones)
export function cantidadDeOrdenes() {
  return obtenerOrdenes().length;
}
