// Reglas de validación de los formularios.
// Son las mismas reglas del sitio antiguo (legacy/validaciones.js), ahora como funciones pequeñas.
// Cada función devuelve un texto con el error, o "" (vacío) si el valor está bien.

export const DOMINIOS_VALIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

export function validarCorreo(correo) {
  const texto = correo.trim().toLowerCase();
  if (texto === "") return "Ingresa tu correo electrónico.";
  if (!DOMINIOS_VALIDOS.some((dominio) => texto.endsWith(dominio))) {
    return "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
  }
  return "";
}

// La contraseña debe tener entre 4 y 10 caracteres
export function validarPassword(password) {
  const texto = password.trim();
  if (texto === "") return "Ingresa tu contraseña.";
  if (texto.length < 4 || texto.length > 10) return "La contraseña debe tener entre 4 y 10 caracteres.";
  return "";
}

export function validarConfirmacion(password, confirmacion) {
  if (confirmacion.trim() === "") return "Repite tu contraseña.";
  if (password.trim() !== confirmacion.trim()) return "Las contraseñas no coinciden.";
  return "";
}

// RUN sin puntos ni guion: 7 u 8 números y un dígito verificador (número o K)
export function validarRun(run) {
  const regexRun = /^[0-9]{7,8}[0-9kK]{1}$/;
  if (!regexRun.test(run.trim())) return "Ingresa el RUN sin puntos ni guion (ejemplo: 19011022K).";
  return "";
}

// Campo que no puede quedar vacío
export function validarObligatorio(valor, mensaje) {
  return valor.trim() === "" ? mensaje : "";
}

// Indica si el objeto de errores tiene al menos un error
export function hayErrores(errores) {
  return Object.keys(errores).length > 0;
}

// Agrega el error al objeto solo si hay uno (así "errores" queda vacío cuando todo está bien)
function agregarSiHayError(errores, campo, mensaje) {
  if (mensaje !== "") errores[campo] = mensaje;
}

// ---- Validación completa de cada formulario: devuelve { campo: "mensaje" } ----

export function validarLogin({ correo, password }) {
  const errores = {};
  agregarSiHayError(errores, "correo", validarCorreo(correo));
  agregarSiHayError(errores, "password", validarPassword(password));
  return errores;
}

export function validarRegistro({ nombre, apellidos, run, correo, password, confirmar, region, comuna }) {
  const errores = {};
  agregarSiHayError(errores, "nombre", validarObligatorio(nombre, "Ingresa tu nombre."));
  agregarSiHayError(errores, "apellidos", validarObligatorio(apellidos, "Ingresa tus apellidos."));
  agregarSiHayError(errores, "run", validarRun(run));
  agregarSiHayError(errores, "correo", validarCorreo(correo));
  agregarSiHayError(errores, "password", validarPassword(password));
  agregarSiHayError(errores, "confirmar", validarConfirmacion(password, confirmar));
  agregarSiHayError(errores, "region", validarObligatorio(region, "Selecciona una región."));
  agregarSiHayError(errores, "comuna", validarObligatorio(comuna, "Selecciona una comuna."));
  return errores;
}

export function validarCheckout({ nombre, apellidos, correo, calle, region, comuna }) {
  const errores = {};
  agregarSiHayError(errores, "nombre", validarObligatorio(nombre, "Ingresa tu nombre."));
  agregarSiHayError(errores, "apellidos", validarObligatorio(apellidos, "Ingresa tus apellidos."));
  agregarSiHayError(errores, "correo", validarCorreo(correo));
  agregarSiHayError(errores, "calle", validarObligatorio(calle, "Ingresa la calle y el número."));
  agregarSiHayError(errores, "region", validarObligatorio(region, "Selecciona una región."));
  agregarSiHayError(errores, "comuna", validarObligatorio(comuna, "Selecciona una comuna."));
  return errores;
}

// ---- Validaciones del panel de administración ----
// Los límites de largo son los del admin antiguo (legacy/admin-nuevo-producto.html y admin-nuevo-usuario.html).
// Los valores de los inputs llegan como texto, por eso aquí se convierten a número para revisarlos.

