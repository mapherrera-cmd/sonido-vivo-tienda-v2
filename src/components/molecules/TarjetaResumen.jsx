// Tarjeta de color con un número grande (por ejemplo "Productos: 8"). La usan el dashboard y los reportes.
// Solo muestra lo que llega por props; no guarda estado.
import { Card } from "react-bootstrap";

export function TarjetaResumen({ titulo, valor, detalle = "", color = "primary" }) {
  return (
    <Card bg={color} text={color === "warning" ? "dark" : "white"} className="h-100 shadow-sm">
      <Card.Body>
        <Card.Subtitle className="mb-1">{titulo}</Card.Subtitle>
        <Card.Title as="p" className="display-6 mb-1">
          {valor}
        </Card.Title>
        {detalle && <Card.Text className="small mb-0">{detalle}</Card.Text>}
      </Card.Body>
    </Card>
  );
}
