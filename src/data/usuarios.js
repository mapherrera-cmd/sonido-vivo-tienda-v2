// "Base de datos" simulada de usuarios, con CRUD guardado en localStorage.
// OJO: las contraseñas se guardan en texto plano solo porque esto es una simulación
// sin backend. En un sistema real nunca se hace así (se guardan encriptadas en el servidor).
import { generarId, guardarLista, leerLista } from "./almacenamiento";

const CLAVE_USUARIOS = "sv_usuarios";

// Roles posibles de un usuario
export const ROLES = ["admin", "cliente"];

// Usuarios iniciales (los del admin HTML antiguo).
// region, comuna y direccion se usarán para autocompletar el checkout.
export const USUARIOS_INICIALES = [
  {
    id: "U001",
    run: "19011022K",
    nombre: "Max",
    apellidos: "Herrera",
    correo: "max@duoc.cl",
    password: "admin123",
    rol: "admin",
    region: "",
    comuna: "",
    direccion: "",
  },
  {
    id: "U002",
    run: "201234567",
    nombre: "Javiera",
    apellidos: "Sanches",
    correo: "javi@gmail.com",
    password: "cliente123",
    rol: "cliente",
    region: "",
    comuna: "",
    direccion: "",
  },
];

// READ: todos los usuarios
export function obtenerUsuarios() {
  return leerLista(CLAVE_USUARIOS, USUARIOS_INICIALES);
}

// READ: un usuario por su id (o null si no existe)
export function obtenerUsuarioPorId(id) {
  return obtenerUsuarios().find((usuario) => usuario.id === id) || null;
}

// READ: un usuario por su correo (lo usará el login). Devuelve null si no existe
export function obtenerUsuarioPorCorreo(correo) {
  const buscado = correo.trim().toLowerCase();
  return obtenerUsuarios().find((usuario) => usuario.correo.toLowerCase() === buscado) || null;
}

// CREATE: agrega un usuario nuevo y lo devuelve con su id.
// Devuelve null si ya existe un usuario con ese correo.
export function crearUsuario(datos) {
  if (obtenerUsuarioPorCorreo(datos.correo)) return null;

  const usuarios = obtenerUsuarios();
  const nuevo = {
    apellidos: "",
    rol: "cliente",
    region: "",
    comuna: "",
    direccion: "",
    ...datos,
    id: generarId(usuarios, "U"),
  };
  guardarLista(CLAVE_USUARIOS, [...usuarios, nuevo]);
  return nuevo;
}

// UPDATE: cambia los campos indicados. Devuelve el usuario actualizado (o null si no existe)
export function actualizarUsuario(id, cambios) {
  const usuarios = obtenerUsuarios();
  if (!usuarios.some((usuario) => usuario.id === id)) return null;

  const actualizados = usuarios.map((usuario) =>
    usuario.id === id ? { ...usuario, ...cambios, id } : usuario
  );
  guardarLista(CLAVE_USUARIOS, actualizados);
  return actualizados.find((usuario) => usuario.id === id);
}

// DELETE: borra un usuario. Devuelve true si se borró, false si no existía
export function eliminarUsuario(id) {
  const usuarios = obtenerUsuarios();
  const restantes = usuarios.filter((usuario) => usuario.id !== id);
  if (restantes.length === usuarios.length) return false;

  guardarLista(CLAVE_USUARIOS, restantes);
  return true;
}
