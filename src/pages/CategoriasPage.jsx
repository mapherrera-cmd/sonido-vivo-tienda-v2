import { Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { CategoriaCard } from "../components/molecules/CategoriaCard";
import { ProductGrid } from "../components/organisms/ProductGrid";
import { obtenerCategoriaPorId, obtenerCategorias } from "../data/categorias";
import { obtenerProductos } from "../data/productos";
import { useCarrito } from "../hooks/useCarrito";

// Sirve para dos rutas: /categorias (solo tarjetas) y /categorias/:id (tarjetas + productos de esa categoría)
export function CategoriasPage() {
  const { id } = useParams();
  const { agregar } = useCarrito();
  const categorias = obtenerCategorias();
  const seleccionada = id ? obtenerCategoriaPorId(id) : null;

  // Solo los productos de la categoría elegida
  const productos = seleccionada ? obtenerProductos().filter((p) => p.categoria === seleccionada.id) : [];

  return (
    <>
      <h1 className="mb-3">Categorías</h1>
      <Row className="g-4 mb-5">
        {categorias.map((c) => (
          <Col key={c.id} xs={6} md={3}>
            <CategoriaCard categoria={c} activa={c.id === id} />
          </Col>
        ))}
      </Row>

      {/* Si el id de la URL no corresponde a ninguna categoría */}
      {id && !seleccionada && (
        <div className="alert alert-warning">
          La categoría no existe. <Link to="/categorias">Ver todas</Link>
        </div>
      )}

      {seleccionada && (
        <>
          <h2 className="mb-3">{seleccionada.nombre}</h2>
          <ProductGrid productos={productos} onAdd={agregar} />
        </>
      )}

      {!id && <p className="text-muted">Elige una categoría para ver sus productos.</p>}
    </>
  );
}
