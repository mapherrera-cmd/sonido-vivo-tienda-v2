// Boleta de una orden: datos del cliente, dirección de entrega, productos y total.
// Solo muestra datos (llegan por la prop "orden"); no guarda estado.
import { Card } from "react-bootstrap";
import { TablaResumenItems } from "../molecules/TablaResumenItems";
import { obtenerNombreRegion } from "../../data/regiones";

export function ResumenOrden({ orden }) {
  const { cliente, entrega } = orden;

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h2 className="h5">Datos del cliente</h2>
        <p>
          {cliente.nombre} {cliente.apellidos} — {cliente.correo}
        </p>

        <h2 className="h5">Dirección de entrega</h2>
        <p className="mb-1">
          {entrega.calle}
          {/* El departamento es opcional: solo se muestra si lo escribieron */}
          {entrega.departamento && `, Depto ${entrega.departamento}`}
        </p>
        <p className={entrega.indicaciones ? "mb-1" : ""}>
          {entrega.comuna}, {obtenerNombreRegion(entrega.region)}
        </p>
        {entrega.indicaciones && <p>Indicaciones: {entrega.indicaciones}</p>}

        <TablaResumenItems items={orden.items} total={orden.total} etiquetaTotal="Total" />
      </Card.Body>
    </Card>
  );
}
