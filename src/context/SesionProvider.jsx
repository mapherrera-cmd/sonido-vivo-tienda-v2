// Guarda al usuario que inició sesión y lo comparte con toda la app.
// Solo se guarda el id del usuario en localStorage (así la sesión sobrevive a recargar).
import { useState } from "react";
import { SesionContext } from "./sesionContext";
import { obtenerUsuarioPorCorreo, obtenerUsuarioPorId } from "../data/usuarios";

const CLAVE_SESION = "sv_sesion";

// Lee el id guardado y busca al usuario (null si no hay sesión)
function leerUsuarioGuardado() {
  try {
    const id = localStorage.getItem(CLAVE_SESION);
    return id ? obtenerUsuarioPorId(id) : null;
  } catch {
    return null;
  }
}

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(leerUsuarioGuardado);

  // Devuelve el usuario si el correo y la contraseña son correctos, o null si no
  const iniciarSesion = (correo, password) => {
    const encontrado = obtenerUsuarioPorCorreo(correo);
    if (!encontrado || encontrado.password !== password) return null;

    localStorage.setItem(CLAVE_SESION, encontrado.id);
    setUsuario(encontrado);
    return encontrado;
  };

  const cerrarSesion = () => {
    localStorage.removeItem(CLAVE_SESION);
    setUsuario(null);
  };

  // Vuelve a leer al usuario desde los datos guardados.
  // Se usa cuando alguien edita su propio perfil, para que el menú muestre el nombre nuevo.
  const refrescarUsuario = () => setUsuario(leerUsuarioGuardado());

  const valor = { usuario, iniciarSesion, cerrarSesion, refrescarUsuario };

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}
