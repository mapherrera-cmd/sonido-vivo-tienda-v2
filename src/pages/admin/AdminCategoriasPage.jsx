// Categorías (/admin/categorias): lista de categorías y cuántos productos tiene cada una.
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { obtenerCategorias } from "../../data/categorias";
import { obtenerProductos } from "../../data/productos";

export function AdminCategoriasPage() {
  const categorias = obtenerCategorias();
  const productos = obtenerProductos();

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Categorías</h1>
        <Link to="/admin/categorias/nueva" className="btn btn-primary">
          Nueva categoría
        </Link>
      </div>

      <Table responsive hover className="align-middle bg-white">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Productos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id}>
              <td>
                <img src={categoria.img} alt={categoria.nombre} width="60" height="45" className="img-contenida rounded border" />
              </td>
              <td>
                {categoria.nombre}
                <div className="small text-muted">{categoria.id}</div>
              </td>
              {/* Cuenta los productos que guardan el id de esta categoría */}
              <td>{productos.filter((producto) => producto.categoria === categoria.id).length}</td>
              <td>
                <Link to={`/admin/categorias/${categoria.id}/editar`} className="btn btn-outline-primary btn-sm">
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
