// Nuevo usuario (/admin/usuarios/nuevo) y Editar usuario (/admin/usuarios/:id/editar).
import { useState } from "react";
import { Alert } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FormularioUsuario } from "../../components/organisms/FormularioUsuario";
import { useSesion } from "../../hooks/useSesion";
import {
  actualizarUsuario,
  crearUsuario,
  obtenerUsuarioPorCorreo,
  obtenerUsuarioPorId,
  obtenerUsuarios,
} from "../../data/usuarios";

const USUARIO_VACIO = {
  run: "",
  nombre: "",
  apellidos: "",
  correo: "",
  password: "",
  rol: "cliente",
  region: "",
  comuna: "",
  direccion: "",
};

export function AdminUsuarioFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario: sesion, refrescarUsuario } = useSesion();
  const [errorGeneral, setErrorGeneral] = useState("");

  const esEdicion = id !== undefined;
  const usuarioEditado = esEdicion ? obtenerUsuarioPorId(id) : null;

  if (esEdicion && !usuarioEditado) {
    return (
      <Alert variant="warning">
        No existe un usuario con ese código. <Link to="/admin/usuarios">Volver a usuarios</Link>
      </Alert>
    );
  }

  // Al editar, el formulario parte con los datos del usuario (la contraseña se deja vacía a propósito)
  const valoresIniciales = usuarioEditado ? { ...USUARIO_VACIO, ...usuarioEditado, password: "" } : USUARIO_VACIO;

  const guardar = (datos) => {
    // No puede haber dos usuarios con el mismo correo ni el mismo RUN
    const correoRepetido = obtenerUsuarioPorCorreo(datos.correo);
    if (correoRepetido && correoRepetido.id !== id) {
      setErrorGeneral("Ya existe un usuario con ese correo.");
      return;
    }
    const runRepetido = obtenerUsuarios().some((u) => u.run === datos.run && u.id !== id);
    if (runRepetido) {
      setErrorGeneral("Ya existe un usuario con ese RUN.");
      return;
    }

    if (esEdicion) {
      const cambios = { ...datos };
      if (cambios.password === "") delete cambios.password; // vacía = mantener la contraseña actual
      actualizarUsuario(id, cambios);
      // Si el admin se editó a sí mismo, se actualiza también la sesión (el menú muestra su nombre)
      if (sesion.id === id) refrescarUsuario();
    } else {
      crearUsuario(datos);
    }
    navigate("/admin/usuarios");
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 className="h3 mb-3">{esEdicion ? `Editar usuario ${id}` : "Nuevo usuario"}</h1>
      {errorGeneral && <Alert variant="danger">{errorGeneral}</Alert>}
      <FormularioUsuario
        key={id || "nuevo"}
        valoresIniciales={valoresIniciales}
        esEdicion={esEdicion}
        rolBloqueado={esEdicion && sesion.id === id}
        textoBoton={esEdicion ? "Guardar cambios" : "Crear usuario"}
        onSubmit={guardar}
      />
    </div>
  );
}
