// Artículos del blog (datos fijos, no se editan desde la tienda).
export const BLOGS = [
  {
    id: "1",
    titulo: "¿Por qué las guitarras Stratocaster marcaron la historia?",
    resumen:
      "Descubre el origen de uno de los modelos más icónicos del rock and roll y cómo su diseño revolucionó la música en los años 50.",
    img: "/img/guitarra.jpg",
    contenido: [
      "La Stratocaster apareció en 1954 y cambió para siempre la forma de diseñar una guitarra eléctrica.",
      "Su cuerpo con curvas la hizo más cómoda de tocar, y sus tres cápsulas single coil entregaron un sonido brillante y versátil que músicos de todos los géneros adoptaron.",
      "Hoy sigue siendo una de las guitarras más tocadas del mundo, y en Sonido Vivo puedes encontrar modelos para comenzar o para subir de nivel.",
    ],
  },
  {
    id: "2",
    titulo: "Guía de mantenimiento para tu amplificador a tubos",
    resumen:
      "Consejos esenciales para prolongar la vida útil de tu equipo y mantener ese sonido cálido y análogo en tus ensayos.",
    img: "/img/amplificador-40.jpg",
    contenido: [
      "Un amplificador a tubos necesita algo de cuidado extra para sonar bien durante años.",
      "Déjalo calentar uno o dos minutos antes de tocar, evita moverlo mientras está encendido y apágalo siempre antes de desconectar el parlante.",
      "Revisa los tubos de forma periódica con un técnico: cuando pierden brillo o aparecen ruidos extraños, es momento de cambiarlos.",
    ],
  },
];

// Devuelve un artículo por su id (o null si no existe)
export function obtenerBlogPorId(id) {
  return BLOGS.find((blog) => blog.id === id) || null;
}
