import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <span>Sonido Vivo - Viña del Mar</span>
        <div className="d-flex gap-3">
          <Link to="/nosotros" className="link-light">Nosotros</Link>
          <Link to="/blogs" className="link-light">Blogs</Link>
          <Link to="/contacto" className="link-light">Contacto</Link>
        </div>
      </Container>
    </footer>
  );
}
