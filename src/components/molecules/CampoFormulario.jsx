// Un campo de formulario: etiqueta + input (o select / textarea) + mensaje de error.
// No guarda estado: el valor y el error llegan por props (componente "controlado").
// Cuando "error" tiene texto, Bootstrap pinta el campo en rojo (clase is-invalid) y muestra el mensaje.
import { Form } from "react-bootstrap";

export function CampoFormulario({
  id,
  etiqueta,
  tipo = "text", // "text", "email", "password", "textarea" o "select"
  error = "",
  obligatorio = true,
  opciones = [], // solo para select: [{ valor, texto }]
  textoVacio = "", // solo para select: texto de la primera opción (sin valor)
  ...resto // name, value, onChange, placeholder, maxLength, disabled...
}) {
  const hayError = error !== "";

  let control;
  if (tipo === "select") {
    control = (
      <Form.Select isInvalid={hayError} {...resto}>
        <option value="">{textoVacio}</option>
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.texto}
          </option>
        ))}
      </Form.Select>
    );
  } else if (tipo === "textarea") {
    control = <Form.Control as="textarea" rows={3} isInvalid={hayError} {...resto} />;
  } else {
    control = <Form.Control type={tipo} isInvalid={hayError} {...resto} />;
  }

  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>
        {etiqueta}
        {!obligatorio && <span className="text-muted"> (opcional)</span>}
      </Form.Label>
      {control}
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
}
