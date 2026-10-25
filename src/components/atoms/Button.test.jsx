// Pruebas del componente Button: renderizado, props y eventos.
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("muestra el texto que recibe (renderizado)", () => {
    render(<Button>Comprar</Button>);
    expect(screen.getByRole("button", { name: "Comprar" })).toBeInTheDocument();
  });

  it("usa la variante primary por defecto y aplica la variant que reciba (props)", () => {
    const { rerender } = render(<Button>Aceptar</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-primary");

    rerender(<Button variant="danger">Aceptar</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-danger");
  });

  it("ejecuta onClick al hacer clic (evento con mock)", async () => {
    // Arrange: vi.fn() crea una función falsa que recuerda cómo la llamaron
    const alHacerClic = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={alHacerClic}>Hacer clic</Button>);
    // Act
    await user.click(screen.getByRole("button", { name: "Hacer clic" }));
    // Assert
    expect(alHacerClic).toHaveBeenCalledTimes(1);
  });

  it("no ejecuta onClick si está deshabilitado", async () => {
    const alHacerClic = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={alHacerClic} disabled>Agotado</Button>);

    await user.click(screen.getByRole("button", { name: "Agotado" }));

    expect(screen.getByRole("button")).toBeDisabled();
    expect(alHacerClic).not.toHaveBeenCalled();
  });
});
