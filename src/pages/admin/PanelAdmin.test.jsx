// Pruebas del panel de administración (/admin/...). Se entra siempre con la sesión del administrador (U001).
// Se comprueba que las pantallas lean y modifiquen los datos reales (CRUD en localStorage).
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderizarApp, guardarOrdenDePrueba, ID_ADMIN, ID_CLIENTE } from "../../testUtils/renderApp";
import { actualizarProducto, crearProducto, eliminarProducto, obtenerProductoPorId, obtenerProductos } from "../../data/productos";
import { obtenerCategorias, obtenerCategoriaPorId } from "../../data/categorias";
import { obtenerUsuarioPorCorreo, obtenerUsuarioPorId } from "../../data/usuarios";

// Entra al panel como administrador en la ruta indicada
const renderizarAdmin = (ruta) => renderizarApp(ruta, { usuarioId: ID_ADMIN });

// Deja todos los productos con stock alto (así no hay productos críticos)
function subirStockDeTodos() {
  obtenerProductos().forEach((p) => actualizarProducto(p.id, { stock: 100 }));
}

describe("Dashboard y menú lateral", () => {
  it("muestra las tarjetas con los totales reales", () => {
    renderizarAdmin("/admin");

    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByText("0 de 0 órdenes pagadas")).toBeInTheDocument();
    expect(screen.getByText("4 categorías")).toBeInTheDocument();
    expect(screen.getByText("Cuentas registradas")).toBeInTheDocument();
    expect(screen.getByText("Con stock de 5 unidades o menos")).toBeInTheDocument();
  });

  it("cuenta las ventas solo de órdenes pagadas", () => {
    guardarOrdenDePrueba({ estado: "pagada" });
    guardarOrdenDePrueba({ estado: "rechazada" });

    renderizarAdmin("/admin");

    expect(screen.getByText("1 de 2 órdenes pagadas")).toBeInTheDocument();
    expect(screen.getByText("$99.980")).toBeInTheDocument();
  });

  it("sin productos críticos la tarjeta se muestra en gris (secondary)", () => {
    subirStockDeTodos();

    renderizarAdmin("/admin");

    expect(screen.getByText("Productos críticos").closest(".card")).toHaveClass("bg-secondary");
  });

  it("con productos críticos la tarjeta se muestra en rojo (danger)", () => {
    renderizarAdmin("/admin");

    expect(screen.getByText("Productos críticos").closest(".card")).toHaveClass("bg-danger");
  });

  it("el menú lateral navega entre las secciones", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin");

    await user.click(screen.getByRole("link", { name: "Productos" }));

    expect(screen.getByRole("heading", { name: "Productos", level: 1 })).toBeInTheDocument();
  });

  it("'Ir a la tienda' lleva al Home público", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin");

    await user.click(screen.getByRole("link", { name: "Ir a la tienda" }));

    expect(screen.getByRole("heading", { name: "Ofertas destacadas" })).toBeInTheDocument();
  });

    it("Cerrar sesión cierra la sesión y deja al usuario fuera del panel", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin");

    await user.click(screen.getByRole("button", { name: "Cerrar sesión" }));

    expect(localStorage.getItem("sv_sesion")).toBeNull();
    // Sin sesión de admin, RutaAdmin lo manda al login
    expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeInTheDocument();
  });
});

