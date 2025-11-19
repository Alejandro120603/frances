/* --- script.js (VERSIÓN FINAL) --- */

// --- 1. NUESTRA BASE DE DATOS DE PRODUCTOS ---
const baseDeDatos = {
    mujer: {
        titulo: 'MUJER',
        productos: [
            { id: 1, nombre: 'Vestido de Lino', precio: '$49.99', img: 'https://via.placeholder.com/800x1200.png?text=Vestido+Lino', desc: 'Vestido confeccionado en tejido 100% lino. Cuello redondo y manga corta. Detalle de abertura en espalda.' },
            { id: 2, nombre: 'Camisa Básica', precio: '$29.99', img: 'https://via.placeholder.com/800x1200.png?text=Camisa+Basica', desc: 'Camisa básica de corte recto, 100% algodón. Cuello clásico y manga larga con puño abotonado.' },
            { id: 3, nombre: 'Jeans Slim Fit', precio: '$59.99', img: 'https://via.placeholder.com/800x1200.png?text=Jeans+Slim', desc: 'Pantalón vaquero de 5 bolsillos. Corte slim fit. Cierre de cremallera y botón.' },
            { id: 4, nombre: 'Abrigo de Lana', precio: '$129.99', img: 'https://via.placeholder.com/800x1200.png?text=Abrigo+Lana', desc: 'Abrigo de mezcla de lana con cuello solapa. Bolsillos delanteros y cierre de botones.' }
        ]
    },
    hombre: {
        titulo: 'HOMBRE',
        productos: [
            { id: 5, nombre: 'Camisa Oxford', precio: '$45.00', img: 'https://via.placeholder.com/800x1200.png?text=Camisa+Oxford', desc: 'Camisa de corte regular fit en tejido Oxford de algodón. Cuello con botones y manga larga.' },
            { id: 6, nombre: 'Pantalón Chino', precio: '$55.00', img: 'https://via.placeholder.com/800x1200.png?text=Pantalon+Chino', desc: 'Pantalón tipo chino de corte slim. Tejido elástico para mayor comodidad. Bolsillos laterales.' },
            { id: 7, nombre: 'Sudadera con Capucha', precio: '$65.00', img: 'https://via.placeholder.com/800x1200.png?text=Sudadera', desc: 'Sudadera con capucha y bolsillo canguro. Interior perchado suave. 100% algodón.' },
        ]
    },
    ninos: {
        titulo: 'NIÑOS',
        productos: [
            { id: 8, nombre: 'Conjunto de Algodón', precio: '$25.99', img: 'https://via.placeholder.com/800x1200.png?text=Conjunto+Niño', desc: 'Conjunto de camiseta y pantalón corto en punto de algodón suave. Estampado divertido.' },
            { id: 9, nombre: 'Chaqueta Acolchada', precio: '$39.99', img: 'https://via.placeholder.com/800x1200.png?text=Chaqueta+Niño', desc: 'Chaqueta acolchada ligera con capucha. Cierre de cremallera y bolsillos laterales.' }
        ]
    }
};

/**
 * Función auxiliar para buscar un producto por su ID en toda la base de datos.
 * @param {number} id - El ID del producto a buscar.
 * @returns {object|null} - El objeto del producto o null si no se encuentra.
 */
function encontrarProductoPorId(id) {
    let productoEncontrado = null;
    id = Number(id); // Asegurarse de que el ID es un número
    
    // Iterar sobre todas las categorías (mujer, hombre, ninos)
    for (const categoriaKey in baseDeDatos) {
        const categoria = baseDeDatos[categoriaKey];
        // Buscar el producto en la lista de productos de esa categoría
        const producto = categoria.productos.find(p => p.id === id);
        
        if (producto) {
            productoEncontrado = producto;
            break; // Detener la búsqueda una vez que se encuentra
        }
    }
    return productoEncontrado;
}


