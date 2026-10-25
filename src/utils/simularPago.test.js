// Pruebas de la simulación del pago. Al recibir el número aleatorio por parámetro,
// podemos probarla con valores fijos (sin depender de Math.random).
import { describe, it, expect } from "vitest";
import { PROBABILIDAD_EXITO, simularPago } from "./simularPago";

describe("simularPago", () => {
  it("aprueba el pago si el número es menor a la probabilidad de éxito", () => {
    expect(simularPago(0)).toBe(true);
    expect(simularPago(PROBABILIDAD_EXITO - 0.01)).toBe(true);
  });

  it("rechaza el pago si el número es igual o mayor a la probabilidad de éxito", () => {
    expect(simularPago(PROBABILIDAD_EXITO)).toBe(false);
    expect(simularPago(0.99)).toBe(false);
  });
});
