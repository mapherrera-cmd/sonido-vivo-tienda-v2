// Pruebas de las páginas públicas de la tienda, dibujando la app completa con rutas reales.
// Cubren: Home, Productos (filtros), Detalle, Categorías, Ofertas, Nosotros, Blogs, Contacto, Carrito, 404,
// y también el menú (NavBar), el footer y los layouts.
import { describe, it, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderizarApp, ITEM_PEDAL, ID_ADMIN, ID_CLIENTE } from "../testUtils/renderApp";
import { crearProducto } from "../data/productos";
import { crearCategoria } from "../data/categorias";

describe("Home y navegación", () => {
  it("muestra el carrusel, las categorías y las ofertas destacadas", () => {
    renderizarApp("/");

    expect(screen.getByRole("heading", { name: "Nuevos lanzamientos" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Categorías", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ofertas destacadas" })).toBeInTheDocument();
    expect(screen.getByText("Sonido Vivo - Viña del Mar")).toBeInTheDocument(); // footer
  });

  it("agregar un producto desde el Home actualiza el total del menú y guarda el carrito", async () => {
    const user = userEvent.setup();
    renderizarApp("/");
    expect(screen.getByRole("link", { name: /^Carrito \$0$/ })).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: "Agregar al carrito" })[0]);

    expect(screen.getByRole("link", { name: /^Carrito \$765\.000$/ })).toBeInTheDocument();
    expect(localStorage.getItem("sv_carrito")).toContain("P001");
  });

  it("los enlaces del menú navegan sin recargar la página", async () => {
    const user = userEvent.setup();
    renderizarApp("/");

    await user.click(screen.getByRole("link", { name: "Ofertas" }));
    expect(screen.getByRole("heading", { name: "Ofertas", level: 1 })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Productos" }));
    expect(screen.getByRole("heading", { name: "Productos", level: 1 })).toBeInTheDocument();

    // El footer también tiene un enlace a Contacto (el segundo de la lista)
    await user.click(screen.getAllByRole("link", { name: "Contacto" })[1]);
    expect(screen.getByRole("heading", { name: "Contáctanos" })).toBeInTheDocument();
  });

  it("una ruta que no existe muestra la página 404", () => {
    renderizarApp("/ruta-que-no-existe");

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver al inicio" })).toBeInTheDocument();
  });
});

