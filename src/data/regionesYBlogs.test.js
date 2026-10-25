// Pruebas de las funciones de búsqueda de regiones/comunas y de blogs.
import { describe, it, expect } from "vitest";
import { obtenerComunas, obtenerNombreRegion } from "./regiones";
import { obtenerBlogPorId } from "./blogs";

describe("regiones", () => {
  it("obtenerComunas devuelve las comunas de la región pedida", () => {
    expect(obtenerComunas("metropolitana")).toContain("Santiago");
    expect(obtenerComunas("biobio")).toContain("Concepción");
  });

  it("obtenerComunas devuelve lista vacía si la región no existe o viene vacía", () => {
    expect(obtenerComunas("marte")).toEqual([]);
    expect(obtenerComunas("")).toEqual([]);
  });

  it("obtenerNombreRegion devuelve el nombre legible, o texto vacío si no existe", () => {
    expect(obtenerNombreRegion("valparaiso")).toBe("Región de Valparaíso");
    expect(obtenerNombreRegion("marte")).toBe("");
  });
});

describe("blogs", () => {
  it("obtenerBlogPorId devuelve el artículo pedido", () => {
    expect(obtenerBlogPorId("1").titulo).toMatch(/Stratocaster/);
  });

  it("obtenerBlogPorId devuelve null si no existe", () => {
    expect(obtenerBlogPorId("999")).toBeNull();
  });
});
