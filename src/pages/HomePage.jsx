import { Carousel, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CategoriaCard } from "../components/molecules/CategoriaCard";
import { ProductGrid } from "../components/organisms/ProductGrid";
import { obtenerCategorias } from "../data/categorias";
import { obtenerProductos } from "../data/productos";
import { useCarrito } from "../hooks/useCarrito";

// Imágenes y textos del carrusel de la portada
const DIAPOSITIVAS = [
  { img: "/img/imagen-de-la-tienda.jpg", titulo: "Sonido Vivo", texto: "Tienda de instrumentos y equipos musicales" },
  { img: "/img/guitarra.jpg", titulo: "Nuevos lanzamientos", texto: "Descubre las guitarras que llegaron a la tienda" },
  { img: "/img/bateria.jpg", titulo: "Ofertas de temporada", texto: "Aprovecha los descuentos en instrumentos seleccionados" },
];

export function HomePage() {
  const { agregar } = useCarrito();
  const categorias = obtenerCategorias();
  // Muestra solo 4 productos en oferta en la portada
  const ofertas = obtenerProductos().filter((p) => p.oferta).slice(0, 4);

  return (
    <>
      <Carousel className="mb-5 shadow-sm">
        {DIAPOSITIVAS.map((d) => (
          <Carousel.Item key={d.titulo}>
            <img className="d-block w-100 carrusel-img" src={d.img} alt={d.titulo} />
            <Carousel.Caption className="bg-dark bg-opacity-50 rounded">
              <h3>{d.titulo}</h3>
              <p>{d.texto}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <h2 className="text-center mb-4">Categorías</h2>
      <Row className="g-4 mb-5">
        {categorias.map((c) => (
          <Col key={c.id} xs={6} md={3}>
            <CategoriaCard categoria={c} />
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Ofertas destacadas</h2>
        <Link to="/ofertas">Ver todas</Link>
      </div>
      <ProductGrid productos={ofertas} onAdd={agregar} />
    </>
  );
}
