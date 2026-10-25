// Órdenes / boletas (/admin/ordenes): lista de todas las compras, de la más nueva a la más antigua.
import { Alert, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { EtiquetaEstado } from "../../components/atoms/EtiquetaEstado";
import { obtenerOrdenes } from "../../data/ordenes";

export function AdminOrdenesPage() {
  // [...lista] hace una copia para no modificar la original al ordenar
  const ordenes = [...obtenerOrdenes()].sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <>
      <h1 className="h3 mb-3">Órdenes y boletas</h1>

      {ordenes.length === 0 ? (
        <Alert variant="secondary">Todavía no hay órdenes de compra.</Alert>
      ) : (
        <Table responsive hover className="align-middle bg-white">
          <thead>
            <tr>
              <th>N° orden</th>
              <th>Fecha</th>
              <th>Cliente</th>
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
                <td>
                  {orden.cliente.nombre} {orden.cliente.apellidos}
                </td>
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
      )}
    </>
  );
}
