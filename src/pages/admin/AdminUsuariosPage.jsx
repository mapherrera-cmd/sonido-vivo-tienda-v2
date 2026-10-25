// Usuarios (/admin/usuarios): lista de cuentas con acceso a editar y al historial de compras.
import { Badge, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { obtenerUsuarios } from "../../data/usuarios";

export function AdminUsuariosPage() {
  const usuarios = obtenerUsuarios();

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Usuarios</h1>
        <Link to="/admin/usuarios/nuevo" className="btn btn-primary">
          Nuevo usuario
        </Link>
      </div>

      <Table responsive hover className="align-middle bg-white">
        <thead>
          <tr>
            <th>RUN</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.run}</td>
              <td>
                {usuario.nombre} {usuario.apellidos}
              </td>
              <td>{usuario.correo}</td>
              <td>
                <Badge bg={usuario.rol === "admin" ? "dark" : "info"}>
                  {usuario.rol === "admin" ? "Administrador" : "Cliente"}
                </Badge>
              </td>
              <td className="text-nowrap">
                <Link to={`/admin/usuarios/${usuario.id}/editar`} className="btn btn-outline-primary btn-sm me-2">
                  Editar
                </Link>
                <Link to={`/admin/usuarios/${usuario.id}/historial`} className="btn btn-outline-secondary btn-sm">
                  Historial de compras
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