describe("Productos (listar y eliminar)", () => {
  it("lista los 8 productos con sus datos", () => {
    renderizarAdmin("/admin/productos");

    expect(screen.getAllByRole("link", { name: "Editar" })).toHaveLength(8);
    expect(screen.getByText("Guitarra Fender Stratocaster")).toBeInTheDocument();
    expect(screen.getAllByText("Instrumentos de Cuerda").length).toBeGreaterThan(0);
  });

  it("un producto con una categoría que ya no existe muestra 'Sin categoría'", () => {
    crearProducto({ nombre: "Producto huérfano", precio: 1000, categoria: "C999", stock: 50 });

    renderizarAdmin("/admin/productos");

    expect(screen.getByText("Sin categoría")).toBeInTheDocument();
  });

  it("Eliminar con confirmación borra el producto y avisa", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true); // mock: la persona acepta
    const user = userEvent.setup();
    renderizarAdmin("/admin/productos");

    await user.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);

    expect(screen.getByText(/Se eliminó el producto "Guitarra Fender Stratocaster"/)).toBeInTheDocument();
    expect(obtenerProductoPorId("P001")).toBeNull();
    expect(screen.getAllByRole("link", { name: "Editar" })).toHaveLength(7);
  });

  it("Eliminar sin confirmación no borra nada", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false); // mock: la persona cancela
    const user = userEvent.setup();
    renderizarAdmin("/admin/productos");

    await user.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);

    expect(obtenerProductoPorId("P001")).not.toBeNull();
    expect(screen.queryByText(/Se eliminó el producto/)).not.toBeInTheDocument();
  });

  it("el aviso de eliminado se puede cerrar", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const user = userEvent.setup();
    renderizarAdmin("/admin/productos");
    await user.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);

    await user.click(screen.getByRole("button", { name: /close/i }));

    expect(screen.queryByText(/Se eliminó el producto/)).not.toBeInTheDocument();
  });

  it("sin productos muestra el aviso de lista vacía", () => {
    obtenerProductos().forEach((p) => eliminarProducto(p.id));

    renderizarAdmin("/admin/productos");

    expect(screen.getByText(/No hay productos\. Crea el primero/)).toBeInTheDocument();
  });

  it("el botón 'Productos críticos' lleva al listado de stock bajo", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin/productos");

    await user.click(screen.getByRole("link", { name: "Productos críticos" }));

    expect(screen.getByRole("heading", { name: "Productos críticos" })).toBeInTheDocument();
  });
});

describe("Productos críticos", () => {
  it("lista solo los productos con 5 unidades o menos, sin botón Eliminar", () => {
    renderizarAdmin("/admin/productos/criticos");

    expect(screen.getByText("Amplificador Cort 15W")).toBeInTheDocument(); // stock 0
    expect(screen.getByText("Amplificador Rumble 40W")).toBeInTheDocument(); // stock 3
    expect(screen.queryByText("Bajo Fender Precision")).not.toBeInTheDocument(); // stock 8
    expect(screen.queryByRole("button", { name: "Eliminar" })).not.toBeInTheDocument();
  });

  it("si no hay productos críticos lo avisa", () => {
    subirStockDeTodos();

    renderizarAdmin("/admin/productos/criticos");

    expect(screen.getByText("No hay productos con stock crítico.")).toBeInTheDocument();
  });
});

