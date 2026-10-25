import { Table, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button } from "../atoms/Button";

// Tabla del carrito de compras. No guarda datos: todo llega por props.
export function Cart({ items, total, onChangeQty, onRemove, onClear, onBuy }) {
  if (items.length === 0) {
    return (
      <div className="alert alert-secondary">
        Tu carrito está vacío. <Link to="/productos">Ver productos</Link>
      </div>
    );
  }

  return (
    <>
      <Table responsive hover className="align-middle bg-white shadow-sm">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <img src={item.img} alt={item.nombre} width="60" height="45" style={{ objectFit: "cover" }} />
              </td>
              <td>{item.nombre}</td>
              <td>${item.precio.toLocaleString("es-CL")}</td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <Button variant="outline-secondary" onClick={() => onChangeQty(item.id, item.cantidad - 1)}>-</Button>
                  {/* Cantidad editable: solo acepta números entre 1 y el stock */}
                  <Form.Control
                    type="number"
                    min={1}
                    max={item.stock}
                    value={item.cantidad}
                    aria-label={`Cantidad de ${item.nombre}`}
                    style={{ width: "70px" }}
                    onChange={(e) => {
                      const nueva = Number(e.target.value);
                      // Si el campo queda vacío o inválido, se ignora (no se borra el producto)
                      if (Number.isInteger(nueva) && nueva >= 1) onChangeQty(item.id, nueva);
                    }}
                  />
                  <Button variant="outline-secondary" onClick={() => onChangeQty(item.id, item.cantidad + 1)}>+</Button>
                </div>
              </td>
              <td>${(item.precio * item.cantidad).toLocaleString("es-CL")}</td>
              <td>
                <Button variant="danger" onClick={() => onRemove(item.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={4} className="text-end">Total</th>
            <th colSpan={2}>${total.toLocaleString("es-CL")}</th>
          </tr>
        </tfoot>
      </Table>
      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onClear}>Limpiar</Button>
        <Button variant="success" onClick={onBuy}>Comprar ahora</Button>
      </div>
    </>
  );
}
