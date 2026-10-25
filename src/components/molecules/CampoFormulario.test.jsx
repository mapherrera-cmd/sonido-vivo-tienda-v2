// Pruebas de CampoFormulario: etiqueta, tipos de control y mensaje de error (renderizado condicional).
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CampoFormulario } from "./CampoFormulario";

describe("CampoFormulario", () => {
  it("la etiqueta queda asociada al campo", () => {
    render(<CampoFormulario id="nombre" etiqueta="Nombre" value="" onChange={() => {}} />);
    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
  });

  it("sin error el campo no se marca como inválido", () => {
    render(<CampoFormulario id="nombre" etiqueta="Nombre" value="" onChange={() => {}} />);
    expect(screen.getByLabelText("Nombre")).not.toHaveClass("is-invalid");
  });

  it("con error marca el campo con is-invalid y muestra el mensaje", () => {
    render(<CampoFormulario id="nombre" etiqueta="Nombre" value="" onChange={() => {}} error="Ingresa tu nombre." />);
    expect(screen.getByLabelText("Nombre")).toHaveClass("is-invalid");
    expect(screen.getByText("Ingresa tu nombre.")).toBeInTheDocument();
  });

  it("si no es obligatorio muestra '(opcional)'", () => {
    render(<CampoFormulario id="depto" etiqueta="Departamento" obligatorio={false} value="" onChange={() => {}} />);
    expect(screen.getByText("(opcional)")).toBeInTheDocument();
  });

  it("tipo textarea dibuja un área de texto", () => {
    render(<CampoFormulario id="ind" etiqueta="Indicaciones" tipo="textarea" value="" onChange={() => {}} />);
    expect(screen.getByLabelText("Indicaciones").tagName).toBe("TEXTAREA");
  });

  it("tipo select dibuja las opciones recibidas más la opción vacía", () => {
    const opciones = [
      { valor: "a", texto: "Opción A" },
      { valor: "b", texto: "Opción B" },
    ];
    render(
      <CampoFormulario id="rol" etiqueta="Rol" tipo="select" textoVacio="-- Elige --" opciones={opciones} value="" onChange={() => {}} />
    );
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.getByRole("option", { name: "Opción B" })).toBeInTheDocument();
  });

  it("al escribir llama a onChange (mock)", async () => {
    const onChange = vi.fn();
    render(<CampoFormulario id="nombre" etiqueta="Nombre" value="" onChange={onChange} />);

    await userEvent.type(screen.getByLabelText("Nombre"), "ab");

    expect(onChange).toHaveBeenCalledTimes(2);
  });
});
