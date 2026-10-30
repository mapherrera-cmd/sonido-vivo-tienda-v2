// Tabla de productos para el administrador (lista completa y lista de productos críticos).
// Recibe los productos por props. Si no recibe "onEliminar", la tabla no muestra el botón Eliminar.
import { Badge, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button } from "../atoms/Button";
import { STOCK_CRITICO } from "../../utils/reportes";

export function TablaProductosAdmin({ productos, categorias, onEliminar }) {
  // Busca el nombre de la categoría a partir del id que guarda el producto
  const nombreCategoria = (id) => categorias.find((c) => c.id === id)?.nombre || "Sin categoría";

  return (
    <Table responsive hover className="align-middle bg-white">
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Producto</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Oferta</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((producto) => (
          <tr key={producto.id}>
            <td>
              <img src={producto.img} alt={producto.nombre} width="60" height="45" className="img-contenida rounded border" />
            </td>
            <td>
              {producto.nombre}
              <div className="small text-muted">{producto.id}</div>
            </td>
            <td>{nombreCategoria(producto.categoria)}</td>
            <td>${producto.precio.toLocaleString("es-CL")}</td>
            <td>
              {/* El stock bajo se marca en rojo para que se note */}
              <Badge bg={producto.stock <= STOCK_CRITICO ? "danger" : "secondary"}>{producto.stock}</Badge>
            </td>
            <td>{producto.oferta ? `$${producto.precioOferta.toLocaleString("es-CL")}` : "—"}</td>
            <td className="text-nowrap">
              <Link to={`/admin/productos/${producto.id}/editar`} className="btn btn-outline-primary btn-sm me-2">
                Editar
              </Link>
              {onEliminar && (
                <Button variant="outline-danger" className="btn-sm" onClick={() => onEliminar(producto)}>
                  Eliminar
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
