// Pruebas de las órdenes de compra (guardadas en localStorage).
import { describe, it, expect } from "vitest";
import { obtenerOrdenes, obtenerOrdenPorId, crearOrden, actualizarOrden } from "./ordenes";

const datosOrden = { estado: "pagada", usuarioId: "U002", items: [], total: 1000 };

describe("ordenes", () => {
  it("al inicio no hay órdenes", () => {
    expect(obtenerOrdenes()).toEqual([]);
  });

  it("crearOrden le pone el número ORD-001 y una fecha válida", () => {
    const orden = crearOrden(datosOrden);

    expect(orden.id).toBe("ORD-001");
    expect(new Date(orden.fecha).toISOString()).toBe(orden.fecha);
    expect(orden.total).toBe(1000);
  });

  it("la segunda orden recibe el número siguiente", () => {
    crearOrden(datosOrden);
    expect(crearOrden(datosOrden).id).toBe("ORD-002");
    expect(obtenerOrdenes()).toHaveLength(2);
  });

  it("obtenerOrdenPorId devuelve la orden, o null si no existe", () => {
    crearOrden(datosOrden);

    expect(obtenerOrdenPorId("ORD-001").usuarioId).toBe("U002");
    expect(obtenerOrdenPorId("ORD-999")).toBeNull();
  });

  it("actualizarOrden cambia el estado y mantiene el id", () => {
    crearOrden({ ...datosOrden, estado: "rechazada" });

    const actualizada = actualizarOrden("ORD-001", { estado: "pagada", id: "OTRO" });

    expect(actualizada).toMatchObject({ id: "ORD-001", estado: "pagada" });
    expect(obtenerOrdenPorId("ORD-001").estado).toBe("pagada");
  });

  it("actualizarOrden devuelve null si no existe", () => {
    expect(actualizarOrden("ORD-999", { estado: "pagada" })).toBeNull();
  });
});
