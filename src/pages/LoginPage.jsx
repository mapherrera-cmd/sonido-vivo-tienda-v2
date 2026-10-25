// Página de inicio de sesión: muestra el formulario y, si los datos son correctos, abre la sesión.
import { useState } from "react";
import { Alert } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FormularioLogin } from "../components/organisms/FormularioLogin";
import { useSesion } from "../hooks/useSesion";

export function LoginPage() {
  const { iniciarSesion } = useSesion();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorGeneral, setErrorGeneral] = useState("");

  // La página de registro nos manda aquí con este aviso cuando la cuenta se creó bien
  const registroExitoso = location.state?.registroExitoso === true;

  const ingresar = ({ correo, password }) => {
    const usuario = iniciarSesion(correo, password);
    if (!usuario) {
      setErrorGeneral("Correo o contraseña incorrectos.");
      return;
    }
    // Los administradores van al panel; los clientes, al inicio
    navigate(usuario.rol === "admin" ? "/admin" : "/");
  };

  return (
    <div className="mx-auto" style={{ maxWidth: "500px" }}>
      <h1 className="mb-1">Iniciar sesión</h1>
      <p className="text-muted">Ingresa a tu cuenta para gestionar tus compras.</p>
      {registroExitoso && (
        <Alert variant="success">¡Registro completado con éxito! Ahora puedes iniciar sesión.</Alert>
      )}
      <FormularioLogin onSubmit={ingresar} errorGeneral={errorGeneral} />
      <p className="mt-3 text-center">
        ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
      </p>
    </div>
  );
}
