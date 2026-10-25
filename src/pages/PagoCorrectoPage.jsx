// Pantalla de compra exitosa (/pago-correcto/:id): muestra la boleta de la orden pagada.
import { Alert } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { ResumenOrden } from "../components/organisms/ResumenOrden";
import { obtenerOrdenPorId } from "../data/ordenes";

export function PagoCorrectoPage() {
  const { id } = useParams(); // número de orden que viene en la URL
  const orden = obtenerOrdenPorId(id);

  // Si la orden no existe o no está pagada, no se puede mostrar la boleta
  if (!orden || orden.estado !== "pagada") {
    return (
      <Alert variant="warning">
        No encontramos una compra pagada con ese número. <Link to="/productos">Ver productos</Link>
      </Alert>
    );
  }

  return (
    <div className="mx-auto" style={{ maxWidth: "800px" }}>
      <h1 className="h3 text-success">✔ Se ha realizado la compra. N° {orden.id}</h1>
      <p className="text-muted">Fecha: {new Date(orden.fecha).toLocaleString("es-CL")}</p>
      <ResumenOrden orden={orden} />
      <Link to="/productos" className="btn btn-success mt-3">
        Seguir comprando
      </Link>
    </div>
  );
}
