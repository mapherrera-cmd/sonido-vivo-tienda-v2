// Etiqueta de color con el estado de una orden: "pagada" (verde) o "rechazada" (roja).
import { Badge } from "react-bootstrap";

export function EtiquetaEstado({ estado }) {
  const pagada = estado === "pagada";
  return <Badge bg={pagada ? "success" : "danger"}>{pagada ? "Pagada" : "Rechazada"}</Badge>;
}
