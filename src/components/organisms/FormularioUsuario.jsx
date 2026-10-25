// Formulario para crear o editar un usuario desde el panel de administración.
// Props: valoresIniciales, esEdicion, rolBloqueado (true al editarse a uno mismo), textoBoton y onSubmit(datos).
// Al editar, el RUN no se puede cambiar y la contraseña es opcional (vacía = se mantiene la actual).
import { Col, Form, Row } from "react-bootstrap";
import { Button } from "../atoms/Button";
import { CampoFormulario } from "../molecules/CampoFormulario";
import { SelectorRegionComuna } from "../molecules/SelectorRegionComuna";
import { useFormulario } from "../../hooks/useFormulario";
import { ROLES } from "../../data/usuarios";
import { hayErrores, validarUsuarioAdmin } from "../../utils/validaciones";

export function FormularioUsuario({ valoresIniciales, esEdicion = false, rolBloqueado = false, textoBoton, onSubmit }) {
  const { valores, errores, setErrores, manejarCambio, actualizarCampos } = useFormulario(valoresIniciales);

  const enviar = (evento) => {
    evento.preventDefault();
    const erroresEncontrados = validarUsuarioAdmin(valores, esEdicion);
    setErrores(erroresEncontrados);
    if (hayErrores(erroresEncontrados)) return;

    onSubmit({
      run: valores.run.trim().toUpperCase(),
      nombre: valores.nombre.trim(),
      apellidos: valores.apellidos.trim(),
      correo: valores.correo.trim().toLowerCase(),
      password: valores.password.trim(), // puede venir vacía al editar
      rol: valores.rol,
      region: valores.region,
      comuna: valores.comuna,
      direccion: valores.direccion.trim(),
    });
  };

  return (
    <Form onSubmit={enviar} noValidate>
      <Row>
        <Col xs={12} md={6}>
          <CampoFormulario
            id="usr-run"
            etiqueta="RUN (sin puntos ni guion)"
            name="run"
            maxLength={9}
            placeholder="Ej: 19011022K"
            disabled={esEdicion}
            value={valores.run}
            onChange={manejarCambio}
            error={errores.run}
          />
        </Col>
        <Col xs={12} md={6}>
          <CampoFormulario
            id="usr-correo"
            etiqueta="Correo electrónico"
            tipo="email"
            name="correo"
            value={valores.correo}
            onChange={manejarCambio}
            error={errores.correo}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6}>
          <CampoFormulario
            id="usr-nombre"
            etiqueta="Nombre"
            name="nombre"
            maxLength={50}
            value={valores.nombre}
            onChange={manejarCambio}
            error={errores.nombre}
          />
        </Col>
        <Col xs={12} md={6}>
          <CampoFormulario
            id="usr-apellidos"
            etiqueta="Apellidos"
            name="apellidos"
            maxLength={100}
            value={valores.apellidos}
            onChange={manejarCambio}
            error={errores.apellidos}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6}>
          <CampoFormulario
            id="usr-password"
            etiqueta={esEdicion ? "Contraseña nueva" : "Contraseña"}
            tipo="password"
            obligatorio={!esEdicion}
            name="password"
            placeholder={esEdicion ? "Vacía = se mantiene la actual" : "4 a 10 caracteres"}
            value={valores.password}
            onChange={manejarCambio}
            error={errores.password}
          />
        </Col>
        <Col xs={12} md={6}>
          <CampoFormulario
            id="usr-rol"
            etiqueta="Rol"
            tipo="select"
            name="rol"
            textoVacio="-- Selecciona un rol --"
            opciones={ROLES.map((rol) => ({ valor: rol, texto: rol === "admin" ? "Administrador" : "Cliente" }))}
            disabled={rolBloqueado}
            value={valores.rol}
            onChange={manejarCambio}
            error={errores.rol}
          />
          {rolBloqueado && <p className="small text-muted">No puedes cambiar tu propio rol.</p>}
        </Col>
      </Row>
      <CampoFormulario
        id="usr-direccion"
        etiqueta="Dirección (calle y número)"
        name="direccion"
        maxLength={300}
        value={valores.direccion}
        onChange={manejarCambio}
        error={errores.direccion}
      />
      <SelectorRegionComuna
        region={valores.region}
        comuna={valores.comuna}
        onChange={actualizarCampos}
        errorRegion={errores.region}
        errorComuna={errores.comuna}
      />
      <Button type="submit">{textoBoton}</Button>
    </Form>
  );
}
