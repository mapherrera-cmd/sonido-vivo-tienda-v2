// Prueba del caso "localStorage falla": la sesión no debe romper la app.
import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { SesionProvider } from "./SesionProvider";
import { useSesion } from "../hooks/useSesion";

describe("SesionProvider con localStorage bloqueado", () => {
  it("empieza sin sesión si no se puede leer localStorage", () => {
    // Mock: getItem lanza un error (por ejemplo, un navegador con el almacenamiento bloqueado)
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });

    const { result } = renderHook(() => useSesion(), { wrapper: SesionProvider });

    expect(result.current.usuario).toBeNull();
  });
});
