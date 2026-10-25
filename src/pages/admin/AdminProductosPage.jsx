// Productos (/admin/productos): lista con acciones de editar y eliminar.
// Lo que se cambia aquí se guarda con las funciones CRUD de data/productos.js y se ve de inmediato en la tienda.
import { useState } from "react";
import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { TablaProductosAdmin } from "../../components/organisms/TablaProductosAdmin";
import { obtenerCategorias } from "../../data/categorias";
import { eliminarProducto, obtenerProductos } from "../../data/productos";

export function AdminProductosPage() {
  // La lista vive en el estado: al eliminar se vuelve a leer y la tabla se actualiza sola
  const [productos, setProductos] = useState(obtenerProductos);
  const [mensaje, setMensaje] = useState("");
  const categorias = obtenerCategorias();

  const eliminar = (producto) => {
    // window.confirm pregunta antes de borrar; si la persona cancela, no se hace nada
    if (!window.confirm(`¿Seguro que quieres eliminar "${producto.nombre}"?`)) return;

    eliminarProducto(producto.id);
    setProductos(obtenerProductos());
    setMensaje(`Se eliminó el producto "${producto.nombre}".`);
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Productos</h1>
        <div className="d-flex gap-2">
          <Link to="/admin/productos/criticos" className="btn btn-outline-danger">
            Productos críticos
          </Link>
          <Link to="/admin/productos/nuevo" className="btn btn-primary">
            Nuevo producto
          </Link>
        </div>
      </div>

      {mensaje && (
        <Alert variant="success" dismissible onClose={() => setMensaje("")}>
          {mensaje}
        </Alert>
      )}

      {productos.length === 0 ? (
        <Alert variant="secondary">No hay productos. Crea el primero con "Nuevo producto".</Alert>
      ) : (
        <TablaProductosAdmin productos={productos} categorias={categorias} onEliminar={eliminar} />
      )}
    </>
  );
}
