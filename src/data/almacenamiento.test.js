// Pruebas de las funciones que guardan y leen en localStorage.
// Aquí se usa un MOCK de localStorage con vi.spyOn para "espiar" y forzar situaciones.
import { describe, it, expect, vi } from "vitest";
import { generarId, guardarLista, leerLista } from "./almacenamiento";

describe("guardarLista", () => {
  it("guarda la lista como texto JSON bajo la clave indicada", () => {
    // Arrange: espiamos setItem (el espía deja pasar la llamada real)
    const espia = vi.spyOn(Storage.prototype, "setItem");
    // Act
    guardarLista("mi_clave", [1, 2, 3]);
    // Assert
    expect(espia).toHaveBeenCalledWith("mi_clave", "[1,2,3]");
    expect(localStorage.getItem("mi_clave")).toBe("[1,2,3]");
  });

  it("no rompe la aplicación si localStorage falla (por ejemplo, lleno)", () => {
    // Arrange: hacemos que setItem lance un error y silenciamos console.error
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Cuota llena");
    });
    const errorEspia = vi.spyOn(console, "error").mockImplementation(() => {});
    // Act + Assert: no lanza el error, solo lo registra
    expect(() => guardarLista("k", [1])).not.toThrow();
    expect(errorEspia).toHaveBeenCalled();
  });
});

describe("leerLista", () => {
  it("la primera vez devuelve la lista inicial y la deja guardada", () => {
    const inicial = [{ id: "A" }];
    const resultado = leerLista("nueva_clave", inicial);
    expect(resultado).toEqual(inicial);
    expect(localStorage.getItem("nueva_clave")).toBe(JSON.stringify(inicial));
  });

  it("devuelve una copia, no la misma lista inicial", () => {
    const inicial = [{ id: "A" }];
    expect(leerLista("otra_clave", inicial)).not.toBe(inicial);
  });

  it("devuelve lo que ya estaba guardado y no la lista inicial", () => {
    localStorage.setItem("clave_guardada", JSON.stringify([{ id: "GUARDADO" }]));
    const resultado = leerLista("clave_guardada", [{ id: "INICIAL" }]);
    expect(resultado).toEqual([{ id: "GUARDADO" }]);
  });

  it("si el texto guardado está dañado, devuelve la lista inicial", () => {
    localStorage.setItem("clave_mala", "{esto no es json");
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(leerLista("clave_mala", [1])).toEqual([1]);
  });
});

describe("generarId", () => {
  it("empieza en 001 si la lista está vacía", () => {
    expect(generarId([], "P")).toBe("P001");
  });

  it("suma 1 al número más alto que existe", () => {
    const lista = [{ id: "P001" }, { id: "P007" }, { id: "P003" }];
    expect(generarId(lista, "P")).toBe("P008");
  });

  it("funciona con prefijos largos como ORD-", () => {
    expect(generarId([{ id: "ORD-010" }], "ORD-")).toBe("ORD-011");
  });
});
