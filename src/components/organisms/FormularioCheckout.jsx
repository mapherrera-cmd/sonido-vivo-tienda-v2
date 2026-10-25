// Formulario del checkout: datos del cliente + dirección de entrega.
// Si hay un usuario con sesión iniciada, los campos parten rellenos con sus datos.
//   onSubmit(datos) se llama solo si todo está válido; la página se encarga de pagar.
import { Form, Row, Col } from "react-bootstrap";
import { Button } from "../atoms/Button";
import { CampoFormulario } from "../molecules/CampoFormulario";
import { SelectorRegionComuna } from "../molecules/SelectorRegionComuna";
import { useFormulario } from "../../hooks/useFormulario";
import { hayErrores, validarCheckout } from "../../utils/validaciones";

// Valores con los que parte el formulario (rellenos si hay sesión)
function valoresIniciales(usuario) {
  return {
    nombre: usuario?.nombre || "",
    apellidos: usuario?.apellidos || "",
    correo: usuario?.correo || "",
    calle: usuario?.direccion || "",
    departamento: "",
    region: usuario?.region || "",
    comuna: usuario?.comuna || "",
    indicaciones: "",
  };
}

export function FormularioCheckout({ usuario = null, total, onSubmit }) {
  const { valores, errores, setErrores, manejarCambio, actualizarCampos } = useFormulario(valoresIniciales(usuario));

  const enviar = (evento) => {
    evento.preventDefault();
    const erroresEncontrados = validarCheckout(valores);
    setErrores(erroresEncontrados);
    if (hayErrores(erroresEncontrados)) return;
    onSubmit(valores);
  };

  return (
    <Form onSubmit={enviar} noValidate>
      <h2 className="h5">Información del cliente</h2>
      <Row>
        {/* xs=12: una columna en el celular; md=6: dos columnas desde tablet */}
        <Col xs={12} md={6}>
          <CampoFormulario
            id="chk-nombre"
            etiqueta="Nombre"
            name="nombre"
            value={valores.nombre}
            onChange={manejarCambio}
            error={errores.nombre}
          />
        </Col>
        <Col xs={12} md={6}>
          <CampoFormulario
            id="chk-apellidos"
            etiqueta="Apellidos"
            name="apellidos"
            value={valores.apellidos}
            onChange={manejarCambio}
            error={errores.apellidos}
          />
        </Col>
        <Col xs={12}>
          <CampoFormulario
            id="chk-correo"
            etiqueta="Correo"
            tipo="email"
            name="correo"
            value={valores.correo}
            onChange={manejarCambio}
            error={errores.correo}
          />
        </Col>
      </Row>

      <h2 className="h5 mt-2">Dirección de entrega de los productos</h2>
      <Row>
        <Col xs={12} md={6}>
          <CampoFormulario
            id="chk-calle"
            etiqueta="Calle"
            name="calle"
            value={valores.calle}
            onChange={manejarCambio}
            error={errores.calle}
          />
        </Col>
        <Col xs={12} md={6}>
          <CampoFormulario
            id="chk-departamento"
            etiqueta="Departamento"
            obligatorio={false}
            name="departamento"
            placeholder="Ej: 603"
            value={valores.departamento}
            onChange={manejarCambio}
          />
        </Col>
      </Row>
      <SelectorRegionComuna
        region={valores.region}
        comuna={valores.comuna}
        onChange={actualizarCampos}
        errorRegion={errores.region}
        errorComuna={errores.comuna}
      />
      <CampoFormulario
        id="chk-indicaciones"
        etiqueta="Indicaciones para la entrega"
        tipo="textarea"
        obligatorio={false}
        name="indicaciones"
        placeholder="Ej: Entre calles, color del edificio, no tiene timbre."
        value={valores.indicaciones}
        onChange={manejarCambio}
      />

      <div className="d-flex justify-content-end">
        <Button type="submit" variant="success">
          Pagar ahora ${total.toLocaleString("es-CL")}
        </Button>
      </div>
    </Form>
  );
}
