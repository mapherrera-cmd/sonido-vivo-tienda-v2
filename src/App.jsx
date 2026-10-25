// Aquí se definen todas las rutas (URLs) de la tienda y qué página muestra cada una.
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/templates/MainLayout";
import { HomePage } from "./pages/HomePage";
import { ProductosPage } from "./pages/ProductosPage";
import { DetalleProductoPage } from "./pages/DetalleProductoPage";
import { CategoriasPage } from "./pages/CategoriasPage";
import { OfertasPage } from "./pages/OfertasPage";
import { NosotrosPage } from "./pages/NosotrosPage";
import { BlogsPage } from "./pages/BlogsPage";
import { BlogDetallePage } from "./pages/BlogDetallePage";
import { ContactoPage } from "./pages/ContactoPage";
import { LoginPage } from "./pages/LoginPage";
import { RegistroPage } from "./pages/RegistroPage";
import { CarritoPage } from "./pages/CarritoPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { PagoCorrectoPage } from "./pages/PagoCorrectoPage";
import { PagoErrorPage } from "./pages/PagoErrorPage";
import { RutaAdmin } from "./components/templates/RutaAdmin";
import { AdminLayout } from "./components/templates/AdminLayout";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminOrdenesPage } from "./pages/admin/AdminOrdenesPage";
import { AdminBoletaPage } from "./pages/admin/AdminBoletaPage";
import { AdminProductosPage } from "./pages/admin/AdminProductosPage";
import { AdminProductosCriticosPage } from "./pages/admin/AdminProductosCriticosPage";
import { AdminProductoFormPage } from "./pages/admin/AdminProductoFormPage";
import { AdminCategoriasPage } from "./pages/admin/AdminCategoriasPage";
import { AdminCategoriaFormPage } from "./pages/admin/AdminCategoriaFormPage";
import { AdminUsuariosPage } from "./pages/admin/AdminUsuariosPage";
import { AdminUsuarioFormPage } from "./pages/admin/AdminUsuarioFormPage";
import { AdminHistorialComprasPage } from "./pages/admin/AdminHistorialComprasPage";
import { AdminReportesPage } from "./pages/admin/AdminReportesPage";
import { AdminPerfilPage } from "./pages/admin/AdminPerfilPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      {/* Todas estas páginas comparten el mismo menú y footer (MainLayout) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/productos/:id" element={<DetalleProductoPage />} />
        <Route path="/categorias" element={<CategoriasPage />} />
        <Route path="/categorias/:id" element={<CategoriasPage />} />
        <Route path="/ofertas" element={<OfertasPage />} />
        <Route path="/nosotros" element={<NosotrosPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:id" element={<BlogDetallePage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/carrito" element={<CarritoPage />} />
        <Route path="/comprar" element={<CheckoutPage />} />
        <Route path="/pago-correcto/:id" element={<PagoCorrectoPage />} />
        <Route path="/pago-error/:id" element={<PagoErrorPage />} />
        {/* "*" atrapa cualquier URL que no exista */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Panel de administración: RutaAdmin deja pasar solo al rol admin y AdminLayout pone el sidebar */}
      <Route element={<RutaAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/ordenes" element={<AdminOrdenesPage />} />
          <Route path="/admin/ordenes/:id" element={<AdminBoletaPage />} />
          <Route path="/admin/productos" element={<AdminProductosPage />} />
          <Route path="/admin/productos/nuevo" element={<AdminProductoFormPage />} />
          <Route path="/admin/productos/criticos" element={<AdminProductosCriticosPage />} />
          <Route path="/admin/productos/:id/editar" element={<AdminProductoFormPage />} />
          <Route path="/admin/categorias" element={<AdminCategoriasPage />} />
          <Route path="/admin/categorias/nueva" element={<AdminCategoriaFormPage />} />
          <Route path="/admin/categorias/:id/editar" element={<AdminCategoriaFormPage />} />
          <Route path="/admin/usuarios" element={<AdminUsuariosPage />} />
          <Route path="/admin/usuarios/nuevo" element={<AdminUsuarioFormPage />} />
          <Route path="/admin/usuarios/:id/editar" element={<AdminUsuarioFormPage />} />
          <Route path="/admin/usuarios/:id/historial" element={<AdminHistorialComprasPage />} />
          <Route path="/admin/reportes" element={<AdminReportesPage />} />
          <Route path="/admin/perfil" element={<AdminPerfilPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
