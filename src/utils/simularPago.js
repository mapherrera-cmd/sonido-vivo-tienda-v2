// Simula el resultado de un pago (no hay banco real).
// Regla simple: el pago se aprueba con un 70 % de probabilidad.
// Recibe un número entre 0 y 1 (normalmente Math.random()); así se puede probar con valores fijos.
export const PROBABILIDAD_EXITO = 0.7;

export function simularPago(numeroAleatorio) {
  return numeroAleatorio < PROBABILIDAD_EXITO;
}
