// Pantalla de pago rechazado (/pago-error/:id): permite volver a intentar el pago de la misma orden.
import { useState } from "react";
import { Alert } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/atoms/Button";
import { ResumenOrden } from "../components/organisms/ResumenOrden";
import { useCarrito } from "../hooks/useCarrito";
import { actualizarOrden, obtenerOrdenPorId } from "../data/ordenes";
import { simularPago } from "../utils/simularPago";

export function PagoErrorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vaciar } = useCarrito();
  const [reintentoFallido, setReintentoFallido] = useState(false);
  const orden = obtenerOrdenPorId(id);

  if (!orden) {
    return (
      <Alert variant="warning">
        No encontramos una compra con ese número. <Link to="/productos">Ver productos</Link>
      </Alert>
    );
  }

  // Si la orden ya está pagada, no hay nada que reintentar
  if (orden.estado === "pagada") {
    return (
      <Alert variant="info">
        Esta compra ya fue pagada. <Link to={`/pago-correcto/${orden.id}`}>Ver boleta</Link>
      </Alert>
    );
  }

  const reintentarPago = () => {
    if (simularPago(Math.random())) {
      actualizarOrden(orden.id, { estado: "pagada" });
      vaciar();
      navigate(`/pago-correcto/${orden.id}`);
    } else {
      setReintentoFallido(true); // sigue rechazado: se avisa en pantalla
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: "800px" }}>
      <h1 className="h3 text-danger">✖ No se pudo realizar el pago. N° {orden.id}</h1>
      <p className="text-muted">Detalle de la compra</p>
      {reintentoFallido && <Alert variant="danger">El pago fue rechazado nuevamente. Intenta otra vez.</Alert>}
      <div className="mb-3">
        <Button variant="success" onClick={reintentarPago}>
          Volver a realizar el pago
        </Button>
      </div>
      <ResumenOrden orden={orden} />
    </div>
  );
}
