// Pruebas del CRUD de productos (Crear, Leer, Actualizar, Eliminar) sobre localStorage.
// setupTests.js limpia localStorage después de cada prueba, así cada una parte "de cero".
import { describe, it, expect, vi } from "vitest";
import {
  PRODUCTOS_INICIALES,
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  obtenerPrecioFinal,
  obtenerProductoPorId,
  obtenerProductos,
} from "./productos";

describe("productos - leer", () => {
  it("la primera vez devuelve los productos iniciales y los guarda", () => {
    const productos = obtenerProductos();
    expect(productos).toHaveLength(PRODUCTOS_INICIALES.length);
    expect(localStorage.getItem("sv_productos")).not.toBeNull();
  });

  it("obtenerProductoPorId devuelve el producto que existe", () => {
    expect(obtenerProductoPorId("P001").nombre).toBe("Guitarra Fender Stratocaster");
  });

  it("obtenerProductoPorId devuelve null si no existe", () => {
    expect(obtenerProductoPorId("NO-EXISTE")).toBeNull();
  });
});

describe("productos - crear", () => {
  it("agrega un producto con id nuevo y valores por defecto", () => {
    const cantidadAntes = obtenerProductos().length;

    const nuevo = crearProducto({ nombre: "Cuerdas Ernie Ball", precio: 12000, categoria: "C004" });

    expect(nuevo.id).toBe("P009"); // los iniciales llegan hasta P008
    expect(nuevo.stock).toBe(0);
    expect(nuevo.oferta).toBe(false);
    expect(obtenerProductos()).toHaveLength(cantidadAntes + 1);
  });

  it("guarda en localStorage (mock con spyOn)", () => {
    obtenerProductos(); // la primera lectura también guarda; la dejamos fuera de la comprobación
    const espia = vi.spyOn(Storage.prototype, "setItem");

    crearProducto({ nombre: "Capodastro", precio: 9000, categoria: "C004" });

    expect(espia).toHaveBeenCalledWith("sv_productos", expect.stringContaining("Capodastro"));
  });
});

describe("productos - actualizar", () => {
  it("cambia los campos indicados y mantiene el id", () => {
    const actualizado = actualizarProducto("P005", { precio: 700000, id: "OTRO" });

    expect(actualizado.precio).toBe(700000);
    expect(actualizado.id).toBe("P005"); // el id no se puede cambiar
    expect(obtenerProductoPorId("P005").precio).toBe(700000); // quedó guardado
  });

  it("devuelve null si el producto no existe", () => {
    expect(actualizarProducto("NO-EXISTE", { precio: 1 })).toBeNull();
  });
});

describe("productos - eliminar", () => {
  it("borra el producto y devuelve true", () => {
    const resultado = eliminarProducto("P001");

    expect(resultado).toBe(true);
    expect(obtenerProductoPorId("P001")).toBeNull();
    expect(obtenerProductos()).toHaveLength(PRODUCTOS_INICIALES.length - 1);
  });

  it("devuelve false si el producto no existe", () => {
    expect(eliminarProducto("NO-EXISTE")).toBe(false);
  });
});

describe("obtenerPrecioFinal", () => {
  it("devuelve el precio de oferta si el producto está en oferta", () => {
    expect(obtenerPrecioFinal({ precio: 1000, oferta: true, precioOferta: 800 })).toBe(800);
  });

  it("devuelve el precio normal si no está en oferta", () => {
    expect(obtenerPrecioFinal({ precio: 1000, oferta: false, precioOferta: 0 })).toBe(1000);
  });
});
