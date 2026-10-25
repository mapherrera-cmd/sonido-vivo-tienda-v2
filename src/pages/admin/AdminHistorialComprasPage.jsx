// Historial de compras de un usuario (/admin/usuarios/:id/historial).
import { Alert, Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { EtiquetaEstado } from "../../components/atoms/EtiquetaEstado";
import { obtenerOrdenes } from "../../data/ordenes";
import { obtenerUsuarioPorId } from "../../data/usuarios";
import { calcularVentasTotales, obtenerOrdenesDeUsuario } from "../../utils/reportes";

export function AdminHistorialComprasPage() {
  const { id } = useParams();
  const usuario = obtenerUsuarioPorId(id);

  if (!usuario) {
    return (
      <Alert variant="warning">
        No existe un usuario con ese código. <Link to="/admin/usuarios">Volver a usuarios</Link>
      </Alert>
    );
  }

  const ordenes = obtenerOrdenesDeUsuario(obtenerOrdenes(), usuario.id);

  return (
    <>
      <h1 className="h3">Historial de compras</h1>
      <p className="text-muted">
        {usuario.nombre} {usuario.apellidos} — {usuario.correo}
      </p>

      {ordenes.length === 0 ? (
        <Alert variant="secondary">Este usuario todavía no ha realizado compras.</Alert>
      ) : (
        <>
          <Table responsive hover className="align-middle bg-white">
            <thead>
              <tr>
                <th>N° orden</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Boleta</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.id}>
                  <td>{orden.id}</td>
                  <td>{new Date(orden.fecha).toLocaleString("es-CL")}</td>
                  <td>${orden.total.toLocaleString("es-CL")}</td>
                  <td>
                    <EtiquetaEstado estado={orden.estado} />
                  </td>
                  <td>
                    <Link to={`/admin/ordenes/${orden.id}`} className="btn btn-outline-primary btn-sm">
                      Ver boleta
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <p className="fw-bold">Total comprado (solo órdenes pagadas): ${calcularVentasTotales(ordenes).toLocaleString("es-CL")}</p>
        </>
      )}

      <Link to="/admin/usuarios" className="btn btn-outline-secondary">
        Volver a usuarios
      </Link>
    </>
  );
}
