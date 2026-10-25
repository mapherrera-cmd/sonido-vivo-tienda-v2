// Mostrar boleta (/admin/ordenes/:id): el detalle completo de una orden.
import { Alert } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { EtiquetaEstado } from "../../components/atoms/EtiquetaEstado";
import { ResumenOrden } from "../../components/organisms/ResumenOrden";
import { obtenerOrdenPorId } from "../../data/ordenes";

export function AdminBoletaPage() {
  const { id } = useParams(); // número de orden que viene en la URL
  const orden = obtenerOrdenPorId(id);

  if (!orden) {
    return (
      <Alert variant="warning">
        No existe una orden con ese número. <Link to="/admin/ordenes">Volver a las órdenes</Link>
      </Alert>
    );
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 className="h3">
        Boleta N° {orden.id} <EtiquetaEstado estado={orden.estado} />
      </h1>
      <p className="text-muted">Fecha: {new Date(orden.fecha).toLocaleString("es-CL")}</p>
      <ResumenOrden orden={orden} />
      <Link to="/admin/ordenes" className="btn btn-outline-secondary mt-3">
        Volver a las órdenes
      </Link>
    </div>
  );
}
