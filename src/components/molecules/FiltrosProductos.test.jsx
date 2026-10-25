// Pruebas de FiltrosProductos: cada control avisa su cambio con onCambio(nombre, valor).
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FiltrosProductos } from "./FiltrosProductos";

const categorias = [
  { id: "C001", nombre: "Cuerdas" },
  { id: "C002", nombre: "Percusión" },
];

function dibujarFiltros(onCambio = () => {}) {
  render(<FiltrosProductos buscar="" categoria="" orden="" categorias={categorias} onCambio={onCambio} />);
}

describe("FiltrosProductos", () => {
  it("muestra una opción por cada categoría más 'Todas las categorías'", () => {
    dibujarFiltros();
    expect(screen.getByRole("option", { name: "Todas las categorías" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Cuerdas" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Percusión" })).toBeInTheDocument();
  });

  it("al escribir en la búsqueda avisa con onCambio('buscar', texto) (mock)", async () => {
    const onCambio = vi.fn();
    dibujarFiltros(onCambio);

    await userEvent.type(screen.getByLabelText("Buscar productos"), "g");

    expect(onCambio).toHaveBeenCalledWith("buscar", "g");
  });

  it("al elegir una categoría avisa con su id (mock)", async () => {
    const onCambio = vi.fn();
    dibujarFiltros(onCambio);

    await userEvent.selectOptions(screen.getByLabelText("Filtrar por categoría"), "C002");

    expect(onCambio).toHaveBeenCalledWith("categoria", "C002");
  });

  it("al elegir un orden avisa con 'menor' o 'mayor' (mock)", async () => {
    const onCambio = vi.fn();
    dibujarFiltros(onCambio);

    await userEvent.selectOptions(screen.getByLabelText("Ordenar por precio"), "menor");

    expect(onCambio).toHaveBeenCalledWith("orden", "menor");
  });
});
