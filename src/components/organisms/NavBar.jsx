import { useState } from "react";
import { Navbar, Container, Nav, NavDropdown, Form, Button } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCarrito } from "../../hooks/useCarrito";
import { useSesion } from "../../hooks/useSesion";
import { obtenerCategorias } from "../../data/categorias";

export function NavBar() {
  // Total a pagar del carrito compartido y usuario con sesión iniciada
  const { total } = useCarrito();
  const { usuario, cerrarSesion } = useSesion();
  const navigate = useNavigate();

  // Texto escrito en el buscador
  const [texto, setTexto] = useState("");
  const categorias = obtenerCategorias();

  // Al buscar, va a /productos con el texto en la URL (ej: /productos?buscar=guitarra)
  const buscar = (evento) => {
    evento.preventDefault();
    navigate(`/productos?buscar=${encodeURIComponent(texto.trim())}`);
  };

  const salir = () => {
    cerrarSesion();
    navigate("/");
  };

  return (
    <Navbar bg="light" expand="lg" className="border-bottom shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          Sonido Vivo
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" />
        <Navbar.Collapse id="menu-principal">
          {/* Enlaces de navegación: NavLink marca en azul la página actual */}
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/productos">Productos</Nav.Link>
            <NavDropdown title="Categorías" id="menu-categorias">
              <NavDropdown.Item as={Link} to="/categorias">Todas las categorías</NavDropdown.Item>
              <NavDropdown.Divider />
              {categorias.map((c) => (
                <NavDropdown.Item key={c.id} as={Link} to={`/categorias/${c.id}`}>
                  {c.nombre}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <Nav.Link as={NavLink} to="/ofertas">Ofertas</Nav.Link>
            <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
            <Nav.Link as={NavLink} to="/blogs">Blogs</Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
          </Nav>

          {/* Buscador */}
          <Form className="d-flex me-lg-3 my-2 my-lg-0" onSubmit={buscar}>
            <Form.Control
              type="search"
              placeholder="Buscar"
              aria-label="Buscar productos"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="me-2"
            />
            <Button type="submit" variant="outline-success">Buscar</Button>
          </Form>

          {/* Carrito con el total a pagar */}
          <Link to="/carrito" className="btn btn-success me-lg-3 mb-2 mb-lg-0">
            Carrito ${total.toLocaleString("es-CL")}
          </Link>

          {/* Si hay sesión: nombre + cerrar sesión. Si no: iniciar sesión / crear cuenta */}
          {usuario ? (
            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted">Hola, {usuario.nombre}</span>
              {/* Solo los administradores ven el acceso al panel */}
              {usuario.rol === "admin" && (
                <Link to="/admin" className="btn btn-dark btn-sm">Panel admin</Link>
              )}
              <Button variant="outline-secondary" size="sm" onClick={salir}>
                Cerrar sesión
              </Button>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-primary btn-sm">Iniciar sesión</Link>
              <Link to="/registro" className="btn btn-primary btn-sm">Crear cuenta</Link>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
