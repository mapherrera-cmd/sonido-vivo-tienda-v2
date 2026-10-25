// Pruebas de los cálculos del panel de administración.
import { describe, it, expect } from "vitest";
import {
  calcularVentasPorProducto,
  calcularVentasTotales,
  obtenerOrdenesDeUsuario,
  obtenerProductosCriticos,
} from "./reportes";
import { listaProductos, ordenesDePrueba } from "../testUtils/datosDePrueba";

describe("obtenerProductosCriticos", () => {
  it("devuelve los productos con stock de 5 o menos, del que menos tiene al que más", () => {
    const ids = obtenerProductosCriticos(listaProductos).map((p) => p.id);
    expect(ids).toEqual(["T003", "T004"]); // stock 0 y stock 3
  });

  it("permite cambiar el umbral", () => {
    const ids = obtenerProductosCriticos(listaProductos, 10).map((p) => p.id);
    expect(ids).toEqual(["T003", "T004", "T002"]);
  });
});

describe("calcularVentasTotales", () => {
  it("suma solo las órdenes pagadas (la rechazada no cuenta)", () => {
    expect(calcularVentasTotales(ordenesDePrueba)).toBe(4000);
  });
});

describe("calcularVentasPorProducto", () => {
  it("suma unidades e ingresos por producto y ordena por ingresos", () => {
    const resultado = calcularVentasPorProducto(ordenesDePrueba);
    expect(resultado).toEqual([
      { id: "P1", nombre: "Pedal", unidades: 3, ingresos: 3000 },
      { id: "P2", nombre: "Cuerdas", unidades: 2, ingresos: 1000 },
    ]);
  });
});

describe("obtenerOrdenesDeUsuario", () => {
  it("devuelve solo las órdenes del usuario, de la más nueva a la más antigua", () => {
    const ids = obtenerOrdenesDeUsuario(ordenesDePrueba, "U002").map((o) => o.id);
    expect(ids).toEqual(["ORD-003", "ORD-002"]);
  });
});