describe("Nuevo y editar producto", () => {
  it("con el formulario vacío muestra errores y no guarda", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin/productos/nuevo");

    await user.click(screen.getByRole("button", { name: "Crear producto" }));

    expect(screen.getByText("Ingresa el nombre del producto.")).toBeInTheDocument();
    expect(screen.getByText("Selecciona una categoría.")).toBeInTheDocument();
    expect(obtenerProductos()).toHaveLength(8);
  });

  it("crea un producto y se ve en la lista de productos", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin/productos/nuevo");

    await user.type(screen.getByLabelText("Nombre del producto"), "Ukelele Soprano");
    await user.type(screen.getByLabelText("Precio ($)"), "45000");
    await user.type(screen.getByLabelText("Stock"), "10");
    await user.selectOptions(screen.getByLabelText("Categoría"), "C001");
    await user.click(screen.getByRole("button", { name: "Crear producto" }));

    expect(screen.getByRole("heading", { name: "Productos", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Ukelele Soprano")).toBeInTheDocument();
    expect(obtenerProductos()).toHaveLength(9);
  });

  it("el precio de oferta solo aparece al activar la oferta y debe ser menor al precio normal", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin/productos/nuevo");
    expect(screen.queryByLabelText("Precio de oferta ($)")).not.toBeInTheDocument();

    await user.type(screen.getByLabelText("Nombre del producto"), "Cuerdas Elixir");
    await user.type(screen.getByLabelText("Precio ($)"), "1000");
    await user.type(screen.getByLabelText("Stock"), "30");
    await user.selectOptions(screen.getByLabelText("Categoría"), "C004");
    await user.click(screen.getByLabelText("Producto en oferta"));
    await user.type(screen.getByLabelText("Precio de oferta ($)"), "1500");
    await user.click(screen.getByRole("button", { name: "Crear producto" }));
    expect(screen.getByText("El precio de oferta debe ser menor al precio normal.")).toBeInTheDocument();

    await user.clear(screen.getByLabelText("Precio de oferta ($)"));
    await user.type(screen.getByLabelText("Precio de oferta ($)"), "800");
    await user.click(screen.getByRole("button", { name: "Crear producto" }));

    const guardado = obtenerProductos().find((p) => p.nombre === "Cuerdas Elixir");
    expect(guardado.oferta).toBe(true);
    expect(guardado.precioOferta).toBe(800);
  });

  it("la vista previa de la imagen desaparece al elegir 'Sin imagen'", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin/productos/nuevo");
    expect(screen.getByAltText("Vista previa")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Imagen"), "");

    expect(screen.queryByAltText("Vista previa")).not.toBeInTheDocument();
  });

  it("al editar, el formulario parte con los datos del producto y guarda los cambios", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin/productos/P002/editar");
    expect(screen.getByRole("heading", { name: "Editar producto P002" })).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre del producto")).toHaveValue("Amplificador Cort 15W");

    await user.clear(screen.getByLabelText("Stock"));
    await user.type(screen.getByLabelText("Stock"), "10");
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(obtenerProductoPorId("P002").stock).toBe(10);
    expect(screen.getByRole("heading", { name: "Productos", level: 1 })).toBeInTheDocument();
  });

  it("al editar un producto en oferta muestra su precio de oferta", () => {
    renderizarAdmin("/admin/productos/P001/editar");

    expect(screen.getByLabelText("Precio de oferta ($)")).toHaveValue(765000);
  });

  it("un producto que no existe muestra un aviso", () => {
    renderizarAdmin("/admin/productos/XXXX/editar");

    expect(screen.getByText(/No existe un producto con ese código/)).toBeInTheDocument();
  });
});

describe("Categorías", () => {
  it("lista las categorías con la cantidad de productos de cada una", () => {
    renderizarAdmin("/admin/categorias");

    expect(screen.getByRole("heading", { name: "Categorías", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Percusión")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Editar" })).toHaveLength(4);
  });

  it("'Nueva categoría' sin nombre muestra el error", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin/categorias/nueva");

    await user.click(screen.getByRole("button", { name: "Crear categoría" }));

    expect(screen.getByText("Ingresa el nombre de la categoría.")).toBeInTheDocument();
    expect(obtenerCategorias()).toHaveLength(4);
  });

  it("crea una categoría y aparece en la lista", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin/categorias/nueva");

    await user.type(screen.getByLabelText("Nombre de la categoría"), "Vientos");
    await user.click(screen.getByRole("button", { name: "Crear categoría" }));

    expect(screen.getByText("Vientos")).toBeInTheDocument();
    expect(obtenerCategorias()).toHaveLength(5);
  });

  it("la vista previa desaparece al elegir 'Sin imagen'", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin/categorias/nueva");
    expect(screen.getByAltText("Vista previa")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Imagen"), "");

    expect(screen.queryByAltText("Vista previa")).not.toBeInTheDocument();
  });

  it("edita el nombre de una categoría existente", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin/categorias/C001/editar");
    expect(screen.getByRole("heading", { name: "Editar categoría C001" })).toBeInTheDocument();

    await user.clear(screen.getByLabelText("Nombre de la categoría"));
    await user.type(screen.getByLabelText("Nombre de la categoría"), "Cuerdas");
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(obtenerCategoriaPorId("C001").nombre).toBe("Cuerdas");
  });

  it("una categoría que no existe muestra un aviso", () => {
    renderizarAdmin("/admin/categorias/XXXX/editar");

    expect(screen.getByText(/No existe una categoría con ese código/)).toBeInTheDocument();
  });
});

