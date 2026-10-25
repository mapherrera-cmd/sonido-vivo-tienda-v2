// Plantilla común de todas las páginas públicas: menú arriba, contenido en medio, footer abajo.
// <Outlet /> es el lugar donde react-router pinta la página que corresponde a la URL.
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { NavBar } from "../organisms/NavBar";
import { Footer } from "../organisms/Footer";

export function MainLayout() {
  return (
    <>
      <NavBar />
      <Container as="main" className="mt-4 flex-grow-1">
        <Outlet />
      </Container>
      <Footer />
    </>
  );
}
