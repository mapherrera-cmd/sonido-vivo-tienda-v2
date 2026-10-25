import { Link } from "react-router-dom";

// Se muestra cuando la URL no coincide con ninguna ruta (error 404)
export function NotFoundPage() {
  return (
    <div className="text-center py-5">
      <h1 className="display-4">404</h1>
      <p className="lead">La página que buscas no existe.</p>
      <Link to="/" className="btn btn-primary">Volver al inicio</Link>
    </div>
  );
}
