// Plantilla del panel de administración: menú lateral (sidebar) + contenido.
// Responsivo: en pantallas grandes (lg) el menú es una columna a la izquierda;
// en celular y tablet se convierte en una barra superior con botón de hamburguesa que lo despliega.
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSesion } from "../../hooks/useSesion";

// Opciones del menú. "end" hace que Dashboard solo se marque activo en /admin exacto.
const OPCIONES_MENU = [
  { ruta: "/admin", texto: "Dashboard", end: true },
  { ruta: "/admin/ordenes", texto: "Órdenes" },
  { ruta: "/admin/productos", texto: "Productos" },
  { ruta: "/admin/categorias", texto: "Categorías" },
  { ruta: "/admin/usuarios", texto: "Usuarios" },
  { ruta: "/admin/reportes", texto: "Reportes" },
  { ruta: "/admin/perfil", texto: "Perfil" },
];

export function AdminLayout() {
  const { cerrarSesion } = useSesion();
  const navigate = useNavigate();

  const salir = () => {
    cerrarSesion();
    navigate("/");
  };

  return (
    <div className="d-lg-flex min-vh-100">
      {/* flex-lg-column: en pantalla grande la barra se apila hacia abajo y queda como sidebar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="admin-sidebar flex-lg-column align-items-lg-start p-3">
        <Navbar.Brand as={Link} to="/admin">
          Sonido Vivo Admin
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-admin" />
        <Navbar.Collapse id="menu-admin" className="w-100">
          <Nav className="flex-column w-100">
            {OPCIONES_MENU.map((opcion) => (
              <Nav.Link key={opcion.ruta} as={NavLink} to={opcion.ruta} end={opcion.end}>
                {opcion.texto}
              </Nav.Link>
            ))}
            <hr className="border-secondary" />
            <Nav.Link as={Link} to="/">
              Ir a la tienda
            </Nav.Link>
            <Nav.Link as="button" className="text-start text-danger" onClick={salir}>
              Cerrar sesión
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <main className="flex-grow-1 py-4">
        <Container fluid className="px-3 px-md-4">
          <Outlet />
        </Container>
      </main>
    </div>
  );
}
