// ==========================================
// SESIÓN - SONIDO VIVO
// Incluir en TODAS las páginas, después de validaciones.js
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

    // El id "zona-login" debe estar en tu header, donde hoy tienes
    // el link a "Iniciar sesión" (ej: <div id="zona-login">...</div>)
    const zonaLogin = document.getElementById("zona-login");

    if (usuario && zonaLogin) {

        zonaLogin.innerHTML =
            "<span>Hola, " + usuario.correo + "</span> " +
            "<button onclick='cerrarSesion()'>Cerrar sesión</button>";

    }

});

function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
}