describe("Menú según la sesión", () => {
  it("sin sesión muestra Iniciar sesión y Crear cuenta", () => {
    renderizarApp("/");

    expect(screen.getByRole("link", { name: "Iniciar sesión" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Crear cuenta" })).toBeInTheDocument();
  });

  it("un cliente ve su nombre y no ve el acceso al panel admin", () => {
    renderizarApp("/", { usuarioId: ID_CLIENTE });

    expect(screen.getByText("Hola, Javiera")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Panel admin" })).not.toBeInTheDocument();
  });

  it("un administrador ve el acceso al panel admin", () => {
    renderizarApp("/", { usuarioId: ID_ADMIN });

    expect(screen.getByRole("link", { name: "Panel admin" })).toBeInTheDocument();
  });

  it("Cerrar sesión vuelve al Home y muestra otra vez Iniciar sesión", async () => {
    const user = userEvent.setup();
    renderizarApp("/productos", { usuarioId: ID_CLIENTE });

    await user.click(screen.getByRole("button", { name: "Cerrar sesión" }));

    expect(screen.getByRole("link", { name: "Iniciar sesión" })).toBeInTheDocument();
    expect(localStorage.getItem("sv_sesion")).toBeNull();
    expect(screen.getByRole("heading", { name: "Ofertas destacadas" })).toBeInTheDocument();
  });

  it("el buscador del menú lleva a /productos con el texto buscado", async () => {
    const user = userEvent.setup();
    renderizarApp("/");

    await user.type(screen.getByLabelText("Buscar productos"), "guitarra");
    await user.click(screen.getByRole("button", { name: "Buscar" }));

    expect(screen.getByRole("heading", { name: "Productos", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("2 productos encontrados")).toBeInTheDocument();
  });
});

describe("Productos: filtros y orden", () => {
  it("al entrar muestra los 8 productos", () => {
    renderizarApp("/productos");

    expect(screen.getByText("8 productos encontrados")).toBeInTheDocument();
  });

  it("filtra por texto y usa singular cuando hay un solo resultado", async () => {
    const user = userEvent.setup();
    renderizarApp("/productos");

    await user.type(screen.getByPlaceholderText("Buscar por nombre o descripción"), "chorus");

    expect(screen.getByText("1 producto encontrado")).toBeInTheDocument();
    expect(screen.getByText("Pedal Boss Chorus CH-1")).toBeInTheDocument();
  });

  it("avisa cuando ningún producto coincide", async () => {
    const user = userEvent.setup();
    renderizarApp("/productos");

    await user.type(screen.getByPlaceholderText("Buscar por nombre o descripción"), "zzzz");

    expect(screen.getByText("No hay productos para mostrar.")).toBeInTheDocument();
  });

  it("filtra por categoría y al volver a 'Todas' quita el filtro", async () => {
    const user = userEvent.setup();
    renderizarApp("/productos");
    const selector = screen.getByLabelText("Filtrar por categoría");

    await user.selectOptions(selector, "C001");
    expect(screen.getByText("3 productos encontrados")).toBeInTheDocument();

    await user.selectOptions(selector, "");
    expect(screen.getByText("8 productos encontrados")).toBeInTheDocument();
  });

  it("ordena por precio de menor a mayor y de mayor a menor", async () => {
    const user = userEvent.setup();
    renderizarApp("/productos");
    const selector = screen.getByLabelText("Ordenar por precio");

    await user.selectOptions(selector, "menor");
    expect(screen.getAllByRole("link", { name: "Ver detalle" })[0]).toHaveAttribute("href", "/productos/P004");

    await user.selectOptions(selector, "mayor");
    expect(screen.getAllByRole("link", { name: "Ver detalle" })[0]).toHaveAttribute("href", "/productos/P005");
  });

  it("'Ver detalle' lleva a la página del producto", async () => {
    const user = userEvent.setup();
    renderizarApp("/productos");

    await user.click(screen.getAllByRole("link", { name: "Ver detalle" })[0]);

    expect(screen.getByRole("heading", { name: "Guitarra Fender Stratocaster" })).toBeInTheDocument();
  });
});

describe("Detalle de producto", () => {
  it("un producto en oferta muestra precio tachado, etiqueta Oferta y stock", () => {
    renderizarApp("/productos/P001");

    expect(screen.getByRole("heading", { name: "Guitarra Fender Stratocaster" })).toBeInTheDocument();
    expect(screen.getByText("$850.000")).toBeInTheDocument();
    expect(screen.getByText("$765.000")).toBeInTheDocument();
    expect(screen.getByText("Oferta")).toBeInTheDocument();
    expect(screen.getByText("Stock disponible: 12")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Instrumentos de Cuerda" })).toHaveAttribute("href", "/categorias/C001");
  });

  it("un producto sin oferta no muestra la etiqueta Oferta", () => {
    renderizarApp("/productos/P005");

    expect(screen.getByText("$790.000")).toBeInTheDocument();
    expect(screen.queryByText("Oferta")).not.toBeInTheDocument();
  });

  it("el botón Agregar al carrito suma el producto al carrito", async () => {
    const user = userEvent.setup();
    renderizarApp("/productos/P005");

    await user.click(screen.getByRole("button", { name: "Agregar al carrito" }));

    expect(screen.getByRole("link", { name: /^Carrito \$790\.000$/ })).toBeInTheDocument();
  });

  it("un producto sin stock tiene el botón Agotado desactivado", () => {
    renderizarApp("/productos/P002");

    expect(screen.getByText("Sin stock disponible")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Agotado" })).toBeDisabled();
  });

  it("si la categoría del producto ya no existe, no muestra el enlace de categoría", () => {
    const huerfano = crearProducto({ nombre: "Producto huérfano", precio: 1000, categoria: "C999", stock: 1 });

    renderizarApp(`/productos/${huerfano.id}`);

    expect(screen.getByRole("heading", { name: "Producto huérfano" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Instrumentos/ })).not.toBeInTheDocument();
  });

  it("un id que no existe muestra un aviso", () => {
    renderizarApp("/productos/XXXX");

    expect(screen.getByText(/El producto no existe/)).toBeInTheDocument();
  });
});

describe("Categorías", () => {
  it("sin categoría elegida pide elegir una", () => {
    renderizarApp("/categorias");

    expect(screen.getByRole("heading", { name: "Categorías", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Elige una categoría para ver sus productos.")).toBeInTheDocument();
  });

  it("con una categoría elegida muestra solo sus productos", () => {
    renderizarApp("/categorias/C002");

    expect(screen.getByRole("heading", { name: "Percusión", level: 2 })).toBeInTheDocument();
    expect(screen.getByText("Batería Acústica Dixon")).toBeInTheDocument();
    expect(screen.queryByText("Bajo Fender Precision")).not.toBeInTheDocument();
  });

  it("una categoría sin productos muestra el aviso de lista vacía", () => {
    const nueva = crearCategoria({ nombre: "Vientos" });

    renderizarApp(`/categorias/${nueva.id}`);

    expect(screen.getByRole("heading", { name: "Vientos", level: 2 })).toBeInTheDocument();
    expect(screen.getByText("No hay productos para mostrar.")).toBeInTheDocument();
  });

  it("una categoría que no existe muestra un aviso", () => {
    renderizarApp("/categorias/ZZZ");

    expect(screen.getByText(/La categoría no existe/)).toBeInTheDocument();
  });
});

describe("Ofertas", () => {
  it("muestra solo los productos en oferta", () => {
    renderizarApp("/ofertas");

    expect(screen.getByText("Batería Acústica Dixon")).toBeInTheDocument();
    expect(screen.getByText("Pedal Boss Distortion DS-1")).toBeInTheDocument();
    expect(screen.queryByText("Bajo Fender Precision")).not.toBeInTheDocument();
  });
});

describe("Nosotros y Blogs", () => {
  it("Nosotros muestra la presentación de la tienda", () => {
    renderizarApp("/nosotros");

    expect(screen.getByRole("heading", { name: "Sobre nosotros" })).toBeInTheDocument();
  });

  it("Blogs lista los 2 artículos y 'Ver más detalles' abre el primero", async () => {
    const user = userEvent.setup();
    renderizarApp("/blogs");
    expect(screen.getAllByRole("link", { name: "Ver más detalles" })).toHaveLength(2);

    await user.click(screen.getAllByRole("link", { name: "Ver más detalles" })[0]);

    expect(screen.getByRole("heading", { name: /Stratocaster marcaron la historia/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver a blogs" })).toBeInTheDocument();
  });

  it("un artículo que no existe muestra un aviso", () => {
    renderizarApp("/blogs/99");

    expect(screen.getByText(/El artículo no existe/)).toBeInTheDocument();
  });
});

describe("Contacto", () => {
  it("al enviar el formulario muestra el aviso y limpia los campos", async () => {
    const user = userEvent.setup();
    renderizarApp("/contacto");
    expect(screen.queryByText(/Mensaje enviado/)).not.toBeInTheDocument();

    await user.type(screen.getByLabelText("Nombre completo"), "Ana Pérez");
    await user.type(screen.getByLabelText("Correo electrónico"), "ana@gmail.com");
    await user.type(screen.getByLabelText("Tu mensaje"), "Hola, ¿tienen bajos?");
    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(screen.getByText(/Mensaje enviado/)).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre completo")).toHaveValue("");
    expect(screen.getByLabelText("Tu mensaje")).toHaveValue("");
  });
});

describe("Carrito", () => {
  it("vacío muestra el aviso", () => {
    renderizarApp("/carrito");

    expect(screen.getByText(/Tu carrito está vacío/)).toBeInTheDocument();
  });

  it("con productos permite cambiar cantidades, eliminar y limpiar", async () => {
    const user = userEvent.setup();
    const otro = { ...ITEM_PEDAL, id: "P007", nombre: "Pedal Boss Chorus CH-1", precio: 72000, cantidad: 1 };
    renderizarApp("/carrito", { carrito: [ITEM_PEDAL, otro] });
    expect(screen.getByRole("link", { name: /^Carrito \$171\.980$/ })).toBeInTheDocument();

    // "+" del primer producto: 2 -> 3 unidades
    await user.click(screen.getAllByRole("button", { name: "+" })[0]);
    expect(screen.getByLabelText("Cantidad de Pedal Boss Distortion DS-1")).toHaveValue(3);

    // Escribir una cantidad válida en el campo numérico
    fireEvent.change(screen.getByLabelText("Cantidad de Pedal Boss Chorus CH-1"), { target: { value: "4" } });
    expect(screen.getByLabelText("Cantidad de Pedal Boss Chorus CH-1")).toHaveValue(4);

    // Eliminar un producto
    await user.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
    expect(screen.queryByText("Pedal Boss Distortion DS-1")).not.toBeInTheDocument();

    // Limpiar el carrito
    await user.click(screen.getByRole("button", { name: "Limpiar" }));
    expect(screen.getByText(/Tu carrito está vacío/)).toBeInTheDocument();
  });

  it("'Comprar ahora' lleva al checkout", async () => {
    const user = userEvent.setup();
    renderizarApp("/carrito", { carrito: [ITEM_PEDAL] });

    await user.click(screen.getByRole("button", { name: "Comprar ahora" }));

    expect(screen.getByRole("heading", { name: "Finalizar compra" })).toBeInTheDocument();
  });
});
