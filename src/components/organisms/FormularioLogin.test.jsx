// Pruebas de FormularioLogin: estado del formulario, errores condicionales y envío con mock.
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormularioLogin } from "./FormularioLogin";

describe("FormularioLogin - estado", () => {
  it("el formulario cambia al escribir en los campos", async () => {
    const user = userEvent.setup();
    render(<FormularioLogin onSubmit={vi.fn()} />);
    const correo = screen.getByLabelText("Correo electrónico");
    const password = screen.getByLabelText("Contraseña");

    await user.type(correo, "max@duoc.cl");
    await user.type(password, "abcd");

    expect(correo).toHaveValue("max@duoc.cl");
    expect(password).toHaveValue("abcd");
  });
});

describe("FormularioLogin - renderizado condicional de errores", () => {
  it("la alerta general solo aparece cuando recibe errorGeneral", () => {
    const { rerender } = render(<FormularioLogin onSubmit={vi.fn()} />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    rerender(<FormularioLogin onSubmit={vi.fn()} errorGeneral="Correo o contraseña incorrectos." />);
    expect(screen.getByRole("alert")).toHaveTextContent("Correo o contraseña incorrectos.");
  });

  it("al enviar vacío muestra los errores, marca los campos is-invalid y no llama a onSubmit", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<FormularioLogin onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(screen.getByText("Ingresa tu correo electrónico.")).toBeInTheDocument();
    expect(screen.getByText("Ingresa tu contraseña.")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo electrónico")).toHaveClass("is-invalid");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rechaza un correo con dominio no permitido", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<FormularioLogin onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Correo electrónico"), "alguien@hotmail.com");
    await user.type(screen.getByLabelText("Contraseña"), "abcd");
    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(screen.getByText(/Solo se permiten correos/)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("el error de un campo desaparece cuando la persona empieza a corregirlo", async () => {
    const user = userEvent.setup();
    render(<FormularioLogin onSubmit={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(screen.getByText("Ingresa tu correo electrónico.")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Correo electrónico"), "m");

    expect(screen.queryByText("Ingresa tu correo electrónico.")).not.toBeInTheDocument();
  });
});

describe("FormularioLogin - envío", () => {
  it("con datos válidos llama a onSubmit con el correo en minúsculas", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<FormularioLogin onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Correo electrónico"), "Max@Duoc.cl");
    await user.type(screen.getByLabelText("Contraseña"), "abcd");
    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({ correo: "max@duoc.cl", password: "abcd" });
  });
});
