import { Row, Col, Form } from "react-bootstrap";

// Barra de filtros: búsqueda por texto, categoría y orden por precio.
// No guarda datos: recibe los valores actuales y avisa los cambios con onCambio(nombre, valor).
export function FiltrosProductos({ buscar, categoria, orden, categorias, onCambio }) {
  return (
    <Row className="g-3 mb-4">
      <Col xs={12} md={6}>
        <Form.Control
          type="search"
          placeholder="Buscar por nombre o descripción"
          aria-label="Buscar productos"
          value={buscar}
          onChange={(e) => onCambio("buscar", e.target.value)}
        />
      </Col>
      <Col xs={6} md={3}>
        <Form.Select
          aria-label="Filtrar por categoría"
          value={categoria}
          onChange={(e) => onCambio("categoria", e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </Form.Select>
      </Col>
      <Col xs={6} md={3}>
        <Form.Select aria-label="Ordenar por precio" value={orden} onChange={(e) => onCambio("orden", e.target.value)}>
          <option value="">Orden original</option>
          <option value="menor">Precio: menor a mayor</option>
          <option value="mayor">Precio: mayor a menor</option>
        </Form.Select>
      </Col>
    </Row>
  );
}
