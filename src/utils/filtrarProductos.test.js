// Pruebas de la función pura que filtra y ordena productos.
import { describe, it, expect } from "vitest";
import { filtrarYOrdenarProductos } from "./filtrarProductos";
import { listaProductos, productoAgotado, productoConOferta, productoNormal, productoPocoStock } from "../testUtils/datosDePrueba";

describe("filtrarYOrdenarProductos", () => {
  it("sin filtros devuelve todos los productos", () => {
    expect(filtrarYOrdenarProductos(listaProductos)).toHaveLength(4);
  });

  it("filtra por texto en el nombre, sin importar mayúsculas", () => {
    const resultado = filtrarYOrdenarProductos(listaProductos, { buscar: "GUITARRA" });
    expect(resultado).toEqual([productoConOferta]);
  });

  it("filtra por texto en la descripción", () => {
    const resultado = filtrarYOrdenarProductos(listaProductos, { buscar: "pocas unidades" });
    expect(resultado).toEqual([productoPocoStock]);
  });

  it("filtra por categoría", () => {
    const resultado = filtrarYOrdenarProductos(listaProductos, { categoria: "C003" });
    expect(resultado).toEqual([productoNormal]);
  });

  it("devuelve lista vacía si nada coincide", () => {
    expect(filtrarYOrdenarProductos(listaProductos, { buscar: "trompeta" })).toEqual([]);
  });

  it("ordena de menor a mayor usando el precio que se cobra (oferta incluida)", () => {
    const ids = filtrarYOrdenarProductos(listaProductos, { orden: "menor" }).map((p) => p.id);
    // precios finales: T004=65.000, T002=85.000, T003=450.000, T001=765.000 (oferta)
    expect(ids).toEqual(["T004", "T002", "T003", "T001"]);
  });

  it("ordena de mayor a menor", () => {
    const ids = filtrarYOrdenarProductos(listaProductos, { orden: "mayor" }).map((p) => p.id);
    expect(ids).toEqual(["T001", "T003", "T002", "T004"]);
  });

  it("no modifica la lista original al ordenar", () => {
    filtrarYOrdenarProductos(listaProductos, { orden: "menor" });
    expect(listaProductos[0]).toBe(productoConOferta);
    expect(listaProductos[2]).toBe(productoAgotado);
  });
});
