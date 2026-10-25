// Formulario del perfil del administrador: puede cambiar su nombre, apellidos y contraseña.
// El correo y el rol se muestran pero no se editan aquí.
import { Form } from "react-bootstrap";
import { Button } from "../atoms/Button";
import { CampoFormulario } from "../molecules/CampoFormulario";
import { useFormulario } from "../../hooks/useFormulario";
import { hayErrores, validarPerfil } from "../../utils/validaciones";

export function FormularioPerfil({ usuario, onSubmit }) {
  const { valores, errores, setErrores, manejarCambio } = useFormulario({
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    password: "",
  });

  const enviar = (evento) => {
    evento.preventDefault();
    const erroresEncontrados = validarPerfil(valores);
    setErrores(erroresEncontrados);
    if (hayErrores(erroresEncontrados)) return;

    onSubmit({
      nombre: valores.nombre.trim(),
      apellidos: valores.apellidos.trim(),
      password: valores.password.trim(),
    });
  };

  return (
    <Form onSubmit={enviar} noValidate>
      <CampoFormulario id="perfil-correo" etiqueta="Correo" value={usuario.correo} disabled readOnly />
      <CampoFormulario
        id="perfil-nombre"
        etiqueta="Nombre"
        name="nombre"
        value={valores.nombre}
        onChange={manejarCambio}
        error={errores.nombre}
      />
      <CampoFormulario
        id="perfil-apellidos"
        etiqueta="Apellidos"
        name="apellidos"
        value={valores.apellidos}
        onChange={manejarCambio}
        error={errores.apellidos}
      />
      <CampoFormulario
        id="perfil-password"
        etiqueta="Contraseña nueva"
        placeholder="Vacía = se mantiene la actual"
        tipo="password"
        obligatorio={false}
        name="password"
        value={valores.password}
        onChange={manejarCambio}
        error={errores.password}
      />
      <Button type="submit">Guardar cambios</Button>
    </Form>
  );
}
