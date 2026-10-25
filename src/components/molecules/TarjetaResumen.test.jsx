// Pruebas de TarjetaResumen: muestra título y valor; el detalle y el color dependen de las props.
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TarjetaResumen } from "./TarjetaResumen";

describe("TarjetaResumen", () => {
  it("muestra el título y el valor", () => {
    render(<TarjetaResumen titulo="Productos" valor={8} />);
    expect(screen.getByText("Productos")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("usa el color primary por defecto y aplica el color que reciba", () => {
    const { container, rerender } = render(<TarjetaResumen titulo="Productos" valor={8} />);
    expect(container.querySelector(".card")).toHaveClass("bg-primary");

    rerender(<TarjetaResumen titulo="Productos" valor={8} color="success" />);
    expect(container.querySelector(".card")).toHaveClass("bg-success");
  });

  it("el detalle solo aparece si se entrega (renderizado condicional)", () => {
    const { rerender } = render(<TarjetaResumen titulo="Ventas" valor={1} />);
    expect(screen.queryByText("Solo pagadas")).not.toBeInTheDocument();

    rerender(<TarjetaResumen titulo="Ventas" valor={1} detalle="Solo pagadas" />);
    expect(screen.getByText("Solo pagadas")).toBeInTheDocument();
  });
});
