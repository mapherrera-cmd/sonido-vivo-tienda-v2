import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

// Tarjeta clickeable de una categoría: lleva a /categorias/:id
export function CategoriaCard({ categoria, activa = false }) {
  return (
    <Card
      as={Link}
      to={`/categorias/${categoria.id}`}
      className={`tarjeta-categoria h-100 text-decoration-none text-center shadow-sm ${activa ? "border-primary border-2" : ""}`}
    >
      <Card.Img variant="top" src={categoria.img} alt={categoria.nombre} style={{ height: "140px", objectFit: "cover" }} />
      <Card.Body>
        <Card.Title className="h6 mb-0">{categoria.nombre}</Card.Title>
      </Card.Body>
    </Card>
  );
}
