import { useNavigate } from "react-router-dom";
import { Cart } from "../components/organisms/Cart";
import { useCarrito } from "../hooks/useCarrito";

export function CarritoPage() {
  // Todo el carrito viene del contexto compartido; esta página solo se lo pasa a <Cart />
  const { items, total, cambiarCantidad, quitar, vaciar } = useCarrito();
  const navigate = useNavigate();

  return (
    <>
      <h1 className="mb-3">Carrito de compras</h1>
      <Cart items={items} total={total} onChangeQty={cambiarCantidad} onRemove={quitar} onClear={vaciar} onBuy={() => navigate("/comprar")} />
    </>
  );
}
