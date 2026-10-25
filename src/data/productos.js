// "Base de datos" simulada de productos, con CRUD guardado en localStorage.
import { generarId, guardarLista, leerLista } from "./almacenamiento";

const CLAVE_PRODUCTOS = "sv_productos";

// Productos iniciales. Los 6 primeros son los del catálogo HTML antiguo.
// P007 y P008 son productos de ejemplo para tener más datos (se pueden cambiar o borrar).
// "categoria" es el id de una categoría (ver categorias.js).
// Si "oferta" es true, el precio que se cobra es "precioOferta".
export const PRODUCTOS_INICIALES = [
  {
    id: "P001",
    nombre: "Guitarra Fender Stratocaster",
    descripcion: "Acabado Sunburst - Cápsulas Single Coil",
    precio: 850000,
    categoria: "C001",
    img: "/img/guitarra.jpg",
    stock: 12,
    oferta: true,
    precioOferta: 765000,
  },
  {
    id: "P002",
    nombre: "Amplificador Cort 15W",
    descripcion: "Ideal para práctica en casa",
    precio: 85000,
    categoria: "C003",
    img: "/img/amplificador-15w.jpg",
    stock: 0,
    oferta: false,
    precioOferta: 0,
  },
  {
    id: "P003",
    nombre: "Batería Acústica Dixon",
    descripcion: "5 piezas - Incluye atriles",
    precio: 450000,
    categoria: "C002",
    img: "/img/bateria.jpg",
    stock: 5,
    oferta: true,
    precioOferta: 399990,
  },
  {
    id: "P004",
    nombre: "Pedal Boss Distortion DS-1",
    descripcion: "Distorsión análoga - Naranjo",
    precio: 65000,
    categoria: "C004",
    img: "/img/pedal.jpg",
    stock: 20,
    oferta: true,
    precioOferta: 49990,
  },
  {
    id: "P005",
    nombre: "Bajo Fender Precision",
    descripcion: "4 Cuerdas - Color Negro",
    precio: 790000,
    categoria: "C001",
    img: "/img/bajo-fender.jpg",
    stock: 8,
    oferta: false,
    precioOferta: 0,
  },
  {
    id: "P006",
    nombre: "Amplificador Rumble 40W",
    descripcion: "Para bajo eléctrico - Ecualizador",
    precio: 220000,
    categoria: "C003",
    img: "/img/amplificador-40.jpg",
    stock: 3,
    oferta: false,
    precioOferta: 0,
  },
  {
    id: "P007",
    nombre: "Pedal Boss Chorus CH-1",
    descripcion: "Efecto chorus análogo - Formato compacto",
    precio: 72000,
    categoria: "C004",
    img: "/img/pedal.jpg",
    stock: 15,
    oferta: false,
    precioOferta: 0,
  },
  {
    id: "P008",
    nombre: "Guitarra Fender Telecaster",
    descripcion: "Acabado Butterscotch - Cápsulas Single Coil",
    precio: 780000,
    categoria: "C001",
    img: "/img/guitarra.jpg",
    stock: 4,
    oferta: false,
    precioOferta: 0,
  },
];

// READ: todos los productos
export function obtenerProductos() {
  return leerLista(CLAVE_PRODUCTOS, PRODUCTOS_INICIALES);
}

// READ: un producto por su id (o null si no existe)
export function obtenerProductoPorId(id) {
  return obtenerProductos().find((producto) => producto.id === id) || null;
}

// CREATE: agrega un producto nuevo y lo devuelve con su id.
// Si faltan campos opcionales (stock, oferta...) se rellenan con valores por defecto.
export function crearProducto(datos) {
  const productos = obtenerProductos();
  const nuevo = {
    descripcion: "",
    img: "",
    stock: 0,
    oferta: false,
    precioOferta: 0,
    ...datos,
    id: generarId(productos, "P"),
  };
  guardarLista(CLAVE_PRODUCTOS, [...productos, nuevo]);
  return nuevo;
}

// UPDATE: cambia los campos indicados. Devuelve el producto actualizado (o null si no existe)
export function actualizarProducto(id, cambios) {
  const productos = obtenerProductos();
  if (!productos.some((producto) => producto.id === id)) return null;

  const actualizados = productos.map((producto) =>
    producto.id === id ? { ...producto, ...cambios, id } : producto
  );
  guardarLista(CLAVE_PRODUCTOS, actualizados);
  return actualizados.find((producto) => producto.id === id);
}

// DELETE: borra un producto. Devuelve true si se borró, false si no existía
export function eliminarProducto(id) {
  const productos = obtenerProductos();
  const restantes = productos.filter((producto) => producto.id !== id);
  if (restantes.length === productos.length) return false;

  guardarLista(CLAVE_PRODUCTOS, restantes);
  return true;
}

// Precio que realmente se cobra: el de oferta si está en oferta, si no el normal
export function obtenerPrecioFinal(producto) {
  return producto.oferta ? producto.precioOferta : producto.precio;
}
