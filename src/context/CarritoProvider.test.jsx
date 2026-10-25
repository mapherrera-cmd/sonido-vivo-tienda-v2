// Pruebas del carrito (estado compartido + persistencia en localStorage).
// Se usa un componente pequeño, solo para pruebas, que muestra los valores del carrito y tiene botones.
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CarritoProvider } from "./CarritoProvider";
import { useCarrito } from "../hooks/useCarrito";
import { productoAgotado, productoConOferta } from "../testUtils/datosDePrueba";

// Producto con stock 2 para probar el límite
const producto = { ...productoConOferta, id: "P100", stock: 2, precio: 1000, oferta: true, precioOferta: 800 };

function PanelDePrueba({ productoAAgregar = producto }) {
  const { items, agregar, quitar, cambiarCantidad, vaciar, total, cantidadTotal } = useCarrito();
  return (
    <div>
      <p data-testid="lineas">{items.length}</p>
      <p data-testid="unidades">{cantidadTotal}</p>
      <p data-testid="total">{total}</p>
      <button onClick={() => agregar(productoAAgregar)}>agregar</button>
      <button onClick={() => quitar(productoAAgregar.id)}>quitar</button>
      <button onClick={() => cambiarCantidad(productoAAgregar.id, 0)}>cantidad cero</button>
      <button onClick={() => vaciar()}>vaciar</button>
    </div>
  );
}

function renderizarCarrito(productoAAgregar) {
  return render(
    <CarritoProvider>
      <PanelDePrueba productoAAgregar={productoAAgregar} />
    </CarritoProvider>
  );
}

describe("CarritoProvider - estado", () => {
  it("empieza vacío", () => {
    renderizarCarrito();
    expect(screen.getByTestId("unidades")).toHaveTextContent("0");
    expect(screen.getByTestId("total")).toHaveTextContent("0");
  });

  it("agregar dos veces el mismo producto sube la cantidad, no crea otra línea", async () => {
    const user = userEvent.setup();
    renderizarCarrito();

    await user.click(screen.getByRole("button", { name: "agregar" }));
    await user.click(screen.getByRole("button", { name: "agregar" }));

    expect(screen.getByTestId("lineas")).toHaveTextContent("1");
    expect(screen.getByTestId("unidades")).toHaveTextContent("2");
  });

  it("cobra el precio de oferta en el total", async () => {
    const user = userEvent.setup();
    renderizarCarrito();

    await user.click(screen.getByRole("button", { name: "agregar" }));
    await user.click(screen.getByRole("button", { name: "agregar" }));

    expect(screen.getByTestId("total")).toHaveTextContent("1600"); // 2 x 800
  });

  it("no deja agregar más unidades que el stock", async () => {
    const user = userEvent.setup();
    renderizarCarrito();

    await user.click(screen.getByRole("button", { name: "agregar" }));
    await user.click(screen.getByRole("button", { name: "agregar" }));
    await user.click(screen.getByRole("button", { name: "agregar" })); // tercera: stock es 2

    expect(screen.getByTestId("unidades")).toHaveTextContent("2");
  });

  it("no agrega un producto agotado", async () => {
    const user = userEvent.setup();
    renderizarCarrito(productoAgotado);

    await user.click(screen.getByRole("button", { name: "agregar" }));

    expect(screen.getByTestId("lineas")).toHaveTextContent("0");
  });

  it("cambiar la cantidad a 0 quita el producto", async () => {
    const user = userEvent.setup();
    renderizarCarrito();
    await user.click(screen.getByRole("button", { name: "agregar" }));

    await user.click(screen.getByRole("button", { name: "cantidad cero" }));

    expect(screen.getByTestId("lineas")).toHaveTextContent("0");
  });

  it("vaciar deja el carrito en cero", async () => {
    const user = userEvent.setup();
    renderizarCarrito();
    await user.click(screen.getByRole("button", { name: "agregar" }));

    await user.click(screen.getByRole("button", { name: "vaciar" }));

    expect(screen.getByTestId("unidades")).toHaveTextContent("0");
  });
});

describe("CarritoProvider - localStorage", () => {
  it("guarda el carrito en localStorage cada vez que cambia (mock con spyOn)", async () => {
    const espia = vi.spyOn(Storage.prototype, "setItem");
    const user = userEvent.setup();
    renderizarCarrito();

    await user.click(screen.getByRole("button", { name: "agregar" }));

    expect(espia).toHaveBeenCalledWith("sv_carrito", expect.stringContaining("P100"));
  });

  it("el carrito sobrevive a una recarga: al volver a montar lee lo guardado", async () => {
    const user = userEvent.setup();
    const primera = renderizarCarrito();
    await user.click(screen.getByRole("button", { name: "agregar" }));
    primera.unmount(); // equivale a cerrar o recargar la página

    renderizarCarrito(); // la app "arranca" de nuevo

    expect(screen.getByTestId("unidades")).toHaveTextContent("1");
  });
});
