// Perfil (/admin/perfil): el administrador cambia su nombre, apellidos y contraseña.
import { useState } from "react";
import { Alert } from "react-bootstrap";
import { FormularioPerfil } from "../../components/organisms/FormularioPerfil";
import { actualizarUsuario } from "../../data/usuarios";
import { useSesion } from "../../hooks/useSesion";

export function AdminPerfilPage() {
  const { usuario, refrescarUsuario } = useSesion();
  const [guardados, setGuardados] = useState(0); // cuántas veces se guardó (también reinicia el formulario)

  const guardar = (datos) => {
    const cambios = { nombre: datos.nombre, apellidos: datos.apellidos };
    if (datos.password !== "") cambios.password = datos.password; // vacía = mantener la actual

    actualizarUsuario(usuario.id, cambios);
    refrescarUsuario();
    setGuardados((cantidad) => cantidad + 1);
  };

  return (
    <div style={{ maxWidth: "600px" }}>
      <h1 className="h3 mb-3">Mi perfil</h1>
      {guardados > 0 && <Alert variant="success">Tus datos se guardaron correctamente.</Alert>}
      {/* key cambia al guardar: así el formulario se reinicia y la contraseña escrita se borra */}
      <FormularioPerfil key={guardados} usuario={usuario} onSubmit={guardar} />
    </div>
  );
}
