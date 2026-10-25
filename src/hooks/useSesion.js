// Hook para usar la sesión desde cualquier componente:
//   const { usuario, iniciarSesion, cerrarSesion, refrescarUsuario } = useSesion();
import { useContext } from "react";
import { SesionContext } from "../context/sesionContext";

export function useSesion() {
  const contexto = useContext(SesionContext);
  if (contexto === null) {
    throw new Error("useSesion debe usarse dentro de <SesionProvider>");
  }
  return contexto;
}
