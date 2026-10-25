// Página de compra (/comprar): resumen del carrito + formulario de datos y dirección.
// Al pagar: simula el pago, guarda la orden y lleva a la pantalla de "pago correcto" o "pago con error".
import { Alert, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FormularioCheckout } from "../components/organisms/FormularioCheckout";
import { TablaResumenItems } from "../components/molecules/TablaResumenItems";
import { useCarrito } from "../hooks/useCarrito";
import { useSesion } from "../hooks/useSesion";
import { crearOrden } from "../data/ordenes";
import { simularPago } from "../utils/simularPago";

export function CheckoutPage() {
  const { items, total, vaciar } = useCarrito();
  const { usuario } = useSesion();
  const navigate = useNavigate();

  // Sin productos no hay nada que pagar
  if (items.length === 0) {
    return (
      <Alert variant="secondary">
        Tu carrito está vacío. <Link to="/productos">Ver productos</Link>
      </Alert>
    );
  }

  const pagar = (datos) => {
    const pagoAprobado = simularPago(Math.random());

    // La orden se guarda siempre (pagada o rechazada) con una copia de lo que se compró
    const orden = crearOrden({
      usuarioId: usuario ? usuario.id : null,
      cliente: { nombre: datos.nombre.trim(), apellidos: datos.apellidos.trim(), correo: datos.correo.trim().toLowerCase() },
      entrega: {
        calle: datos.calle.trim(),
        departamento: datos.departamento.trim(),
        region: datos.region,
        comuna: datos.comuna,
        indicaciones: datos.indicaciones.trim(),
      },
      items: items.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        img: item.img,
        precio: item.precio,
        cantidad: item.cantidad,
      })),
      total,
      estado: pagoAprobado ? "pagada" : "rechazada",
    });

    if (pagoAprobado) {
      vaciar(); // la compra se hizo: el carrito queda vacío
      navigate(`/pago-correcto/${orden.id}`);
    } else {
      navigate(`/pago-error/${orden.id}`); // el carrito se mantiene para reintentar
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: "800px" }}>
      <h1 className="mb-3">Finalizar compra</h1>
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h2 className="h5">Carrito de compra</h2>
          <TablaResumenItems items={items} total={total} etiquetaTotal="Total a pagar" />
        </Card.Body>
      </Card>
      <Card className="shadow-sm">
        <Card.Body>
          <FormularioCheckout usuario={usuario} total={total} onSubmit={pagar} />
        </Card.Body>
      </Card>
    </div>
  );
}
