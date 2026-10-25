// Pruebas de TablaResumenItems: dibuja una fila por producto y el total con formato es-CL.
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TablaResumenItems } from "./TablaResumenItems";

const items = [
  { id: "1", nombre: "Guitarra", img: "/img/guitarra.jpg", precio: 1000, cantidad: 2 },
  { id: "2", nombre: "Pedal", img: "/img/pedal.jpg", precio: 500, cantidad: 1 },
];

describe("TablaResumenItems", () => {
  it("dibuja encabezado, una fila por producto y la fila del total", () => {
    render(<TablaResumenItems items={items} total={2500} />);

    // 1 encabezado + 2 productos + 1 total
    expect(screen.getAllByRole("row")).toHaveLength(4);
    expect(screen.getByText("Guitarra")).toBeInTheDocument();
    expect(screen.getByText("Pedal")).toBeInTheDocument();
  });

  it("muestra el total con formato es-CL y la etiqueta que recibe (props)", () => {
    render(<TablaResumenItems items={items} total={2500} etiquetaTotal="Total pagado" />);

    expect(screen.getByText("Total pagado")).toBeInTheDocument();
    expect(screen.getByText("$2.500")).toBeInTheDocument();
  });

  it("cada imagen tiene texto alternativo con el nombre del producto", () => {
    render(<TablaResumenItems items={items} total={2500} />);
    expect(screen.getByAltText("Guitarra")).toBeInTheDocument();
  });
});
