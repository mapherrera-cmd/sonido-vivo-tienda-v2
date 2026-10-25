// Dashboard (/admin): tarjetas con totales leídos de los datos reales y accesos rápidos a cada sección.
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { TarjetaResumen } from "../../components/molecules/TarjetaResumen";
import { obtenerCategorias } from "../../data/categorias";
import { obtenerOrdenes } from "../../data/ordenes";
import { obtenerProductos } from "../../data/productos";
import { obtenerUsuarios } from "../../data/usuarios";
import { calcularVentasTotales, filtrarOrdenesPagadas, obtenerProductosCriticos } from "../../utils/reportes";

// Accesos rápidos del dashboard
const ACCESOS = [
  { ruta: "/admin/ordenes", titulo: "Órdenes", texto: "Revisa las compras realizadas y sus boletas." },
  { ruta: "/admin/productos", titulo: "Productos", texto: "Administra el inventario y los precios." },
  { ruta: "/admin/categorias", titulo: "Categorías", texto: "Organiza los productos por categoría." },
  { ruta: "/admin/usuarios", titulo: "Usuarios", texto: "Gestiona las cuentas y su historial de compras." },
  { ruta: "/admin/reportes", titulo: "Reportes", texto: "Ventas totales y productos más vendidos." },
  { ruta: "/admin/perfil", titulo: "Perfil", texto: "Cambia tus datos y tu contraseña." },
  { ruta: "/", titulo: "Tienda", texto: "Ve la tienda como la ven los clientes." },
];

export function AdminDashboardPage() {
  // Se leen los datos reales cada vez que se abre el dashboard
  const ordenes = obtenerOrdenes();
  const productos = obtenerProductos();
  const usuarios = obtenerUsuarios();
  const categorias = obtenerCategorias();
  const criticos = obtenerProductosCriticos(productos);

  return (
    <>
      <h1 className="h3">Dashboard</h1>
      <p className="text-muted">Resumen de la tienda.</p>

      {/* xs=12: una tarjeta por fila en celular; md=6: dos; xl=3: cuatro en pantalla grande */}
      <Row className="g-3 mb-4">
        <Col xs={12} md={6} xl={3}>
          <TarjetaResumen
            titulo="Ventas"
            valor={`$${calcularVentasTotales(ordenes).toLocaleString("es-CL")}`}
            detalle={`${filtrarOrdenesPagadas(ordenes).length} de ${ordenes.length} órdenes pagadas`}
            color="primary"
          />
        </Col>
        <Col xs={12} md={6} xl={3}>
          <TarjetaResumen
            titulo="Productos"
            valor={productos.length}
            detalle={`${categorias.length} categorías`}
            color="success"
          />
        </Col>
        <Col xs={12} md={6} xl={3}>
          <TarjetaResumen
            titulo="Productos críticos"
            valor={criticos.length}
            detalle="Con stock de 5 unidades o menos"
            color={criticos.length > 0 ? "danger" : "secondary"}
          />
        </Col>
        <Col xs={12} md={6} xl={3}>
          <TarjetaResumen titulo="Usuarios" valor={usuarios.length} detalle="Cuentas registradas" color="warning" />
        </Col>
      </Row>

      <Row className="g-3">
        {ACCESOS.map((acceso) => (
          <Col key={acceso.ruta} xs={12} sm={6} xl={3}>
            <Card as={Link} to={acceso.ruta} className="h-100 text-decoration-none shadow-sm tarjeta-categoria">
              <Card.Body>
                <Card.Title className="h6">{acceso.titulo}</Card.Title>
                <Card.Text className="small text-muted mb-0">{acceso.texto}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
