document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. ACTUALIZAR CONTADOR DEL NAVBAR
    // ==========================================
    function actualizarContadorCarrito() {
        const enlacesCarrito = document.querySelectorAll('a[href="carrito.html"]');
        let carritoActual = JSON.parse(localStorage.getItem("carritoSonidoVivo")) || [];
        let totalArticulos = carritoActual.reduce((suma, item) => suma + item.cantidad, 0);

        enlacesCarrito.forEach(enlace => {
            enlace.innerHTML = `🛒 Carrito (${totalArticulos})`;
        });
    }

    actualizarContadorCarrito();


   // ==========================================
    // 2. BOTONES "AÑADIR AL CARRITO" (productos.html)
    // ==========================================
    const botonesAgregar = document.querySelectorAll(".btn-agregar");

    botonesAgregar.forEach(boton => {
        // Usar onclick evita la duplicación si el script se carga más de una vez
        boton.onclick = function (e) {
            e.preventDefault();

            // Ubicar contenedor del producto
            const tarjeta = this.closest(".producto") || this.parentElement;

            // Extraer Nombre
            let nombre = "Instrumento Musical";
            const tituloElem = tarjeta.querySelector("h2, h3, h4, .titulo, .nombre-producto");
            if (tituloElem) {
                nombre = tituloElem.innerText.trim();
            }

            // Extraer Precio
            let precio = "$0";
            const elementosTexto = tarjeta.querySelectorAll("h2, h3, h4, p, span, strong, b");
            elementosTexto.forEach(el => {
                if (el.innerText.includes("$")) {
                    precio = el.innerText.trim();
                }
            });

            // Guardar en LocalStorage
            let carritoActual = JSON.parse(localStorage.getItem("carritoSonidoVivo")) || [];
            const indiceExistente = carritoActual.findIndex(p => p.nombre === nombre);

            if (indiceExistente !== -1) {
                carritoActual[indiceExistente].cantidad += 1;
            } else {
                carritoActual.push({
                    nombre: nombre,
                    precio: precio,
                    cantidad: 1
                });
            }

            localStorage.setItem("carritoSonidoVivo", JSON.stringify(carritoActual));

            actualizarContadorCarrito();
            alert(`¡Agregado con éxito!\n"${nombre}" se añadió al carrito.`);
        };
    });

    // ==========================================
    // 3. TABLA Y TOTAL EN CARRITO (carrito.html)
    // ==========================================
    const cuerpoCarrito = document.getElementById("cuerpo-carrito");
    const totalCarrito = document.getElementById("total-carrito");

    if (cuerpoCarrito && totalCarrito) {
        function renderizarCarrito() {
            let carritoActual = JSON.parse(localStorage.getItem("carritoSonidoVivo")) || [];
            cuerpoCarrito.innerHTML = "";
            let sumaTotal = 0;

            if (carritoActual.length === 0) {
                cuerpoCarrito.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">Tu carrito está vacío</td></tr>';
                totalCarrito.innerText = "$0";
                return;
            }

            carritoActual.forEach((producto, index) => {
                let precioLimpio = producto.precio.replace(/[^0-9]/g, '');
                let precioNumerico = parseInt(precioLimpio) || 0;
                let subtotal = precioNumerico * producto.cantidad;
                sumaTotal += subtotal;

                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${producto.nombre}</td>
                    <td>${producto.precio}</td>
                    <td>${producto.cantidad}</td>
                    <td>$${subtotal.toLocaleString('es-CL')}</td>
                    <td>
                        <button class="btn-eliminar-item" data-index="${index}" style="background:#e74c3c; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">
                            Eliminar
                        </button>
                    </td>
                `;
                cuerpoCarrito.appendChild(fila);
            });

            totalCarrito.innerText = "$" + sumaTotal.toLocaleString('es-CL');

            document.querySelectorAll(".btn-eliminar-item").forEach(boton => {
                boton.addEventListener("click", function() {
                    const indice = this.getAttribute("data-index");
                    carritoActual.splice(indice, 1);
                    localStorage.setItem("carritoSonidoVivo", JSON.stringify(carritoActual));
                    renderizarCarrito();
                    actualizarContadorCarrito();
                });
            });
        }

        renderizarCarrito();
    }


    // ==========================================
    // 4. INICIO DE SESIÓN
    // ==========================================
    const formLogin = document.getElementById("form-login");
    if (formLogin) {
        formLogin.addEventListener("submit", function (e) {
            e.preventDefault();
            const correo = document.getElementById("login-correo").value.trim().toLowerCase();
            const pass = document.getElementById("login-pass").value.trim();

            const dominiosValidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
            const esCorreoValido = dominiosValidos.some(dominio => correo.endsWith(dominio));

            if (!esCorreoValido) {
                alert("Error: Solo se permiten correos institucionales (@duoc.cl, @profesor.duoc.cl) o Gmail (@gmail.com).");
                return;
            }

            if (pass.length < 4 || pass.length > 10) {
                alert("Error: La contraseña debe tener entre 4 y 10 caracteres.");
                return;
            }

            if (correo.includes("admin") || correo.includes("profesor")) {
                alert("¡Bienvenido Administrador!");
                window.location.href = "admin-home.html";
            } else {
                alert("¡Inicio de sesión exitoso!");
                window.location.href = "index.html";
            }
        });
    }


    // ==========================================
    // 5. REGISTRO Y REGIONES / COMUNAS
    // ==========================================
    const formRegistro = document.getElementById("form-registro");
    if (formRegistro) {
        formRegistro.addEventListener("submit", function (e) {
            e.preventDefault();
            const run = document.getElementById("reg-run").value.trim();
            const correo = document.getElementById("correo").value.trim().toLowerCase();
            const pass = document.getElementById("reg-pass").value.trim();
            const passConfirm = document.getElementById("reg-pass-confirm").value.trim();

            const regexRun = /^[0-9]{7,8}[0-9kK]{1}$/;
            if (!regexRun.test(run)) {
                alert("Error: Ingrese el RUN sin puntos ni guion (Ejemplo: 19011022K).");
                return;
            }

            const dominiosValidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
            if (!dominiosValidos.some(dominio => correo.endsWith(dominio))) {
                alert("Error: Regístrate con un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
                return;
            }

            if (pass.length < 4 || pass.length > 10) {
                alert("Error: La contraseña debe tener entre 4 y 10 caracteres.");
                return;
            }

            if (pass !== passConfirm) {
                alert("Error: Las contraseñas no coinciden.");
                return;
            }

            alert("¡Registro completado con éxito!");
            window.location.href = "login.html";
        });
    }

    const selectRegion = document.getElementById("reg-region");
    const selectComuna = document.getElementById("reg-comuna");

    if (selectRegion && selectComuna) {
        const comunasPorRegion = {
            "valparaiso": ["Viña del Mar", "Valparaíso", "Quilpué", "Concón"],
            "metropolitana": ["Santiago", "Providencia", "Maipú", "Las Condes"],
            "biobio": ["Concepción", "Talcahuano", "Chillán"]
        };

        selectRegion.addEventListener("change", function () {
            const region = this.value;
            selectComuna.innerHTML = '<option value="">-- Selecciona primero una Región --</option>';

            if (comunasPorRegion[region]) {
                comunasPorRegion[region].forEach(comuna => {
                    const option = document.createElement("option");
                    option.value = comuna.toLowerCase().replace(/ /g, "-");
                    option.textContent = comuna;
                    selectComuna.appendChild(option);
                });
            }
        });
    }

});