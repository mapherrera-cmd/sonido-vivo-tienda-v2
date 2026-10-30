import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button } from "../atoms/Button";
import { obtenerPrecioFinal } from "../../data/productos";

export function ProductCard({ producto, onAdd }) {
  const sinStock = producto.stock <= 0;

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img variant="top" src={producto.img} alt={producto.nombre} className="img-contenida p-2" style={{ height: "200px" }} />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{producto.nombre}</Card.Title>
        <Card.Text className="text-muted small">{producto.descripcion}</Card.Text>
        <Card.Text>
          {/* Si está en oferta, se muestra el precio normal tachado y el de oferta */}
          {producto.oferta && (
            <span className="text-decoration-line-through text-muted me-2">
              ${producto.precio.toLocaleString("es-CL")}
            </span>
          )}
          <strong>${obtenerPrecioFinal(producto).toLocaleString("es-CL")}</strong>
        </Card.Text>
        <div className="mt-auto d-grid gap-2">
          <Link to={`/productos/${producto.id}`} className="btn btn-outline-primary">
            Ver detalle
          </Link>
          <Button onClick={() => onAdd(producto)} disabled={sinStock}>
            {sinStock ? "Agotado" : "Agregar al carrito"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
