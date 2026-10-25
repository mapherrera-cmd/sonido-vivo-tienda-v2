// Pruebas de las reglas de validación de login y registro (casos válidos e inválidos).
import { describe, it, expect } from "vitest";
import {
  hayErrores,
  validarCorreo,
  validarLogin,
  validarPassword,
  validarProducto,
  validarRegistro,
  validarRun,
} from "./validaciones";

describe("validarCorreo", () => {
  it("acepta los dominios permitidos", () => {
    expect(validarCorreo("max@duoc.cl")).toBe("");
    expect(validarCorreo("profe@profesor.duoc.cl")).toBe("");
    expect(validarCorreo("javi@gmail.com")).toBe("");
  });

  it("acepta mayúsculas y espacios alrededor", () => {
    expect(validarCorreo("  MAX@DUOC.CL ")).toBe("");
  });

  it("rechaza un dominio no permitido", () => {
    expect(validarCorreo("alguien@hotmail.com")).toMatch(/Solo se permiten correos/);
  });

  it("rechaza un correo vacío", () => {
    expect(validarCorreo("")).toBe("Ingresa tu correo electrónico.");
  });
});

describe("validarPassword", () => {
  it("acepta entre 4 y 10 caracteres", () => {
    expect(validarPassword("abcd")).toBe("");
    expect(validarPassword("abcdefghij")).toBe("");
  });

  it("rechaza menos de 4 caracteres", () => {
    expect(validarPassword("abc")).toMatch(/entre 4 y 10/);
  });

  it("rechaza más de 10 caracteres", () => {
    expect(validarPassword("abcdefghijk")).toMatch(/entre 4 y 10/);
  });

  it("rechaza una contraseña vacía", () => {
    expect(validarPassword("")).toBe("Ingresa tu contraseña.");
  });
});

describe("validarRun", () => {
  it("acepta un RUN sin puntos ni guion", () => {
    expect(validarRun("19011022K")).toBe("");
  });

  it("rechaza un RUN con puntos y guion", () => {
    expect(validarRun("19.011.022-K")).not.toBe("");
  });
});

describe("validarLogin", () => {
  it("no devuelve errores con datos válidos", () => {
    const errores = validarLogin({ correo: "max@duoc.cl", password: "abcd" });
    expect(hayErrores(errores)).toBe(false);
  });

  it("devuelve un error por cada campo inválido", () => {
    const errores = validarLogin({ correo: "max@hotmail.com", password: "1" });
    expect(Object.keys(errores)).toEqual(["correo", "password"]);
  });
});

describe("validarRegistro", () => {
  const datosValidos = {
    nombre: "Ana",
    apellidos: "Pérez",
    run: "19011022K",
    correo: "ana@gmail.com",
    password: "abcd",
    confirmar: "abcd",
    region: "Región Metropolitana de Santiago",
    comuna: "Santiago",
  };

  it("no devuelve errores con datos válidos", () => {
    expect(hayErrores(validarRegistro(datosValidos))).toBe(false);
  });

  it("detecta que las contraseñas no coinciden", () => {
    const errores = validarRegistro({ ...datosValidos, confirmar: "otra" });
    expect(errores.confirmar).toBe("Las contraseñas no coinciden.");
  });

  it("detecta campos obligatorios vacíos", () => {
    const errores = validarRegistro({ ...datosValidos, nombre: "", comuna: "" });
    expect(errores.nombre).toBeDefined();
    expect(errores.comuna).toBeDefined();
  });
});

describe("validarProducto", () => {
  const productoValido = {
    nombre: "Pedal",
    descripcion: "",
    precio: "10000",
    stock: "5",
    categoria: "C004",
    oferta: false,
    precioOferta: "",
  };

  it("el precio de oferta debe ser menor al precio normal", () => {
    const errores = validarProducto({ ...productoValido, oferta: true, precioOferta: "10000" });
    expect(errores.precioOferta).toMatch(/menor al precio normal/);
  });

  it("acepta una oferta con precio menor", () => {
    const errores = validarProducto({ ...productoValido, oferta: true, precioOferta: "8000" });
    expect(hayErrores(errores)).toBe(false);
  });
});

describe("hayErrores", () => {
  it("es false con un objeto vacío y true si tiene algún error", () => {
    expect(hayErrores({})).toBe(false);
    expect(hayErrores({ correo: "mal" })).toBe(true);
  });
});
