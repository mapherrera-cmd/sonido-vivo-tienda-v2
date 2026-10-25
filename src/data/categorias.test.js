// Pruebas del CRUD de categorías (guardado en localStorage).
import { describe, it, expect } from "vitest";
import {
  CATEGORIAS_INICIALES,
  obtenerCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "./categorias";

describe("categorias - leer", () => {
  it("la primera vez devuelve las categorías iniciales", () => {
    expect(obtenerCategorias()).toHaveLength(CATEGORIAS_INICIALES.length);
  });

  it("obtenerCategoriaPorId devuelve la categoría, o null si no existe", () => {
    expect(obtenerCategoriaPorId("C002").nombre).toBe("Percusión");
    expect(obtenerCategoriaPorId("C999")).toBeNull();
  });
});

describe("categorias - crear, actualizar y eliminar", () => {
  it("crearCategoria agrega una con id nuevo e imagen vacía por defecto", () => {
    const nueva = crearCategoria({ nombre: "Vientos" });

    expect(nueva.id).toBe("C005");
    expect(nueva.img).toBe("");
    expect(obtenerCategorias()).toHaveLength(CATEGORIAS_INICIALES.length + 1);
  });

  it("actualizarCategoria cambia el nombre y mantiene el id", () => {
    const actualizada = actualizarCategoria("C001", { nombre: "Cuerdas", id: "OTRO" });

    expect(actualizada).toMatchObject({ id: "C001", nombre: "Cuerdas" });
    expect(obtenerCategoriaPorId("C001").nombre).toBe("Cuerdas");
  });

  it("actualizarCategoria devuelve null si no existe", () => {
    expect(actualizarCategoria("C999", { nombre: "X" })).toBeNull();
  });

  it("eliminarCategoria devuelve true si la borra y false si no existía", () => {
    expect(eliminarCategoria("C004")).toBe(true);
    expect(obtenerCategoriaPorId("C004")).toBeNull();
    expect(eliminarCategoria("C004")).toBe(false);
  });
});
