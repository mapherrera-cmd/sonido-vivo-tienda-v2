// Pruebas de RutaAdmin: solo deja pasar a un usuario con rol admin; los demás van al login.
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { SesionProvider } from "../../context/SesionProvider";
import { RutaAdmin } from "./RutaAdmin";

// Entra a /admin con una sesión ya guardada (o sin sesión si idUsuario es null)
function entrarAAdmin(idUsuario) {
  if (idUsuario) localStorage.setItem("sv_sesion", idUsuario);
  render(
    <SesionProvider>
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route element={<RutaAdmin />}>
            <Route path="/admin" element={<p>Panel de administración</p>} />
          </Route>
          <Route path="/login" element={<p>Pantalla de login</p>} />
        </Routes>
      </MemoryRouter>
    </SesionProvider>
  );
}

describe("RutaAdmin", () => {
  it("un administrador ve el panel", () => {
    entrarAAdmin("U001");
    expect(screen.getByText("Panel de administración")).toBeInTheDocument();
  });

  it("un cliente es enviado al login", () => {
    entrarAAdmin("U002");
    expect(screen.getByText("Pantalla de login")).toBeInTheDocument();
    expect(screen.queryByText("Panel de administración")).not.toBeInTheDocument();
  });

  it("sin sesión es enviado al login", () => {
    entrarAAdmin(null);
    expect(screen.getByText("Pantalla de login")).toBeInTheDocument();
  });
});
