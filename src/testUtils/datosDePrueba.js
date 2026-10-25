// Datos de ejemplo que comparten varias pruebas.
// Son datos fijos y pequeños: así sabemos exactamente qué resultado esperar.

export const productoConOferta = {
  id: "T001",
  nombre: "Guitarra de Prueba",
  descripcion: "Guitarra para pruebas",
  precio: 850000,
  categoria: "C001",
  img: "/img/guitarra.jpg",
  stock: 12,
  oferta: true,
  precioOferta: 765000,
};

export const productoNormal = {
  id: "T002",
  nombre: "Amplificador de Prueba",
  descripcion: "Para practicar en casa",
  precio: 85000,
  categoria: "C003",
  img: "/img/amplificador-15w.jpg",
  stock: 8,
  oferta: false,
  precioOferta: 0,
};

export const productoAgotado = {
  id: "T003",
  nombre: "Bateria de Prueba",
  descripcion: "Producto sin stock",
  precio: 450000,
  categoria: "C002",
  img: "/img/bateria.jpg",
  stock: 0,
  oferta: false,
  precioOferta: 0,
};

export const productoPocoStock = {
  id: "T004",
  nombre: "Pedal de Prueba",
  descripcion: "Quedan pocas unidades",
  precio: 65000,
  categoria: "C004",
  img: "/img/pedal.jpg",
  stock: 3,
  oferta: false,
  precioOferta: 0,
};

export const listaProductos = [productoConOferta, productoNormal, productoAgotado, productoPocoStock];

// Órdenes de ejemplo para los reportes del admin
export const ordenesDePrueba = [
  {
    id: "ORD-001",
    fecha: "2026-10-01T10:00:00.000Z",
    estado: "pagada",
    usuarioId: "U001",
    total: 3000,
    items: [
      { id: "P1", nombre: "Pedal", precio: 1000, cantidad: 2 },
      { id: "P2", nombre: "Cuerdas", precio: 500, cantidad: 2 },
    ],
  },
  {
    id: "ORD-002",
    fecha: "2026-10-02T10:00:00.000Z",
    estado: "rechazada",
    usuarioId: "U002",
    total: 9000,
    items: [{ id: "P1", nombre: "Pedal", precio: 1000, cantidad: 9 }],
  },
  {
    id: "ORD-003",
    fecha: "2026-10-03T10:00:00.000Z",
    estado: "pagada",
    usuarioId: "U002",
    total: 1000,
    items: [{ id: "P1", nombre: "Pedal", precio: 1000, cantidad: 1 }],
  },
];
