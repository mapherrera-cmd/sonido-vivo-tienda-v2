// Pruebas de las validaciones de los formularios de checkout, producto, categoría, usuario y perfil.
import { describe, it, expect } from "vitest";
import {
  validarConfirmacion,
  validarObligatorio,
  validarCheckout,
  validarProducto,
  validarCategoria,
  validarUsuarioAdmin,
  validarPerfil,
} from "./validaciones";

describe("validarConfirmacion y validarObligatorio", () => {
  it("validarConfirmacion pide repetir la contraseña si está vacía", () => {
    expect(validarConfirmacion("abcd", "")).toBe("Repite tu contraseña.");
  });

  it("validarConfirmacion detecta contraseñas distintas y acepta las iguales", () => {
    expect(validarConfirmacion("abcd", "abce")).toBe("Las contraseñas no coinciden.");
    expect(validarConfirmacion("abcd", "abcd")).toBe("");
  });

  it("validarObligatorio devuelve el mensaje solo si el valor está vacío", () => {
    expect(validarObligatorio("   ", "Falta")).toBe("Falta");
    expect(validarObligatorio("hola", "Falta")).toBe("");
  });
});

describe("validarCheckout", () => {
  const valido = {
    nombre: "Ana",
    apellidos: "Pérez",
    correo: "ana@gmail.com",
    calle: "Los Aromos 123",
    region: "metropolitana",
    comuna: "Santiago",
  };

  it("no devuelve errores con datos válidos", () => {
    expect(validarCheckout(valido)).toEqual({});
  });

  it("devuelve un error por cada campo obligatorio vacío", () => {
    const vacio = { nombre: "", apellidos: "", correo: "", calle: "", region: "", comuna: "" };
    expect(Object.keys(validarCheckout(vacio))).toEqual(["nombre", "apellidos", "correo", "calle", "region", "comuna"]);
  });
});

describe("validarProducto", () => {
  const valido = {
    nombre: "Guitarra",
    descripcion: "Buena guitarra",
    precio: "100000",
    stock: "5",
    categoria: "C001",
    oferta: false,
    precioOferta: "",
  };

  it("no devuelve errores con datos válidos", () => {
    expect(validarProducto(valido)).toEqual({});
  });

  it("rechaza un nombre de más de 100 caracteres", () => {
    expect(validarProducto({ ...valido, nombre: "a".repeat(101) }).nombre).toMatch(/100 caracteres/);
  });

  it("rechaza una descripción de más de 500 caracteres", () => {
    expect(validarProducto({ ...valido, descripcion: "a".repeat(501) }).descripcion).toMatch(/500 caracteres/);
  });

  it("rechaza precio y stock que no son números enteros", () => {
    const errores = validarProducto({ ...valido, precio: "abc", stock: "-1" });
    expect(errores).toHaveProperty("precio");
    expect(errores).toHaveProperty("stock");
  });

  it("exige elegir una categoría", () => {
    expect(validarProducto({ ...valido, categoria: "" })).toHaveProperty("categoria");
  });

  it("si está en oferta, exige un precio de oferta válido", () => {
    const errores = validarProducto({ ...valido, oferta: true, precioOferta: "" });
    expect(errores.precioOferta).toBe("Ingresa un precio de oferta válido.");
  });

  it("si no está en oferta, ignora el precio de oferta", () => {
    expect(validarProducto({ ...valido, oferta: false, precioOferta: "999999999" })).toEqual({});
  });
});

describe("validarCategoria", () => {
  it("exige el nombre", () => {
    expect(validarCategoria({ nombre: " " })).toHaveProperty("nombre");
    expect(validarCategoria({ nombre: "Vientos" })).toEqual({});
  });
});

describe("validarUsuarioAdmin", () => {
  const valido = {
    run: "19011022K",
    nombre: "Ana",
    apellidos: "Pérez",
    correo: "ana@duoc.cl",
    password: "abcd",
    rol: "cliente",
    direccion: "Calle 1",
    region: "metropolitana",
    comuna: "Santiago",
  };

  it("no devuelve errores con datos válidos", () => {
    expect(validarUsuarioAdmin(valido)).toEqual({});
  });

  it("al crear, la contraseña es obligatoria", () => {
    expect(validarUsuarioAdmin({ ...valido, password: "" })).toHaveProperty("password");
  });

  it("al editar, la contraseña vacía se acepta (significa no cambiarla)", () => {
    expect(validarUsuarioAdmin({ ...valido, password: "" }, true)).toEqual({});
  });

  it("al editar, una contraseña nueva demasiado corta sí se rechaza", () => {
    expect(validarUsuarioAdmin({ ...valido, password: "ab" }, true)).toHaveProperty("password");
  });

  it("respeta los largos máximos de nombre, apellidos y dirección", () => {
    const errores = validarUsuarioAdmin({
      ...valido,
      nombre: "a".repeat(51),
      apellidos: "a".repeat(101),
      direccion: "a".repeat(301),
    });
    expect(Object.keys(errores)).toEqual(["nombre", "apellidos", "direccion"]);
  });
});

describe("validarPerfil", () => {
  it("exige nombre y apellidos", () => {
    const errores = validarPerfil({ nombre: "", apellidos: "", password: "" });
    expect(Object.keys(errores)).toEqual(["nombre", "apellidos"]);
  });

  it("la contraseña es opcional, pero si se escribe debe tener 4 a 10 caracteres", () => {
    expect(validarPerfil({ nombre: "Ana", apellidos: "P", password: "" })).toEqual({});
    expect(validarPerfil({ nombre: "Ana", apellidos: "P", password: "ab" })).toHaveProperty("password");
  });
});