describe("Usuarios", () => {
  // Rellena los campos obligatorios del formulario de usuario
  async function llenarUsuario(user, { run, correo }) {
    await user.type(screen.getByLabelText("RUN (sin puntos ni guion)"), run);
    await user.type(screen.getByLabelText("Correo electrónico"), correo);
    await user.type(screen.getByLabelText("Nombre"), "Luis");
    await user.type(screen.getByLabelText("Apellidos"), "Soto");
    await user.type(screen.getByLabelText("Contraseña"), "abcd1");
    await user.type(screen.getByLabelText("Dirección (calle y número)"), "Calle Norte 99");
    await user.selectOptions(screen.getByLabelText("Región"), "valparaiso");
    await user.selectOptions(screen.getByLabelText("Comuna"), "Quilpué");
  }

  it("lista los usuarios con su rol", () => {
    renderizarAdmin("/admin/usuarios");

    expect(screen.getByText("max@duoc.cl")).toBeInTheDocument();
    expect(screen.getByText("Administrador")).toBeInTheDocument();
    expect(screen.getByText("Cliente")).toBeInTheDocument();
  });

  it("'Nuevo usuario' vacío muestra errores de validación", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin/usuarios/nuevo");

    await user.click(screen.getByRole("button", { name: "Crear usuario" }));

    expect(screen.getByText("Ingresa el nombre.")).toBeInTheDocument();
    expect(screen.getByText("Ingresa la dirección.")).toBeInTheDocument();
  });

  it("crea un usuario nuevo y aparece en la lista", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin/usuarios/nuevo");

    await llenarUsuario(user, { run: "22222222k", correo: "luis@gmail.com" });
    await user.click(screen.getByRole("button", { name: "Crear usuario" }));

    expect(screen.getByText("luis@gmail.com")).toBeInTheDocument();
    expect(obtenerUsuarioPorCorreo("luis@gmail.com").rol).toBe("cliente");
  });

  it("no permite crear un usuario con un correo repetido", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin/usuarios/nuevo");

    await llenarUsuario(user, { run: "22222222k", correo: "javi@gmail.com" });
    await user.click(screen.getByRole("button", { name: "Crear usuario" }));

    expect(screen.getByText("Ya existe un usuario con ese correo.")).toBeInTheDocument();
  });

  it("no permite crear un usuario con un RUN repetido", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin/usuarios/nuevo");

    await llenarUsuario(user, { run: "201234567", correo: "otro@gmail.com" }); // RUN de Javiera
    await user.click(screen.getByRole("button", { name: "Crear usuario" }));

    expect(screen.getByText("Ya existe un usuario con ese RUN.")).toBeInTheDocument();
  });

  it("al editar a otro usuario el RUN está bloqueado y la contraseña actual se mantiene", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin/usuarios/U002/editar");
    expect(screen.getByLabelText("RUN (sin puntos ni guion)")).toBeDisabled();
    expect(screen.getByLabelText("Rol")).toBeEnabled();

    await user.type(screen.getByLabelText("Dirección (calle y número)"), "Calle Sur 5");
    await user.selectOptions(screen.getByLabelText("Región"), "biobio");
    await user.selectOptions(screen.getByLabelText("Comuna"), "Talcahuano");
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    const editado = obtenerUsuarioPorId("U002");
    expect(editado.direccion).toBe("Calle Sur 5");
    expect(editado.password).toBe("cliente123");
  });

  it("al editarse a sí mismo el rol está bloqueado y puede cambiar su contraseña", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin/usuarios/U001/editar");
    expect(screen.getByLabelText("Rol")).toBeDisabled();
    expect(screen.getByText("No puedes cambiar tu propio rol.")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Contraseña nueva/), "nueva1");
    await user.type(screen.getByLabelText("Dirección (calle y número)"), "Calle Centro 1");
    await user.selectOptions(screen.getByLabelText("Región"), "valparaiso");
    await user.selectOptions(screen.getByLabelText("Comuna"), "Concón");
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(obtenerUsuarioPorId("U001").password).toBe("nueva1");
  });

  it("un usuario que no existe muestra un aviso", () => {
    renderizarAdmin("/admin/usuarios/XXXX/editar");

    expect(screen.getByText(/No existe un usuario con ese código/)).toBeInTheDocument();
  });
});

