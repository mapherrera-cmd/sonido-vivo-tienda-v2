// Pruebas de login, registro, checkout y las pantallas de resultado del pago.
// Se dibuja la app completa; Math.random se reemplaza por un valor fijo (mock) para que el pago sea predecible.
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderizarApp, guardarOrdenDePrueba, ITEM_PEDAL, ID_CLIENTE } from "../testUtils/renderApp";
import { actualizarUsuario, obtenerUsuarioPorCorreo } from "../data/usuarios";
import { obtenerOrdenes, obtenerOrdenPorId } from "../data/ordenes";

// Hace que el pago siempre sea aprobado (0.1 < 0.7) o rechazado (0.9 >= 0.7)
const pagoAprobado = () => vi.spyOn(Math, "random").mockReturnValue(0.1);
const pagoRechazado = () => vi.spyOn(Math, "random").mockReturnValue(0.9);

describe("Login", () => {
  it("con el formulario vacío muestra los errores de validación", async () => {
    const user = userEvent.setup();
    renderizarApp("/login");

    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(screen.getByText("Ingresa tu correo electrónico.")).toBeInTheDocument();
    expect(screen.getByText("Ingresa tu contraseña.")).toBeInTheDocument();
  });

  it("con una contraseña incorrecta muestra el error general", async () => {
    const user = userEvent.setup();
    renderizarApp("/login");

    await user.type(screen.getByLabelText("Correo electrónico"), "javi@gmail.com");
    await user.type(screen.getByLabelText("Contraseña"), "equivocada");
    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(screen.getByText("Correo o contraseña incorrectos.")).toBeInTheDocument();
  });

  it("un cliente entra y es llevado al Home", async () => {
    const user = userEvent.setup();
    renderizarApp("/login");

    await user.type(screen.getByLabelText("Correo electrónico"), "javi@gmail.com");
    await user.type(screen.getByLabelText("Contraseña"), "cliente123");
    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(screen.getByText("Hola, Javiera")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ofertas destacadas" })).toBeInTheDocument();
  });

  it("un administrador entra y es llevado al panel /admin", async () => {
    const user = userEvent.setup();
    renderizarApp("/login");

    await user.type(screen.getByLabelText("Correo electrónico"), "max@duoc.cl");
    await user.type(screen.getByLabelText("Contraseña"), "admin123");
    await user.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
  });

  it("un cliente no puede entrar al panel admin: lo manda al login", () => {
    renderizarApp("/admin", { usuarioId: ID_CLIENTE });

    expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeInTheDocument();
  });
});

describe("Registro", () => {
  // Rellena el formulario de registro con datos válidos (se puede cambiar el correo)
  async function llenarRegistro(user, correo = "nuevo@gmail.com") {
    await user.type(screen.getByLabelText("Nombre"), "Camila");
    await user.type(screen.getByLabelText("Apellidos"), "Rojas");
    await user.type(screen.getByLabelText("RUN (sin puntos ni guion)"), "12345678k");
    await user.type(screen.getByLabelText("Correo electrónico"), correo);
    await user.type(screen.getByLabelText("Contraseña"), "abcd1");
    await user.type(screen.getByLabelText("Confirmar contraseña"), "abcd1");
    await user.selectOptions(screen.getByLabelText("Región"), "metropolitana");
    await user.selectOptions(screen.getByLabelText("Comuna"), "Santiago");
  }

  it("con el formulario vacío muestra errores en cada campo", async () => {
    const user = userEvent.setup();
    renderizarApp("/registro");

    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(screen.getByText("Ingresa tu nombre.")).toBeInTheDocument();
    expect(screen.getByText("Selecciona una región.")).toBeInTheDocument();
    expect(screen.getByText("Selecciona una comuna.")).toBeInTheDocument();
  });

  it("la lista de comunas depende de la región elegida", async () => {
    const user = userEvent.setup();
    renderizarApp("/registro");

    await user.selectOptions(screen.getByLabelText("Región"), "biobio");

    expect(screen.getByRole("option", { name: "Concepción" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Santiago" })).not.toBeInTheDocument();
  });

  it("con datos válidos crea la cuenta como cliente y lleva al login con aviso de éxito", async () => {
    const user = userEvent.setup();
    renderizarApp("/registro");

    await llenarRegistro(user);
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(screen.getByText(/Registro completado con éxito/)).toBeInTheDocument();
    const creado = obtenerUsuarioPorCorreo("nuevo@gmail.com");
    expect(creado.rol).toBe("cliente");
    expect(creado.run).toBe("12345678K"); // se guarda en mayúscula
  });

  it("si el correo ya existe muestra un error y no crea otra cuenta", async () => {
    const user = userEvent.setup();
    renderizarApp("/registro");

    await llenarRegistro(user, "javi@gmail.com");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(screen.getByText("Ya existe una cuenta con ese correo.")).toBeInTheDocument();
  });
});

describe("Checkout", () => {
  it("con el carrito vacío no muestra el formulario", () => {
    renderizarApp("/comprar");

    expect(screen.getByText(/Tu carrito está vacío/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Pagar ahora/ })).not.toBeInTheDocument();
  });

  it("muestra el resumen del carrito y el total en el botón de pago", () => {
    renderizarApp("/comprar", { carrito: [ITEM_PEDAL] });

    expect(screen.getByRole("heading", { name: "Finalizar compra" })).toBeInTheDocument();
    expect(screen.getByText("Total a pagar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pagar ahora $99.980" })).toBeInTheDocument();
  });

  it("con datos incompletos muestra errores y no guarda ninguna orden", async () => {
    const user = userEvent.setup();
    renderizarApp("/comprar", { carrito: [ITEM_PEDAL] });

    await user.click(screen.getByRole("button", { name: /Pagar ahora/ }));

    expect(screen.getByText("Ingresa la calle y el número.")).toBeInTheDocument();
    expect(obtenerOrdenes()).toHaveLength(0);
  });

  it("un invitado paga con éxito: guarda la orden, vacía el carrito y muestra la boleta", async () => {
    pagoAprobado();
    const user = userEvent.setup();
    renderizarApp("/comprar", { carrito: [ITEM_PEDAL] });

    await user.type(screen.getByLabelText("Nombre"), "Pedro");
    await user.type(screen.getByLabelText("Apellidos"), "Hacker");
    await user.type(screen.getByLabelText("Correo"), "pedro@gmail.com");
    await user.type(screen.getByLabelText("Calle"), "Los Crisantemos 12");
    await user.type(screen.getByLabelText(/Departamento/), "603");
    await user.selectOptions(screen.getByLabelText("Región"), "metropolitana");
    await user.selectOptions(screen.getByLabelText("Comuna"), "Providencia");
    await user.type(screen.getByLabelText(/Indicaciones/), "Dejar con el conserje");
    await user.click(screen.getByRole("button", { name: /Pagar ahora/ }));

    expect(screen.getByRole("heading", { name: /Se ha realizado la compra. N° ORD-001/ })).toBeInTheDocument();
    expect(screen.getByText(/Depto 603/)).toBeInTheDocument();
    expect(screen.getByText(/Indicaciones: Dejar con el conserje/)).toBeInTheDocument();
    expect(obtenerOrdenPorId("ORD-001").estado).toBe("pagada");
    expect(obtenerOrdenPorId("ORD-001").usuarioId).toBeNull();
    expect(JSON.parse(localStorage.getItem("sv_carrito"))).toEqual([]);
  });

  it("un cliente con sesión ve sus datos autocompletados y paga sin escribir nada", async () => {
    pagoAprobado();
    actualizarUsuario(ID_CLIENTE, { region: "metropolitana", comuna: "Santiago", direccion: "Los Alerces 123" });
    const user = userEvent.setup();
    renderizarApp("/comprar", { usuarioId: ID_CLIENTE, carrito: [ITEM_PEDAL] });

    expect(screen.getByLabelText("Nombre")).toHaveValue("Javiera");
    expect(screen.getByLabelText("Calle")).toHaveValue("Los Alerces 123");
    expect(screen.getByLabelText("Comuna")).toHaveValue("Santiago");

    await user.click(screen.getByRole("button", { name: /Pagar ahora/ }));

    expect(screen.getByRole("heading", { name: /Se ha realizado la compra/ })).toBeInTheDocument();
    expect(obtenerOrdenPorId("ORD-001").usuarioId).toBe(ID_CLIENTE);
    // Sin departamento ni indicaciones, la boleta no los muestra
    expect(screen.queryByText(/Depto/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Indicaciones:/)).not.toBeInTheDocument();
  });

  it("si el pago es rechazado guarda la orden como rechazada y deja el carrito intacto", async () => {
    pagoRechazado();
    actualizarUsuario(ID_CLIENTE, { region: "biobio", comuna: "Chillán", direccion: "Calle Sur 45" });
    const user = userEvent.setup();
    renderizarApp("/comprar", { usuarioId: ID_CLIENTE, carrito: [ITEM_PEDAL] });

    await user.click(screen.getByRole("button", { name: /Pagar ahora/ }));

    expect(screen.getByRole("heading", { name: /No se pudo realizar el pago. N° ORD-001/ })).toBeInTheDocument();
    expect(obtenerOrdenPorId("ORD-001").estado).toBe("rechazada");
    expect(JSON.parse(localStorage.getItem("sv_carrito"))).toHaveLength(1);
  });
});

describe("Pantalla de pago correcto", () => {
  it("muestra la boleta de una orden pagada", () => {
    const orden = guardarOrdenDePrueba({ estado: "pagada", departamento: "12", indicaciones: "Timbre roto" });

    renderizarApp(`/pago-correcto/${orden.id}`);

    expect(screen.getByRole("heading", { name: /Se ha realizado la compra/ })).toBeInTheDocument();
    expect(screen.getByText(/Los Alerces 123/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Seguir comprando" })).toBeInTheDocument();
  });

  it("si la orden no existe avisa que no hay compra pagada", () => {
    renderizarApp("/pago-correcto/ORD-999");

    expect(screen.getByText(/No encontramos una compra pagada/)).toBeInTheDocument();
  });

  it("si la orden fue rechazada tampoco muestra la boleta", () => {
    const orden = guardarOrdenDePrueba({ estado: "rechazada" });

    renderizarApp(`/pago-correcto/${orden.id}`);

    expect(screen.getByText(/No encontramos una compra pagada/)).toBeInTheDocument();
  });
});

describe("Pantalla de pago con error", () => {
  it("si la orden no existe avisa que no la encontró", () => {
    renderizarApp("/pago-error/ORD-999");

    expect(screen.getByText(/No encontramos una compra con ese número/)).toBeInTheDocument();
  });

  it("si la orden ya está pagada ofrece ver la boleta", () => {
    const orden = guardarOrdenDePrueba({ estado: "pagada" });

    renderizarApp(`/pago-error/${orden.id}`);

    expect(screen.getByText(/Esta compra ya fue pagada/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver boleta" })).toBeInTheDocument();
  });

  it("si el reintento vuelve a fallar avisa en pantalla y la orden sigue rechazada", async () => {
    pagoRechazado();
    const orden = guardarOrdenDePrueba({ estado: "rechazada" });
    const user = userEvent.setup();
    renderizarApp(`/pago-error/${orden.id}`);

    await user.click(screen.getByRole("button", { name: "Volver a realizar el pago" }));

    expect(screen.getByText(/El pago fue rechazado nuevamente/)).toBeInTheDocument();
    expect(obtenerOrdenPorId(orden.id).estado).toBe("rechazada");
  });

  it("si el reintento resulta bien marca la orden como pagada y muestra la boleta", async () => {
    pagoAprobado();
    const orden = guardarOrdenDePrueba({ estado: "rechazada" });
    const user = userEvent.setup();
    renderizarApp(`/pago-error/${orden.id}`, { carrito: [ITEM_PEDAL] });

    await user.click(screen.getByRole("button", { name: "Volver a realizar el pago" }));

    expect(screen.getByRole("heading", { name: /Se ha realizado la compra/ })).toBeInTheDocument();
    expect(obtenerOrdenPorId(orden.id).estado).toBe("pagada");
    expect(JSON.parse(localStorage.getItem("sv_carrito"))).toEqual([]);
  });
});
