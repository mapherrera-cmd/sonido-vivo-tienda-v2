// Pruebas de casos que faltaban en la capa de datos:
// actualizarOrden (existe / no existe) y la lista de imágenes del admin.
import { describe, it, expect } from "vitest";
import { actualizarOrden, crearOrden, obtenerOrdenPorId } from "./ordenes";
import { IMAGENES_DISPONIBLES } from "./imagenes";

describe("actualizarOrden", () => {
  it("cambia el estado de una orden existente", () => {
    const orden = crearOrden({ estado: "rechazada", usuarioId: "U002", items: [], total: 1000 });

    const actualizada = actualizarOrden(orden.id, { estado: "pagada" });

    expect(actualizada.estado).toBe("pagada");
    expect(obtenerOrdenPorId(orden.id).estado).toBe("pagada");
  });

  it("devuelve null si la orden no existe", () => {
    expect(actualizarOrden("ORD-999", { estado: "pagada" })).toBeNull();
  });
});

describe("IMAGENES_DISPONIBLES", () => {
  it("cada imagen tiene una ruta dentro de /img/ y un texto", () => {
    expect(IMAGENES_DISPONIBLES.length).toBeGreaterThan(0);
    IMAGENES_DISPONIBLES.forEach((imagen) => {
      expect(imagen.valor.startsWith("/img/")).toBe(true);
      expect(imagen.texto).not.toBe("");
    });
  });
});