describe("Historial de compras de un usuario", () => {
  it("sin compras lo avisa", () => {
    renderizarAdmin(`/admin/usuarios/${ID_CLIENTE}/historial`);

    expect(screen.getByText(/todavía no ha realizado compras/)).toBeInTheDocument();
  });

  it("con compras muestra la tabla y el total de las pagadas", () => {
    guardarOrdenDePrueba({ estado: "pagada" });
    guardarOrdenDePrueba({ estado: "rechazada" });

    renderizarAdmin(`/admin/usuarios/${ID_CLIENTE}/historial`);

    expect(screen.getAllByRole("link", { name: "Ver boleta" })).toHaveLength(2);
    expect(screen.getByText(/Total comprado \(solo órdenes pagadas\): \$99\.980/)).toBeInTheDocument();
  });

  it("un usuario que no existe muestra un aviso", () => {
    renderizarAdmin("/admin/usuarios/XXXX/historial");

    expect(screen.getByText(/No existe un usuario con ese código/)).toBeInTheDocument();
  });
});

describe("Órdenes y boletas", () => {
  it("sin órdenes muestra el aviso", () => {
    renderizarAdmin("/admin/ordenes");

    expect(screen.getByText("Todavía no hay órdenes de compra.")).toBeInTheDocument();
  });

  it("lista las órdenes y 'Ver boleta' abre el detalle", async () => {
    guardarOrdenDePrueba({ estado: "pagada" });
    guardarOrdenDePrueba({ estado: "rechazada" });
    const user = userEvent.setup();
    renderizarAdmin("/admin/ordenes");
    expect(screen.getByText("Pagada")).toBeInTheDocument();
    expect(screen.getByText("Rechazada")).toBeInTheDocument();

    await user.click(screen.getAllByRole("link", { name: "Ver boleta" })[0]);

    expect(screen.getByRole("heading", { name: /Boleta N° ORD-/ })).toBeInTheDocument();
    expect(screen.getByText("Datos del cliente")).toBeInTheDocument();
  });

  it("una boleta que no existe muestra un aviso", () => {
    renderizarAdmin("/admin/ordenes/ORD-999");

    expect(screen.getByText(/No existe una orden con ese número/)).toBeInTheDocument();
  });
});

describe("Reportes", () => {
  it("sin ventas lo avisa", () => {
    renderizarAdmin("/admin/reportes");

    expect(screen.getByText("Todavía no hay ventas para mostrar.")).toBeInTheDocument();
  });

  it("con ventas muestra el ranking de productos vendidos", () => {
    guardarOrdenDePrueba({ estado: "pagada" });
    guardarOrdenDePrueba({ estado: "rechazada" });

    renderizarAdmin("/admin/reportes");

    expect(screen.getByText("Productos más vendidos")).toBeInTheDocument();
    expect(screen.getByText("Pedal Boss Distortion DS-1")).toBeInTheDocument();
    expect(screen.getByText("Pagos rechazados")).toBeInTheDocument();
  });
});

describe("Perfil del administrador", () => {
  it("parte con los datos actuales y guarda el cambio de nombre", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin/perfil");
    expect(screen.getByLabelText("Nombre")).toHaveValue("Max");
    expect(screen.queryByText(/se guardaron correctamente/)).not.toBeInTheDocument();

    await user.clear(screen.getByLabelText("Nombre"));
    await user.type(screen.getByLabelText("Nombre"), "Maximiliano");
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(screen.getByText(/se guardaron correctamente/)).toBeInTheDocument();
    expect(obtenerUsuarioPorId("U001").nombre).toBe("Maximiliano");
    expect(obtenerUsuarioPorId("U001").password).toBe("admin123"); // no se tocó
  });

  it("puede cambiar la contraseña", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin/perfil");

    await user.type(screen.getByLabelText(/Contraseña nueva/), "clave99");
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(obtenerUsuarioPorId("U001").password).toBe("clave99");
  });

  it("muestra errores si el nombre está vacío o la contraseña es muy corta", async () => {
    const user = userEvent.setup();
    renderizarAdmin("/admin/perfil");

    await user.clear(screen.getByLabelText("Nombre"));
    await user.type(screen.getByLabelText(/Contraseña nueva/), "ab");
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(screen.getByText("Ingresa tu nombre.")).toBeInTheDocument();
    expect(screen.getByText("La contraseña debe tener entre 4 y 10 caracteres.")).toBeInTheDocument();
  });
});
