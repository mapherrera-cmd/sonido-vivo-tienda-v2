import { useState } from "react";
import { Form } from "react-bootstrap";
import { Button } from "../components/atoms/Button";

export function ContactoPage() {
  // Los datos del formulario viven en un solo objeto de estado
  const [datos, setDatos] = useState({ nombre: "", correo: "", mensaje: "" });
  const [enviado, setEnviado] = useState(false);

  // Actualiza el campo que escribió la persona (usa el atributo "name" del input)
  const cambiar = (evento) => {
    setDatos({ ...datos, [evento.target.name]: evento.target.value });
  };

  // Aún no hay servidor: solo se muestra un aviso y se limpia el formulario
  const enviar = (evento) => {
    evento.preventDefault();
    setEnviado(true);
    setDatos({ nombre: "", correo: "", mensaje: "" });
  };

  return (
    <div className="mx-auto" style={{ maxWidth: "600px" }}>
      <h1 className="mb-2">Contáctanos</h1>
      <p className="text-muted">¿Tienes dudas sobre algún instrumento? Escríbenos.</p>

      {enviado && <div className="alert alert-success">¡Mensaje enviado! Te responderemos pronto.</div>}

      <Form onSubmit={enviar}>
        <Form.Group className="mb-3" controlId="contacto-nombre">
          <Form.Label>Nombre completo</Form.Label>
          <Form.Control name="nombre" value={datos.nombre} onChange={cambiar} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="contacto-correo">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control type="email" name="correo" value={datos.correo} onChange={cambiar} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="contacto-mensaje">
          <Form.Label>Tu mensaje</Form.Label>
          <Form.Control as="textarea" rows={4} name="mensaje" value={datos.mensaje} onChange={cambiar} required />
        </Form.Group>
        <Button type="submit">Enviar mensaje</Button>
      </Form>
    </div>
  );
}
