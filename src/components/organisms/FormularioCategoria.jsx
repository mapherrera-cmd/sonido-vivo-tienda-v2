// Formulario para crear o editar una categoría (nombre + imagen).
// Valida y avisa con onSubmit(datos); la página es quien guarda la categoría.
import { Form } from "react-bootstrap";
import { Button } from "../atoms/Button";
import { CampoFormulario } from "../molecules/CampoFormulario";
import { useFormulario } from "../../hooks/useFormulario";
import { IMAGENES_DISPONIBLES } from "../../data/imagenes";
import { hayErrores, validarCategoria } from "../../utils/validaciones";

export function FormularioCategoria({ valoresIniciales, textoBoton, onSubmit }) {
  const { valores, errores, setErrores, manejarCambio } = useFormulario(valoresIniciales);

  const enviar = (evento) => {
    evento.preventDefault();
    const erroresEncontrados = validarCategoria(valores);
    setErrores(erroresEncontrados);
    if (hayErrores(erroresEncontrados)) return;

    onSubmit({ nombre: valores.nombre.trim(), img: valores.img });
  };

  return (
    <Form onSubmit={enviar} noValidate>
      <CampoFormulario
        id="cat-nombre"
        etiqueta="Nombre de la categoría"
        name="nombre"
        value={valores.nombre}
        onChange={manejarCambio}
        error={errores.nombre}
      />
      <CampoFormulario
        id="cat-img"
        etiqueta="Imagen"
        tipo="select"
        name="img"
        textoVacio="-- Sin imagen --"
        opciones={IMAGENES_DISPONIBLES}
        value={valores.img}
        onChange={manejarCambio}
      />
      {valores.img && (
        <img src={valores.img} alt="Vista previa" height="80" className="mb-3 rounded border" style={{ objectFit: "cover" }} />
      )}
      <div>
        <Button type="submit">{textoBoton}</Button>
      </div>
    </Form>
  );
}