// Espera a que todo el contenido HTML esté cargado
document.addEventListener("DOMContentLoaded", function() {
    
    // ----- 1. FUNCIONALIDAD GLOBAL: ACTUALIZAR CONTADOR DE LA CESTA -----
    
    function actualizarContadorCesta() {
        const cesta = JSON.parse(localStorage.getItem('miTiendaCesta')) || [];
        let totalItems = 0;
        cesta.forEach(item => {
            totalItems += item.cantidad; 
        });

        const enlaceCesta = document.querySelector('.nav-icons a[href="cesta.html"]');
        if (enlaceCesta) {
            enlaceCesta.textContent = `CESTA (${totalItems})`;
        }
    }
    
    actualizarContadorCesta(); // Llamada inicial en todas las páginas

    
    // ----- 2. FUNCIONALIDAD: PÁGINA DE CATEGORÍA (DINÁMICA) -----
    
    const contenedorTitulo = document.getElementById('category-title-placeholder');
    const contenedorGrid = document.getElementById('category-grid-placeholder');

    if (contenedorTitulo && contenedorGrid) {
        
        // 1. Leer el parámetro de la URL
        const params = new URLSearchParams(window.location.search);
        const categoriaKey = params.get('cat') || 'mujer'; // 'mujer' por defecto

        // 2. Obtener los datos
        const datos = baseDeDatos[categoriaKey] || baseDeDatos.mujer;

        // 3. Actualizar el título
        contenedorTitulo.textContent = datos.titulo;
        document.title = `${datos.titulo} - Mi Marca`; // Actualiza el título de la pestaña

        // 4. Generar el HTML para la cuadrícula
        let gridHTML = ''; 
        datos.productos.forEach(producto => {
            gridHTML += `
                <a href="producto.html?id=${producto.id}" class="product-link">
                    <div class="product-item">
                        <img src="${producto.img}" alt="${producto.nombre}">
                        <div class="product-info">
                            <span>${producto.nombre}</span>
                            <span>${producto.precio}</span>
                        </div>
                    </div>
                </a>
            `;
        });
        
        // 5. Insertar el HTML generado
        contenedorGrid.innerHTML = gridHTML;
    }


    // ----- 3. FUNCIONALIDAD: PÁGINA DE PRODUCTO (DINÁMICA) -----

    const contenedorProducto = document.getElementById('product-detail-placeholder');

    if (contenedorProducto) {
        // 1. Leer el ID del producto de la URL
        const params = new URLSearchParams(window.location.search);
        const productoId = params.get('id');

        // 2. Encontrar el producto en nuestra "base de datos"
        const producto = encontrarProductoPorId(productoId);

        if (producto) {
            // 3. Si el producto existe, generar el HTML
            document.title = `${producto.nombre} - Mi Marca`; // Actualizar título de la pestaña

            const productoHTML = `
                <section class="product-images">
                    <img src="${producto.img}" alt="Vista frontal de ${producto.nombre}">
                    <img src="${producto.img.replace('?text=', '?text=Detalle+')}" alt="Detalle de ${producto.nombre}">
                </section>

                <aside class="product-info">
                    <div class="info-sticky">
                        <h1 data-nombre="${producto.nombre}">${producto.nombre}</h1>
                        <p class="product-price" data-precio="${producto.precio}">${producto.precio}</p>
                        
                        <p class="product-description">
                           ${producto.desc}
                        </p>

                        <div class="size-selector">
                            <span class="selector-title">TALLA:</span>
                            <div class="sizes">
                                <button class="size-option">XS</button>
                                <button class="size-option">S</button>
                                <button class="size-option">M</button>
                                <button class="size-option">L</button>
                                <button class="size-option">XL</button>
                            </div>
                        </div>

                        <button class="btn-add-to-cart" data-id="${producto.id}">AÑADIR A LA CESTA</button>

                        <div class="product-extra-info">
                            <a href="#">Composición y Cuidado</a>
                            <a href="#">Guía de Tallas</a>
                            <a href="#">Envío y Devoluciones</a>
                        </div>
                    </div>
                </aside>
            `;
            
            // 4. Insertar el HTML en el contenedor
            contenedorProducto.innerHTML = productoHTML;

            // 5. ¡IMPORTANTE! Añadir los event listeners AHORA que los botones existen
            
            // Lógica de selección de talla
            const botonesTalla = document.querySelectorAll('.size-option');
            botonesTalla.forEach(boton => {
                boton.addEventListener('click', () => {
                    botonesTalla.forEach(b => b.classList.remove('selected'));
                    boton.classList.add('selected');
                });
            });

            // Lógica de Añadir a la Cesta
            const btnAnadirCesta = document.querySelector('.btn-add-to-cart');
            btnAnadirCesta.addEventListener('click', () => {
                
                const tallaSeleccionada = document.querySelector('.size-option.selected');
                if (!tallaSeleccionada) {
                    alert('Por favor, selecciona una talla.');
                    return; 
                }
                const talla = tallaSeleccionada.textContent;

                // Obtenemos los datos del producto (que ya cargamos)
                const cesta = JSON.parse(localStorage.getItem('miTiendaCesta')) || [];

                // Buscamos si el item (mismo ID Y talla) ya existe
                const itemExistente = cesta.find(item => 
                    item.id === producto.id && item.talla === talla
                );

                if (itemExistente) {
                    itemExistente.cantidad += 1;
                    alert('Cantidad actualizada en la cesta.');
                } else {
                    // Creamos el objeto nuevo con cantidad 1
                    const productoParaCesta = {
                        id: producto.id, 
                        nombre: producto.nombre,
                        precio: producto.precio,
                        talla: talla,
                        imagen: producto.img,
                        cantidad: 1 
                    };
                    cesta.push(productoParaCesta);
                    alert('¡Producto añadido a la cesta!');
                }

                localStorage.setItem('miTiendaCesta', JSON.stringify(cesta));
                actualizarContadorCesta();
            });

        } else {
            // 3b. Si el producto NO existe
            contenedorProducto.innerHTML = '<h1>Producto no encontrado</h1><p>El producto que buscas no existe. <a href="index.html">Volver al inicio</a>.</p>';
        }
    }


    // ----- 4. FUNCIONALIDAD: PÁGINA DE CESTA (Mostrar, Eliminar, Actualizar Cant.) -----
    
    const contenedorItemsCesta = document.querySelector('.cart-items');
    
    if (contenedorItemsCesta) {
        
        function generarOpcionesCantidad(cantidadSeleccionada) {
            let opciones = '';
            for (let i = 1; i <= 10; i++) {
                opciones += `<option value="${i}" ${i === cantidadSeleccionada ? 'selected' : ''}>${i}</option>`;
            }
            return opciones;
        }

        function cargarItemsCesta() {
            const cesta = JSON.parse(localStorage.getItem('miTiendaCesta')) || [];
            contenedorItemsCesta.innerHTML = ''; 
            
            if (cesta.length === 0) {
                contenedorItemsCesta.innerHTML = '<p>Tu cesta está vacía.</p>';
            } else {
                cesta.forEach(item => {
                    const itemHTML = `
                        <div class="cart-item">
                            <div class="cart-item-img">
                                <img src="${item.imagen}" alt="${item.nombre}">
                            </div>
                            <div class="cart-item-details">
                                <h2>${item.nombre}</h2>
                                <p class="item-price">${item.precio}</p>
                                <p class="item-info">Talla: ${item.talla}</p>
                                <div class="item-quantity">
                                    <label for="qty-${item.id}">Cantidad:</label>
                                    <select class="item-quantity-select" data-id="${item.id}" data-talla="${item.talla}">
                                        ${generarOpcionesCantidad(item.cantidad)}
                                    </select>
                                </div>
                            </div>
                            <div class="cart-item-remove">
                                <button class="btn-eliminar-item" data-id="${item.id}" data-talla="${item.talla}">ELIMINAR</button>
                            </div>
                        </div>
                    `;
                    contenedorItemsCesta.innerHTML += itemHTML;
                });
            }
            
            anadirListenersEliminar();
            anadirListenersCantidad();
            actualizarResumenCesta(cesta);
        }

        function anadirListenersEliminar() {
            const botonesEliminar = document.querySelectorAll('.btn-eliminar-item');
            botonesEliminar.forEach(boton => {
                boton.addEventListener('click', (evento) => {
                    const id = Number(evento.target.dataset.id);
                    const talla = evento.target.dataset.talla;
                    eliminarItemDeCesta(id, talla);
                });
            });
        }

        function anadirListenersCantidad() {
            const selectoresCantidad = document.querySelectorAll('.item-quantity-select');
            selectoresCantidad.forEach(select => {
                select.addEventListener('change', (evento) => {
                    const id = Number(evento.target.dataset.id);
                    const talla = evento.target.dataset.talla;
                    const nuevaCantidad = Number(evento.target.value);
                    actualizarCantidadEnCesta(id, talla, nuevaCantidad);
                });
            });
        }
        
        function eliminarItemDeCesta(id, talla) {
            let cesta = JSON.parse(localStorage.getItem('miTiendaCesta')) || [];
            // Filtramos el item que coincida en ID y TALLA
            cesta = cesta.filter(item => !(item.id === id && item.talla === talla));
            localStorage.setItem('miTiendaCesta', JSON.stringify(cesta));
            cargarItemsCesta();
            actualizarContadorCesta();
        }

        function actualizarCantidadEnCesta(id, talla, nuevaCantidad) {
            let cesta = JSON.parse(localStorage.getItem('miTiendaCesta')) || [];
            const itemActualizar = cesta.find(item => item.id === id && item.talla === talla);
            if (itemActualizar) {
                itemActualizar.cantidad = nuevaCantidad;
            }
            localStorage.setItem('miTiendaCesta', JSON.stringify(cesta));
            actualizarResumenCesta(cesta);
            actualizarContadorCesta();
        }

        function actualizarResumenCesta(cesta) {
            let subtotal = 0;
            cesta.forEach(item => {
                let precio = parseFloat(item.precio.replace('$', ''));
                subtotal += precio * item.cantidad; 
            });

            const envio = (subtotal > 0) ? 3.95 : 0; // Envío gratis si la cesta está vacía
            const total = subtotal + envio;
            
            document.getElementById('summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('summary-envio').textContent = `$${envio.toFixed(2)}`;
            document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;
        }
        
        cargarItemsCesta();
    }


    // ----- 5. FUNCIONALIDAD: PÁGINA DE CHECKOUT (Validación) -----
    
    const formularioPago = document.getElementById('payment-form');
    
    if (formularioPago) {
        
        function cargarResumenCheckout() {
            const cesta = JSON.parse(localStorage.getItem('miTiendaCesta')) || [];
            let subtotal = 0;
            cesta.forEach(item => {
                let precio = parseFloat(item.precio.replace('$', ''));
                subtotal += precio * item.cantidad;
            });
            
            const envio = (subtotal > 0) ? 3.95 : 0;
            const total = subtotal + envio;

            document.getElementById('summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('summary-envio').textContent = `$${envio.toFixed(2)}`;
            document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;

            // Redirigir si la cesta está vacía
            if (cesta.length === 0) {
                alert("Tu cesta está vacía. Serás redirigido al inicio.");
                window.location.href = 'index.html';
            }
        }
        
        formularioPago.addEventListener('submit', (evento) => {
            evento.preventDefault(); 
            let esValido = true;
            const inputsRequeridos = formularioPago.querySelectorAll('input[required]');
            
            inputsRequeridos.forEach(input => {
                if (input.value.trim() === '') {
                    esValido = false;
                    input.classList.add('error'); 
                } else {
                    input.classList.remove('error'); 
                }
            });
            
            if (esValido) {
                alert('¡Pedido realizado con éxito!');
                localStorage.removeItem('miTiendaCesta');
                window.location.href = 'index.html';
            } else {
                alert('Por favor, completa todos los campos marcados en rojo.');
            }
        });
        
        cargarResumenCheckout();
    }
});