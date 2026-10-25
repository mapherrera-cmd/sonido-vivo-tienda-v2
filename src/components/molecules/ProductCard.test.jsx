// Pruebas de ProductCard: props, formato de precio es-CL, oferta, stock y evento onAdd.
// ProductCard usa <Link>, por eso se renderiza dentro de un MemoryRouter (router "falso" para pruebas).
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import { productoAgotado, productoConOferta, productoNormal } from "../../testUtils/datosDePrueba";

function renderizarTarjeta(producto, onAdd = vi.fn()) {
  render(
    <MemoryRouter>
      <ProductCard producto={producto} onAdd={onAdd} />
    </MemoryRouter>
  );
}

describe("ProductCard", () => {
  it("muestra el nombre y el precio con formato es-CL", () => {
    renderizarTarjeta(productoNormal);

    expect(screen.getByText("Amplificador de Prueba")).toBeInTheDocument();
    expect(screen.getByText("$85.000")).toBeInTheDocument();
  });

  it("en oferta muestra el precio normal tachado y el precio de oferta", () => {
    renderizarTarjeta(productoConOferta);

    expect(screen.getByText("$850.000")).toHaveClass("text-decoration-line-through");
    expect(screen.getByText("$765.000")).toBeInTheDocument();
  });

  it("sin oferta no muestra ningún precio tachado", () => {
    renderizarTarjeta(productoNormal);
    expect(screen.queryByText("$850.000")).not.toBeInTheDocument();
    expect(document.querySelector(".text-decoration-line-through")).toBeNull();
  });

  it("el enlace de detalle apunta a /productos/:id", () => {
    renderizarTarjeta(productoNormal);
    expect(screen.getByRole("link", { name: "Ver detalle" })).toHaveAttribute("href", "/productos/T002");
  });

  it("al hacer clic en Agregar llama a onAdd con el producto (mock)", async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    renderizarTarjeta(productoNormal, onAdd);

    await user.click(screen.getByRole("button", { name: "Agregar al carrito" }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith(productoNormal);
  });

  it("sin stock muestra el botón Agotado deshabilitado", () => {
    renderizarTarjeta(productoAgotado);

    const boton = screen.getByRole("button", { name: "Agotado" });
    expect(boton).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Agregar al carrito" })).not.toBeInTheDocument();
  });
});
