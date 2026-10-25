// Página de registro: muestra el formulario y, si los datos son válidos, crea el usuario.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormularioRegistro } from "../components/organisms/FormularioRegistro";
import { crearUsuario } from "../data/usuarios";

export function RegistroPage() {
  const navigate = useNavigate();
  const [errorGeneral, setErrorGeneral] = useState("");

  const registrar = (datos) => {
    // Todo usuario que se registra desde la tienda es "cliente"
    const nuevo = crearUsuario({ ...datos, rol: "cliente" });
    if (nuevo === null) {
      setErrorGeneral("Ya existe una cuenta con ese correo.");
      return;
    }
    navigate("/login", { state: { registroExitoso: true } });
  };

  return (
    <div className="mx-auto" style={{ maxWidth: "500px" }}>
      <h1 className="mb-1">Crear cuenta</h1>
      <p className="text-muted">Regístrate para comprar tus instrumentos favoritos.</p>
      <FormularioRegistro onSubmit={registrar} errorGeneral={errorGeneral} />
      <p className="mt-3 text-center">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}
