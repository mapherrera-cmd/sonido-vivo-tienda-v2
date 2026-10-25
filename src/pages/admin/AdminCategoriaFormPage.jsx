// Nueva categoría (/admin/categorias/nueva) y Editar categoría (/admin/categorias/:id/editar).
import { Alert } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FormularioCategoria } from "../../components/organisms/FormularioCategoria";
import { actualizarCategoria, crearCategoria, obtenerCategoriaPorId } from "../../data/categorias";
import { IMAGENES_DISPONIBLES } from "../../data/imagenes";

export function AdminCategoriaFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const esEdicion = id !== undefined;
  const categoria = esEdicion ? obtenerCategoriaPorId(id) : null;

  if (esEdicion && !categoria) {
    return (
      <Alert variant="warning">
        No existe una categoría con ese código. <Link to="/admin/categorias">Volver a categorías</Link>
      </Alert>
    );
  }

  const valoresIniciales = categoria
    ? { nombre: categoria.nombre, img: categoria.img }
    : { nombre: "", img: IMAGENES_DISPONIBLES[0].valor };

  const guardar = (datos) => {
    if (esEdicion) {
      actualizarCategoria(id, datos);
    } else {
      crearCategoria(datos);
    }
    navigate("/admin/categorias");
  };

  return (
    <div style={{ maxWidth: "600px" }}>
      <h1 className="h3 mb-3">{esEdicion ? `Editar categoría ${id}` : "Nueva categoría"}</h1>
      <FormularioCategoria
        key={id || "nueva"}
        valoresIniciales={valoresIniciales}
        textoBoton={esEdicion ? "Guardar cambios" : "Crear categoría"}
        onSubmit={guardar}
      />
    </div>
  );
}
