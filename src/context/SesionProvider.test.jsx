// Pruebas de la sesión (SesionProvider + useSesion): iniciar, cerrar, sobrevivir a recargas y refrescar.
// Se usa un componente pequeño, solo para pruebas, que muestra el usuario y tiene botones.
import { describe, it, expect, vi } from "vitest";
import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { SesionProvider } from "./SesionProvider";
import { useSesion } from "../hooks/useSesion";
import { useCarrito } from "../hooks/useCarrito";
import { actualizarUsuario } from "../data/usuarios";

function PanelDePrueba() {
  const { usuario, iniciarSesion, cerrarSesion, refrescarUsuario } = useSesion();
  const [resultado, setResultado] = useState("");

  return (
    <div>
      <p data-testid="usuario">{usuario ? usuario.nombre : "sin sesión"}</p>
      <p data-testid="resultado">{resultado}</p>
      <button onClick={() => setResultado(iniciarSesion("max@duoc.cl", "admin123") ? "ok" : "falló")}>entrar bien</button>
      <button onClick={() => setResultado(iniciarSesion("max@duoc.cl", "mala") ? "ok" : "falló")}>entrar mal</button>
      <button onClick={cerrarSesion}>salir</button>
      <button onClick={refrescarUsuario}>refrescar</button>
    </div>
  );
}

function dibujarPanel() {
  return render(
    <SesionProvider>
      <PanelDePrueba />
    </SesionProvider>
  );
}

describe("SesionProvider", () => {
  it("empieza sin sesión", () => {
    dibujarPanel();
    expect(screen.getByTestId("usuario")).toHaveTextContent("sin sesión");
  });

  it("con correo y contraseña correctos inicia sesión y guarda el id en localStorage", async () => {
    dibujarPanel();

    await userEvent.click(screen.getByText("entrar bien"));

    expect(screen.getByTestId("usuario")).toHaveTextContent("Max");
    expect(localStorage.getItem("sv_sesion")).toBe("U001");
  });

  it("con contraseña incorrecta no inicia sesión", async () => {
    dibujarPanel();

    await userEvent.click(screen.getByText("entrar mal"));

    expect(screen.getByTestId("resultado")).toHaveTextContent("falló");
    expect(screen.getByTestId("usuario")).toHaveTextContent("sin sesión");
    expect(localStorage.getItem("sv_sesion")).toBeNull();
  });

  it("cerrar sesión borra al usuario y lo guardado", async () => {
    dibujarPanel();
    await userEvent.click(screen.getByText("entrar bien"));

    await userEvent.click(screen.getByText("salir"));

    expect(screen.getByTestId("usuario")).toHaveTextContent("sin sesión");
    expect(localStorage.getItem("sv_sesion")).toBeNull();
  });

  it("la sesión sobrevive a una recarga: lee el id guardado al montarse", () => {
    localStorage.setItem("sv_sesion", "U002");

    dibujarPanel();

    expect(screen.getByTestId("usuario")).toHaveTextContent("Javiera");
  });

  it("refrescarUsuario muestra los cambios hechos al perfil", async () => {
    dibujarPanel();
    await userEvent.click(screen.getByText("entrar bien"));

    actualizarUsuario("U001", { nombre: "Maximiliano" });
    await userEvent.click(screen.getByText("refrescar"));

    expect(screen.getByTestId("usuario")).toHaveTextContent("Maximiliano");
  });
});

describe("hooks fuera de su proveedor", () => {
  it("useSesion lanza un error claro si no está dentro de <SesionProvider>", () => {
    vi.spyOn(console, "error").mockImplementation(() => {}); // React imprime el error; lo silenciamos
    expect(() => renderHook(() => useSesion())).toThrow("useSesion debe usarse dentro de <SesionProvider>");
  });

  it("useCarrito lanza un error claro si no está dentro de <CarritoProvider>", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useCarrito())).toThrow("useCarrito debe usarse dentro de <CarritoProvider>");
  });
});
