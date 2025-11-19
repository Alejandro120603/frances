/* --- script.js (VERSIÓN FINAL) --- */

// --- 1. NUESTRA BASE DE DATOS DE PRODUCTOS ---
const baseDeDatos = {
    mujer: {
        titulo: 'FEMME',
        productos: [
            { id: 1, nombre: 'Robe noire', precio: '$49.99', img: 'images/vestido_negro_mujer.png', desc: 'Robe confectionnée en tissu 100 % lin. Col rond, manches courtes et découpe dans le dos.' },
            { id: 2, nombre: 'Chemise blanche', precio: '$29.99', img: 'images/camisa_blanca_mujer.png', desc: 'Chemise basique coupe droite, 100 % coton. Col classique et manches longues avec poignets boutonnés.' },
            { id: 3, nombre: 'Jean bleu', precio: '$59.99', img: 'images/jeans_azules_mujer.png', desc: 'Jean cinq poches coupe slim fit. Fermeture éclair et bouton.' },
            { id: 4, nombre: 'Manteau pour femme', precio: '$129.99', img: 'images/abrigo_mujer.png', desc: 'Manteau en mélange de laine avec col à revers. Poches avant et fermeture à boutons.' }
        ]
    },
    hombre: {
        titulo: 'HOMME',
        productos: [
            { id: 5, nombre: 'Chemise rose', precio: '$45.00', img: 'images/camisa-rosa-hombre.png', desc: 'Chemise coupe regular fit en tissu Oxford de coton. Col boutonné et manches longues.' },
            { id: 6, nombre: 'Pantalon marron', precio: '$55.00', img: 'images/pantalon-marron-hombre.png', desc: 'Pantalon chino coupe slim. Tissu stretch pour plus de confort. Poches latérales.' },
            { id: 7, nombre: 'Sweat gris', precio: '$65.00', img: 'images/sudadera-gris-hombre.png', desc: 'Sweat à capuche avec poche kangourou. Intérieur doux gratté. 100 % coton.' },
        ]
    },
    ninos: {
        titulo: 'ENFANTS',
        productos: [
            { id: 8, nombre: 'Pantalon enfant', precio: '$25.99', img: 'images/pants-niño.png', desc: 'Ensemble t-shirt et short en jersey de coton doux. Imprimé ludique.' },
            { id: 9, nombre: 'Veste enfant', precio: '$39.99', img: 'images/chaqueta-niño.png', desc: 'Veste matelassée légère avec capuche. Fermeture éclair et poches latérales.' }
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
            enlaceCesta.textContent = `PANIER (${totalItems})`;
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
        document.title = `${datos.titulo} - Ma Marque`; // Actualiza el título de la pestaña

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
            document.title = `${producto.nombre} - Ma Marque`; // Actualizar título de la pestaña

            const productoHTML = `
                <section class="product-images">
                    <img src="${producto.img}" alt="Vue de face de ${producto.nombre}">
                    <img src="${producto.img.replace('?text=', '?text=Detail+')}" alt="Détail de ${producto.nombre}">
                </section>

                <aside class="product-info">
                    <div class="info-sticky">
                        <h1 data-nombre="${producto.nombre}">${producto.nombre}</h1>
                        <p class="product-price" data-precio="${producto.precio}">${producto.precio}</p>
                        
                        <p class="product-description">
                           ${producto.desc}
                        </p>

                        <div class="size-selector">
                            <span class="selector-title">TAILLE :</span>
                            <div class="sizes">
                                <button class="size-option">XS</button>
                                <button class="size-option">S</button>
                                <button class="size-option">M</button>
                                <button class="size-option">L</button>
                                <button class="size-option">XL</button>
                            </div>
                        </div>

                            <button class="btn-add-to-cart" data-id="${producto.id}">AJOUTER AU PANIER</button>

                        <div class="product-extra-info">
                            <a href="#">Composition et entretien</a>
                            <a href="#">Guide des tailles</a>
                            <a href="#">Livraison et retours</a>
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
                    alert('Veuillez sélectionner une taille.');
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
                    alert('La quantité a été mise à jour dans le panier.');
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
                    alert('Produit ajouté au panier !');
                }

                localStorage.setItem('miTiendaCesta', JSON.stringify(cesta));
                actualizarContadorCesta();
            });

        } else {
            // 3b. Si el producto NO existe
            contenedorProducto.innerHTML = '<h1>Produit introuvable</h1><p>Le produit que vous recherchez n’existe pas. <a href="index.html">Retour à l’accueil</a>.</p>';
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
                contenedorItemsCesta.innerHTML = '<p>Votre panier est vide.</p>';
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
                                <p class="item-info">Taille : ${item.talla}</p>
                                <div class="item-quantity">
                                    <label for="qty-${item.id}">Quantité :</label>
                                    <select class="item-quantity-select" data-id="${item.id}" data-talla="${item.talla}">
                                        ${generarOpcionesCantidad(item.cantidad)}
                                    </select>
                                </div>
                            </div>
                            <div class="cart-item-remove">
                                <button class="btn-eliminar-item" data-id="${item.id}" data-talla="${item.talla}">SUPPRIMER</button>
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

            const envio = (subtotal > 0) ? 3.95 : 0; // Livraison gratuite si le panier est vide
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
                alert('Votre panier est vide. Vous allez être redirigé vers l’accueil.');
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
                alert('Commande passée avec succès !');
                localStorage.removeItem('miTiendaCesta');
                window.location.href = 'index.html';
            } else {
                alert('Veuillez remplir tous les champs indiqués en rouge.');
            }
        });
        
        cargarResumenCheckout();
    }
});