// Pruebas de EtiquetaEstado: el texto y el color dependen del estado de la orden (props).
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EtiquetaEstado } from "./EtiquetaEstado";

describe("EtiquetaEstado", () => {
  it("una orden pagada muestra 'Pagada' en verde", () => {
    render(<EtiquetaEstado estado="pagada" />);
    expect(screen.getByText("Pagada")).toHaveClass("bg-success");
  });

  it("cualquier otro estado muestra 'Rechazada' en rojo", () => {
    render(<EtiquetaEstado estado="rechazada" />);
    expect(screen.getByText("Rechazada")).toHaveClass("bg-danger");
  });
});
