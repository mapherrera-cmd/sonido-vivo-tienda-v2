// Pruebas del CRUD de usuarios (guardado en localStorage).
import { describe, it, expect } from "vitest";
import {
  USUARIOS_INICIALES,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  obtenerUsuarioPorCorreo,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "./usuarios";

const datosNuevos = { run: "123456789", nombre: "Ana", correo: "ana@gmail.com", password: "abcd" };

describe("usuarios - leer", () => {
  it("la primera vez devuelve los usuarios iniciales (un admin y un cliente)", () => {
    const usuarios = obtenerUsuarios();
    expect(usuarios).toHaveLength(USUARIOS_INICIALES.length);
    expect(usuarios.map((u) => u.rol)).toEqual(["admin", "cliente"]);
  });

  it("obtenerUsuarioPorId devuelve el usuario, o null si no existe", () => {
    expect(obtenerUsuarioPorId("U001").nombre).toBe("Max");
    expect(obtenerUsuarioPorId("U999")).toBeNull();
  });

  it("obtenerUsuarioPorCorreo ignora mayúsculas y espacios", () => {
    expect(obtenerUsuarioPorCorreo("  MAX@Duoc.cl ").id).toBe("U001");
  });

  it("obtenerUsuarioPorCorreo devuelve null si el correo no existe", () => {
    expect(obtenerUsuarioPorCorreo("nadie@gmail.com")).toBeNull();
  });
});

describe("usuarios - crear", () => {
  it("agrega el usuario con id nuevo y valores por defecto (rol cliente)", () => {
    const nuevo = crearUsuario(datosNuevos);

    expect(nuevo.id).toBe("U003");
    expect(nuevo.rol).toBe("cliente");
    expect(nuevo.direccion).toBe("");
    expect(obtenerUsuarios()).toHaveLength(3);
  });

  it("devuelve null y no guarda nada si el correo ya existe", () => {
    const resultado = crearUsuario({ ...datosNuevos, correo: "MAX@duoc.cl" });

    expect(resultado).toBeNull();
    expect(obtenerUsuarios()).toHaveLength(2);
  });
});

describe("usuarios - actualizar y eliminar", () => {
  it("actualizarUsuario cambia los campos y mantiene el id", () => {
    const actualizado = actualizarUsuario("U002", { nombre: "Javier", id: "OTRO" });

    expect(actualizado.nombre).toBe("Javier");
    expect(actualizado.id).toBe("U002");
    expect(obtenerUsuarioPorId("U002").nombre).toBe("Javier");
  });

  it("actualizarUsuario devuelve null si no existe", () => {
    expect(actualizarUsuario("U999", { nombre: "X" })).toBeNull();
  });

  it("eliminarUsuario borra al usuario y devuelve true", () => {
    expect(eliminarUsuario("U002")).toBe(true);
    expect(obtenerUsuarioPorId("U002")).toBeNull();
  });

  it("eliminarUsuario devuelve false si no existe", () => {
    expect(eliminarUsuario("U999")).toBe(false);
    expect(obtenerUsuarios()).toHaveLength(2);
  });
});
