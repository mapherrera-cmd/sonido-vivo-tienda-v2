// "Guardia" de las rutas /admin: solo deja pasar a un usuario con rol admin.
// Si no hay sesión o es un cliente, lo manda al login. Si pasa, pinta las rutas hijas (<Outlet />).
import { Navigate, Outlet } from "react-router-dom";
import { useSesion } from "../../hooks/useSesion";

export function RutaAdmin() {
  const { usuario } = useSesion();

  if (!usuario || usuario.rol !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
