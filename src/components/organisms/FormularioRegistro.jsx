// Formulario de registro. Valida los datos y avisa con onSubmit(datos); la página crea el usuario.
import { Alert, Form } from "react-bootstrap";
import { Button } from "../atoms/Button";
import { CampoFormulario } from "../molecules/CampoFormulario";
import { SelectorRegionComuna } from "../molecules/SelectorRegionComuna";
import { useFormulario } from "../../hooks/useFormulario";
import { hayErrores, validarRegistro } from "../../utils/validaciones";

const VALORES_INICIALES = {
  nombre: "",
  apellidos: "",
  run: "",
  correo: "",
  password: "",
  confirmar: "",
  region: "",
  comuna: "",
};

export function FormularioRegistro({ onSubmit, errorGeneral = "" }) {
  const { valores, errores, setErrores, manejarCambio, actualizarCampos } = useFormulario(VALORES_INICIALES);

  const enviar = (evento) => {
    evento.preventDefault();
    const erroresEncontrados = validarRegistro(valores);
    setErrores(erroresEncontrados);
    if (hayErrores(erroresEncontrados)) return;

    // Se entregan los datos ya "limpios" (sin espacios de más)
    onSubmit({
      nombre: valores.nombre.trim(),
      apellidos: valores.apellidos.trim(),
      run: valores.run.trim().toUpperCase(),
      correo: valores.correo.trim().toLowerCase(),
      password: valores.password.trim(),
      region: valores.region,
      comuna: valores.comuna,
    });
  };

  return (
    <Form onSubmit={enviar} noValidate>
      {errorGeneral && <Alert variant="danger">{errorGeneral}</Alert>}

      <CampoFormulario
        id="reg-nombre"
        etiqueta="Nombre"
        name="nombre"
        value={valores.nombre}
        onChange={manejarCambio}
        error={errores.nombre}
      />
      <CampoFormulario
        id="reg-apellidos"
        etiqueta="Apellidos"
        name="apellidos"
        value={valores.apellidos}
        onChange={manejarCambio}
        error={errores.apellidos}
      />
      <CampoFormulario
        id="reg-run"
        etiqueta="RUN (sin puntos ni guion)"
        name="run"
        placeholder="Ej: 19011022K"
        maxLength={9}
        value={valores.run}
        onChange={manejarCambio}
        error={errores.run}
      />
      <CampoFormulario
        id="reg-correo"
        etiqueta="Correo electrónico"
        tipo="email"
        name="correo"
        placeholder="ejemplo@gmail.com"
        value={valores.correo}
        onChange={manejarCambio}
        error={errores.correo}
      />
      <CampoFormulario
        id="reg-password"
        etiqueta="Contraseña"
        tipo="password"
        name="password"
        placeholder="4 a 10 caracteres"
        value={valores.password}
        onChange={manejarCambio}
        error={errores.password}
      />
      <CampoFormulario
        id="reg-confirmar"
        etiqueta="Confirmar contraseña"
        tipo="password"
        name="confirmar"
        placeholder="Repite tu contraseña"
        value={valores.confirmar}
        onChange={manejarCambio}
        error={errores.confirmar}
      />
      <SelectorRegionComuna
        region={valores.region}
        comuna={valores.comuna}
        onChange={actualizarCampos}
        errorRegion={errores.region}
        errorComuna={errores.comuna}
      />
      <Button type="submit" className="w-100">
        Crear cuenta
      </Button>
    </Form>
  );
}
