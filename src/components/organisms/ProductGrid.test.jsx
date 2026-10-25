// Pruebas de ProductGrid: dibuja una tarjeta por producto y avisa si no hay productos.
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProductGrid } from "./ProductGrid";
import { listaProductos } from "../../testUtils/datosDePrueba";

describe("ProductGrid", () => {
  it("dibuja una tarjeta por cada producto de la lista", () => {
    render(
      <MemoryRouter>
        <ProductGrid productos={listaProductos} onAdd={() => {}} />
      </MemoryRouter>
    );

    // Cada tarjeta tiene un enlace "Ver detalle": contarlos es contar tarjetas
    expect(screen.getAllByRole("link", { name: "Ver detalle" })).toHaveLength(listaProductos.length);
    expect(screen.getByText("Guitarra de Prueba")).toBeInTheDocument();
    expect(screen.getByText("Pedal de Prueba")).toBeInTheDocument();
  });

  it("si la lista está vacía muestra un aviso y ninguna tarjeta (renderizado condicional)", () => {
    render(
      <MemoryRouter>
        <ProductGrid productos={[]} onAdd={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText("No hay productos para mostrar.")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Ver detalle" })).not.toBeInTheDocument();
  });
});