// Número entero mayor o igual a 0 (para precio y stock). Devuelve el error o "".
function validarEnteroPositivo(valor, mensaje) {
  const texto = String(valor).trim();
  if (!/^[0-9]+$/.test(texto)) return mensaje;
  return "";
}

export function validarProducto({ nombre, descripcion, precio, stock, categoria, oferta, precioOferta }) {
  const errores = {};
  agregarSiHayError(errores, "nombre", validarObligatorio(nombre, "Ingresa el nombre del producto."));
  if (nombre.trim().length > 100) errores.nombre = "El nombre puede tener como máximo 100 caracteres.";
  if (descripcion.trim().length > 500) errores.descripcion = "La descripción puede tener como máximo 500 caracteres.";
  agregarSiHayError(errores, "precio", validarEnteroPositivo(precio, "Ingresa un precio válido (número entero, 0 o más)."));
  agregarSiHayError(errores, "stock", validarEnteroPositivo(stock, "Ingresa un stock válido (número entero, 0 o más)."));
  agregarSiHayError(errores, "categoria", validarObligatorio(categoria, "Selecciona una categoría."));

  // El precio de oferta solo se revisa si el producto está en oferta: debe ser menor al precio normal
  if (oferta) {
    const errorOferta = validarEnteroPositivo(precioOferta, "Ingresa un precio de oferta válido.");
    if (errorOferta !== "") {
      errores.precioOferta = errorOferta;
    } else if (!errores.precio && Number(precioOferta) >= Number(precio)) {
      errores.precioOferta = "El precio de oferta debe ser menor al precio normal.";
    }
  }
  return errores;
}

export function validarCategoria({ nombre }) {
  const errores = {};
  agregarSiHayError(errores, "nombre", validarObligatorio(nombre, "Ingresa el nombre de la categoría."));
  return errores;
}

// "esEdicion" = true cuando se edita un usuario: ahí la contraseña es opcional (vacía = no cambiarla)
export function validarUsuarioAdmin({ run, nombre, apellidos, correo, password, rol, direccion, region, comuna }, esEdicion = false) {
  const errores = {};
  agregarSiHayError(errores, "run", validarRun(run));
  agregarSiHayError(errores, "nombre", validarObligatorio(nombre, "Ingresa el nombre."));
  if (nombre.trim().length > 50) errores.nombre = "El nombre puede tener como máximo 50 caracteres.";
  agregarSiHayError(errores, "apellidos", validarObligatorio(apellidos, "Ingresa los apellidos."));
  if (apellidos.trim().length > 100) errores.apellidos = "Los apellidos pueden tener como máximo 100 caracteres.";
  agregarSiHayError(errores, "correo", validarCorreo(correo));
  agregarSiHayError(errores, "rol", validarObligatorio(rol, "Selecciona un rol."));
  agregarSiHayError(errores, "direccion", validarObligatorio(direccion, "Ingresa la dirección."));
  if (direccion.trim().length > 300) errores.direccion = "La dirección puede tener como máximo 300 caracteres.";
  agregarSiHayError(errores, "region", validarObligatorio(region, "Selecciona una región."));
  agregarSiHayError(errores, "comuna", validarObligatorio(comuna, "Selecciona una comuna."));

  // Al editar, la contraseña solo se revisa si escribieron una nueva
  if (!esEdicion || password.trim() !== "") {
    agregarSiHayError(errores, "password", validarPassword(password));
  }
  return errores;
}

// Formulario de perfil: nombre, apellidos y (opcional) contraseña nueva
export function validarPerfil({ nombre, apellidos, password }) {
  const errores = {};
  agregarSiHayError(errores, "nombre", validarObligatorio(nombre, "Ingresa tu nombre."));
  agregarSiHayError(errores, "apellidos", validarObligatorio(apellidos, "Ingresa tus apellidos."));
  if (password.trim() !== "") {
    agregarSiHayError(errores, "password", validarPassword(password));
  }
  return errores;
}
