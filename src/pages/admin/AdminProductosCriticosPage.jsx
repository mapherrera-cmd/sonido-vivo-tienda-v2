// Listado de productos críticos (/admin/productos/criticos): los que tienen poco stock o están agotados.
import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { TablaProductosAdmin } from "../../components/organisms/TablaProductosAdmin";
import { obtenerCategorias } from "../../data/categorias";
import { obtenerProductos } from "../../data/productos";
import { STOCK_CRITICO, obtenerProductosCriticos } from "../../utils/reportes";

export function AdminProductosCriticosPage() {
  const criticos = obtenerProductosCriticos(obtenerProductos());

  return (
    <>
      <h1 className="h3">Productos críticos</h1>
      <p className="text-muted">Productos con {STOCK_CRITICO} unidades o menos. Conviene reponerlos pronto.</p>

      {criticos.length === 0 ? (
        <Alert variant="success">No hay productos con stock crítico.</Alert>
      ) : (
        <TablaProductosAdmin productos={criticos} categorias={obtenerCategorias()} />
      )}

      <Link to="/admin/productos" className="btn btn-outline-secondary">
        Volver a productos
      </Link>
    </>
  );
}
