// Reportes (/admin/reportes): ventas totales, estado de las órdenes y productos más vendidos.
import { Alert, Col, Row, Table } from "react-bootstrap";
import { TarjetaResumen } from "../../components/molecules/TarjetaResumen";
import { obtenerOrdenes } from "../../data/ordenes";
import { obtenerProductos } from "../../data/productos";
import {
  calcularVentasPorProducto,
  calcularVentasTotales,
  filtrarOrdenesPagadas,
  obtenerProductosCriticos,
} from "../../utils/reportes";

export function AdminReportesPage() {
  const ordenes = obtenerOrdenes();
  const pagadas = filtrarOrdenesPagadas(ordenes).length;
  const ventasPorProducto = calcularVentasPorProducto(ordenes);

  return (
    <>
      <h1 className="h3 mb-3">Reportes</h1>

      <Row className="g-3 mb-4">
        <Col xs={12} md={6} xl={3}>
          <TarjetaResumen titulo="Ventas totales" valor={`$${calcularVentasTotales(ordenes).toLocaleString("es-CL")}`} color="primary" />
        </Col>
        <Col xs={12} md={6} xl={3}>
          <TarjetaResumen titulo="Órdenes pagadas" valor={pagadas} color="success" />
        </Col>
        <Col xs={12} md={6} xl={3}>
          <TarjetaResumen titulo="Pagos rechazados" valor={ordenes.length - pagadas} color="danger" />
        </Col>
        <Col xs={12} md={6} xl={3}>
          <TarjetaResumen
            titulo="Productos críticos"
            valor={obtenerProductosCriticos(obtenerProductos()).length}
            color="warning"
          />
        </Col>
      </Row>

      <h2 className="h5">Productos más vendidos</h2>
      {ventasPorProducto.length === 0 ? (
        <Alert variant="secondary">Todavía no hay ventas para mostrar.</Alert>
      ) : (
        <Table responsive hover className="align-middle bg-white">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Unidades vendidas</th>
              <th>Ingresos</th>
            </tr>
          </thead>
          <tbody>
            {ventasPorProducto.map((fila) => (
              <tr key={fila.id}>
                <td>{fila.nombre}</td>
                <td>{fila.unidades}</td>
                <td>${fila.ingresos.toLocaleString("es-CL")}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
