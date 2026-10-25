// Formulario de inicio de sesión. Solo valida y avisa; quien inicia la sesión es la página.
//   onSubmit({ correo, password }) se llama solo si los datos pasan las validaciones.
//   errorGeneral: mensaje que la página quiere mostrar (por ejemplo "credenciales incorrectas").
import { Alert, Form } from "react-bootstrap";
import { Button } from "../atoms/Button";
import { CampoFormulario } from "../molecules/CampoFormulario";
import { useFormulario } from "../../hooks/useFormulario";
import { hayErrores, validarLogin } from "../../utils/validaciones";

export function FormularioLogin({ onSubmit, errorGeneral = "" }) {
  const { valores, errores, setErrores, manejarCambio } = useFormulario({ correo: "", password: "" });

  const enviar = (evento) => {
    evento.preventDefault(); // evita que el navegador recargue la página
    const erroresEncontrados = validarLogin(valores);
    setErrores(erroresEncontrados);
    if (hayErrores(erroresEncontrados)) return; // hay errores: no se envía
    onSubmit({ correo: valores.correo.trim().toLowerCase(), password: valores.password.trim() });
  };

  return (
    <Form onSubmit={enviar} noValidate>
      {/* Renderizado condicional: la alerta solo existe si hay un error general */}
      {errorGeneral && <Alert variant="danger">{errorGeneral}</Alert>}

      <CampoFormulario
        id="login-correo"
        etiqueta="Correo electrónico"
        tipo="email"
        name="correo"
        placeholder="ejemplo@gmail.com"
        value={valores.correo}
        onChange={manejarCambio}
        error={errores.correo}
      />
      <CampoFormulario
        id="login-password"
        etiqueta="Contraseña"
        tipo="password"
        name="password"
        placeholder="Tu contraseña"
        value={valores.password}
        onChange={manejarCambio}
        error={errores.password}
      />
      <Button type="submit" className="w-100">
        Ingresar
      </Button>
    </Form>
  );
}
