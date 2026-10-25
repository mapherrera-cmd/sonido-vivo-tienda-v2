// Pruebas de CategoriaCard: enlace a /categorias/:id y resaltado cuando está activa.
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CategoriaCard } from "./CategoriaCard";

const categoria = { id: "C001", nombre: "Instrumentos de Cuerda", img: "/img/guitarra.jpg" };

function dibujar(activa) {
  render(
    <MemoryRouter>
      <CategoriaCard categoria={categoria} activa={activa} />
    </MemoryRouter>
  );
  return screen.getByRole("link");
}

describe("CategoriaCard", () => {
  it("muestra el nombre y la imagen de la categoría", () => {
    dibujar(false);
    expect(screen.getByText("Instrumentos de Cuerda")).toBeInTheDocument();
    expect(screen.getByAltText("Instrumentos de Cuerda")).toHaveAttribute("src", "/img/guitarra.jpg");
  });

  it("el enlace apunta a /categorias/:id", () => {
    expect(dibujar(false)).toHaveAttribute("href", "/categorias/C001");
  });

  it("solo se resalta cuando está activa", () => {
    expect(dibujar(true)).toHaveClass("border-primary");
  });

  it("sin activa no se resalta", () => {
    expect(dibujar(false)).not.toHaveClass("border-primary");
  });
});
