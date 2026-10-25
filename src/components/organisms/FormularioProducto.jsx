// Formulario para crear o editar un producto. Se usa en "Nuevo producto" y en "Editar producto".
// Props: valoresIniciales (vacíos o los del producto), categorias, textoBoton y onSubmit(datos).
// Valida antes de avisar con onSubmit; la página es quien guarda el producto.
import { Col, Form, Row } from "react-bootstrap";
import { Button } from "../atoms/Button";
import { CampoFormulario } from "../molecules/CampoFormulario";
import { useFormulario } from "../../hooks/useFormulario";
import { IMAGENES_DISPONIBLES } from "../../data/imagenes";
import { hayErrores, validarProducto } from "../../utils/validaciones";

export function FormularioProducto({ valoresIniciales, categorias, textoBoton, onSubmit }) {
  const { valores, errores, setErrores, manejarCambio, actualizarCampos } = useFormulario(valoresIniciales);

  const enviar = (evento) => {
    evento.preventDefault();
    const erroresEncontrados = validarProducto(valores);
    setErrores(erroresEncontrados);
    if (hayErrores(erroresEncontrados)) return;

    // Los inputs entregan texto: aquí se convierten a número antes de guardar
    onSubmit({
      nombre: valores.nombre.trim(),
      descripcion: valores.descripcion.trim(),
      precio: Number(valores.precio),
      stock: Number(valores.stock),
      categoria: valores.categoria,
      img: valores.img,
      oferta: valores.oferta,
      precioOferta: valores.oferta ? Number(valores.precioOferta) : 0,
    });
  };

  return (
    <Form onSubmit={enviar} noValidate>
      <CampoFormulario
        id="prod-nombre"
        etiqueta="Nombre del producto"
        name="nombre"
        maxLength={100}
        value={valores.nombre}
        onChange={manejarCambio}
        error={errores.nombre}
      />
      <CampoFormulario
        id="prod-descripcion"
        etiqueta="Descripción"
        tipo="textarea"
        obligatorio={false}
        name="descripcion"
        maxLength={500}
        value={valores.descripcion}
        onChange={manejarCambio}
        error={errores.descripcion}
      />
      <Row>
        {/* xs=12: una columna en el celular; md=4: tres columnas desde tablet */}
        <Col xs={12} md={4}>
          <CampoFormulario
            id="prod-precio"
            etiqueta="Precio ($)"
            tipo="number"
            name="precio"
            min={0}
            value={valores.precio}
            onChange={manejarCambio}
            error={errores.precio}
          />
        </Col>
        <Col xs={12} md={4}>
          <CampoFormulario
            id="prod-stock"
            etiqueta="Stock"
            tipo="number"
            name="stock"
            min={0}
            value={valores.stock}
            onChange={manejarCambio}
            error={errores.stock}
          />
        </Col>
        <Col xs={12} md={4}>
          <CampoFormulario
            id="prod-categoria"
            etiqueta="Categoría"
            tipo="select"
            name="categoria"
            textoVacio="-- Selecciona una categoría --"
            opciones={categorias.map((c) => ({ valor: c.id, texto: c.nombre }))}
            value={valores.categoria}
            onChange={manejarCambio}
            error={errores.categoria}
          />
        </Col>
      </Row>
      <Row className="align-items-end">
        <Col xs={12} md={6}>
          <CampoFormulario
            id="prod-img"
            etiqueta="Imagen"
            tipo="select"
            name="img"
            textoVacio="-- Sin imagen --"
            opciones={IMAGENES_DISPONIBLES}
            value={valores.img}
            onChange={manejarCambio}
          />
        </Col>
        <Col xs={12} md={6}>
          {/* Vista previa de la imagen elegida (solo se muestra si hay una) */}
          {valores.img && (
            <img src={valores.img} alt="Vista previa" height="80" className="mb-3 rounded border" style={{ objectFit: "cover" }} />
          )}
        </Col>
      </Row>

      <Form.Check
        type="switch"
        id="prod-oferta"
        label="Producto en oferta"
        className="mb-3"
        checked={valores.oferta}
        onChange={(e) => actualizarCampos({ oferta: e.target.checked })}
      />
      {/* El precio de oferta solo aparece si el producto está en oferta */}
      {valores.oferta && (
        <CampoFormulario
          id="prod-precio-oferta"
          etiqueta="Precio de oferta ($)"
          tipo="number"
          name="precioOferta"
          min={0}
          value={valores.precioOferta}
          onChange={manejarCambio}
          error={errores.precioOferta}
        />
      )}

      <Button type="submit">{textoBoton}</Button>
    </Form>
  );
}
