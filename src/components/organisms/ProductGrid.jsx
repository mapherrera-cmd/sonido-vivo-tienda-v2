import { Row, Col } from "react-bootstrap";
import { ProductCard } from "../molecules/ProductCard";

export function ProductGrid({ productos, onAdd }) {
  // Si no hay productos para mostrar, se avisa en vez de dejar la página vacía
  if (productos.length === 0) {
    return <div className="alert alert-secondary">No hay productos para mostrar.</div>;
  }

  return (
    <Row className="g-4">
      {productos.map((p) => (
        <Col key={p.id} xs={12} sm={6} md={4} lg={3}>
          <ProductCard producto={p} onAdd={onAdd} />
        </Col>
      ))}
    </Row>
  );
}
