// Pruebas de SelectorRegionComuna: las comunas dependen de la región elegida.
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectorRegionComuna } from "./SelectorRegionComuna";

describe("SelectorRegionComuna", () => {
  it("sin región, la lista de comunas solo tiene la opción vacía", () => {
    render(<SelectorRegionComuna region="" comuna="" onChange={() => {}} />);

    const comunas = screen.getByLabelText("Comuna");
    expect(within(comunas).getAllByRole("option")).toHaveLength(1);
    expect(screen.getByText("-- Selecciona primero una región --")).toBeInTheDocument();
  });

  it("con una región elegida muestra las comunas de esa región", () => {
    render(<SelectorRegionComuna region="metropolitana" comuna="" onChange={() => {}} />);

    expect(screen.getByRole("option", { name: "Santiago" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Concepción" })).not.toBeInTheDocument();
  });

  it("al cambiar la región avisa con la región nueva y la comuna borrada (mock)", async () => {
    const onChange = vi.fn();
    render(<SelectorRegionComuna region="" comuna="" onChange={onChange} />);

    await userEvent.selectOptions(screen.getByLabelText("Región"), "biobio");

    expect(onChange).toHaveBeenCalledWith({ region: "biobio", comuna: "" });
  });

  it("al elegir una comuna avisa solo la comuna (mock)", async () => {
    const onChange = vi.fn();
    render(<SelectorRegionComuna region="metropolitana" comuna="" onChange={onChange} />);

    await userEvent.selectOptions(screen.getByLabelText("Comuna"), "Santiago");

    expect(onChange).toHaveBeenCalledWith({ comuna: "Santiago" });
  });

  it("muestra los errores que recibe", () => {
    render(
      <SelectorRegionComuna region="" comuna="" onChange={() => {}} errorRegion="Selecciona una región." errorComuna="Selecciona una comuna." />
    );
    expect(screen.getByText("Selecciona una región.")).toBeInTheDocument();
    expect(screen.getByText("Selecciona una comuna.")).toBeInTheDocument();
  });
});
