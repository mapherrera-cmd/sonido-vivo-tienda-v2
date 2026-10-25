import { Row, Col, Badge } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/atoms/Button";
import { obtenerCategoriaPorId } from "../data/categorias";
import { obtenerPrecioFinal, obtenerProductoPorId } from "../data/productos";
import { useCarrito } from "../hooks/useCarrito";

export function DetalleProductoPage() {
  // El id viene de la URL: /productos/P001
  const { id } = useParams();
  const { agregar } = useCarrito();
  const producto = obtenerProductoPorId(id);

  if (!producto) {
    return (
      <div className="alert alert-warning">
        El producto no existe. <Link to="/productos">Volver a productos</Link>
      </div>
    );
  }

  const categoria = obtenerCategoriaPorId(producto.categoria);
  const sinStock = producto.stock <= 0;

  return (
    <Row className="g-4">
      <Col md={6}>
        <img src={producto.img} alt={producto.nombre} className="img-fluid rounded shadow-sm w-100" />
      </Col>
      <Col md={6}>
        {categoria && (
          <Link to={`/categorias/${categoria.id}`} className="text-decoration-none">
            {categoria.nombre}
          </Link>
        )}
        <h1 className="h2 mt-1">{producto.nombre}</h1>
        <p className="text-muted">{producto.descripcion}</p>

        <p className="fs-4">
          {producto.oferta && (
            <span className="text-decoration-line-through text-muted me-2 fs-6">
              ${producto.precio.toLocaleString("es-CL")}
            </span>
          )}
          <strong>${obtenerPrecioFinal(producto).toLocaleString("es-CL")}</strong>
          {producto.oferta && <Badge bg="danger" className="ms-2">Oferta</Badge>}
        </p>

        <p>{sinStock ? "Sin stock disponible" : `Stock disponible: ${producto.stock}`}</p>

        <Button onClick={() => agregar(producto)} disabled={sinStock}>
          {sinStock ? "Agotado" : "Agregar al carrito"}
        </Button>
        <Link to="/productos" className="btn btn-outline-secondary ms-2">Volver</Link>
      </Col>
    </Row>
  );
}
