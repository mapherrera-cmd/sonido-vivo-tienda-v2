// Tabla de solo lectura con los productos de una compra (imagen, nombre, precio, cantidad, subtotal).
// La usan el checkout (carrito) y la boleta (orden), por eso solo recibe "items" y "total".
import { Table } from "react-bootstrap";

export function TablaResumenItems({ items, total, etiquetaTotal = "Total" }) {
  return (
    <Table responsive className="align-middle bg-white">
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Subtotal</th>
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
            <td>{item.cantidad}</td>
            <td>${(item.precio * item.cantidad).toLocaleString("es-CL")}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th colSpan={4} className="text-end">
            {etiquetaTotal}
          </th>
          <th>${total.toLocaleString("es-CL")}</th>
        </tr>
      </tfoot>
    </Table>
  );
}
