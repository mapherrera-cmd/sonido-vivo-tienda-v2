// Pruebas de Cart: renderizado condicional (vacío / con productos), total y eventos con mocks.
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Cart } from "./Cart";

// Dos productos: 2 x $1.000 = $2.000 y 1 x $500 = $500  ->  total $2.500
const items = [
  { id: "P001", nombre: "Guitarra", img: "/img/guitarra.jpg", stock: 5, precio: 1000, cantidad: 2 },
  { id: "P002", nombre: "Pedal", img: "/img/pedal.jpg", stock: 5, precio: 500, cantidad: 1 },
];

// Crea todas las funciones falsas (mocks) y renderiza el carrito
function renderizarCarrito(itemsDelCarrito = items) {
  const props = {
    items: itemsDelCarrito,
    total: 2500,
    onChangeQty: vi.fn(),
    onRemove: vi.fn(),
    onClear: vi.fn(),
    onBuy: vi.fn(),
  };
  render(
    <MemoryRouter>
      <Cart {...props} />
    </MemoryRouter>
  );
  return props;
}

describe("Cart - renderizado condicional", () => {
  it("con el carrito vacío muestra el aviso y no muestra la tabla", () => {
    renderizarCarrito([]);

    expect(screen.getByText(/Tu carrito está vacío/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver productos" })).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("con productos muestra cada fila, los subtotales y el total", () => {
    renderizarCarrito();

    expect(screen.getByText("Guitarra")).toBeInTheDocument();
    expect(screen.getByText("Pedal")).toBeInTheDocument();
    expect(screen.getByText("$2.000")).toBeInTheDocument(); // subtotal de la guitarra
    expect(screen.getByText("$2.500")).toBeInTheDocument(); // total
    expect(screen.queryByText(/Tu carrito está vacío/)).not.toBeInTheDocument();
  });
});

describe("Cart - eventos", () => {
  it("Eliminar llama a onRemove con el id del producto", async () => {
    const user = userEvent.setup();
    const props = renderizarCarrito();

    await user.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);

    expect(props.onRemove).toHaveBeenCalledWith("P001");
  });

  it("los botones + y - piden cambiar la cantidad en 1", async () => {
    const user = userEvent.setup();
    const props = renderizarCarrito();

    await user.click(screen.getAllByRole("button", { name: "+" })[0]);
    await user.click(screen.getAllByRole("button", { name: "-" })[0]);

    expect(props.onChangeQty).toHaveBeenNthCalledWith(1, "P001", 3); // 2 + 1
    expect(props.onChangeQty).toHaveBeenNthCalledWith(2, "P001", 1); // 2 - 1
  });

  it("al escribir una cantidad válida llama a onChangeQty, y si es inválida la ignora", () => {
    const props = renderizarCarrito();
    const campo = screen.getByLabelText("Cantidad de Guitarra");

    fireEvent.change(campo, { target: { value: "4" } });
    expect(props.onChangeQty).toHaveBeenCalledWith("P001", 4);

    props.onChangeQty.mockClear();
    fireEvent.change(campo, { target: { value: "0" } });
    expect(props.onChangeQty).not.toHaveBeenCalled();
  });

  it("Limpiar y Comprar ahora llaman a sus funciones", async () => {
    const user = userEvent.setup();
    const props = renderizarCarrito();

    await user.click(screen.getByRole("button", { name: "Limpiar" }));
    await user.click(screen.getByRole("button", { name: "Comprar ahora" }));

    expect(props.onClear).toHaveBeenCalledTimes(1);
    expect(props.onBuy).toHaveBeenCalledTimes(1);
  });
});
