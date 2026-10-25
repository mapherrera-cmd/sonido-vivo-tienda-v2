// Nuevo producto (/admin/productos/nuevo) y Editar producto (/admin/productos/:id/editar).
// Es la misma página para las dos cosas: si la URL trae un id, edita; si no, crea.
import { Alert } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FormularioProducto } from "../../components/organisms/FormularioProducto";
import { obtenerCategorias } from "../../data/categorias";
import { IMAGENES_DISPONIBLES } from "../../data/imagenes";
import { actualizarProducto, crearProducto, obtenerProductoPorId } from "../../data/productos";

// Valores de un formulario en blanco (los inputs trabajan con texto, por eso todo es string)
const PRODUCTO_VACIO = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  categoria: "",
  img: IMAGENES_DISPONIBLES[0].valor,
  oferta: false,
  precioOferta: "",
};

export function AdminProductoFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const categorias = obtenerCategorias();

  const esEdicion = id !== undefined;
  const producto = esEdicion ? obtenerProductoPorId(id) : null;

  if (esEdicion && !producto) {
    return (
      <Alert variant="warning">
        No existe un producto con ese código. <Link to="/admin/productos">Volver a productos</Link>
      </Alert>
    );
  }

  // Al editar, el formulario parte con los datos del producto
  const valoresIniciales = producto
    ? {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: String(producto.precio),
        stock: String(producto.stock),
        categoria: producto.categoria,
        img: producto.img,
        oferta: producto.oferta,
        precioOferta: producto.oferta ? String(producto.precioOferta) : "",
      }
    : PRODUCTO_VACIO;

  const guardar = (datos) => {
    if (esEdicion) {
      actualizarProducto(id, datos);
    } else {
      crearProducto(datos);
    }
    navigate("/admin/productos");
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 className="h3 mb-3">{esEdicion ? `Editar producto ${id}` : "Nuevo producto"}</h1>
      {/* key obliga a React a crear un formulario nuevo si cambia el producto editado */}
      <FormularioProducto
        key={id || "nuevo"}
        valoresIniciales={valoresIniciales}
        categorias={categorias}
        textoBoton={esEdicion ? "Guardar cambios" : "Crear producto"}
        onSubmit={guardar}
      />
    </div>
  );
}
