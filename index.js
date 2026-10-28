
const productosJSON = `[
  { "id": 1, "nombre": "Cheeseburger", "descripcion": "Medallón de carne, cheddar, pepinos y ketchup", "categoria": "Clásicas", "precio": 7500, "stock": 10, "imagen": "img/1.jpg" },
  { "id": 2, "nombre": "Clásica Completa", "descripcion": "Carne, lechuga, tomate y cebolla", "categoria": "Clásicas", "precio": 8200, "stock": 8, "imagen": "img/2.jpg" },
  { "id": 3, "nombre": "Cuarto de Libra", "descripcion": "Carne de 200 g, cheddar, cebolla y tomate", "categoria": "Clásicas", "precio": 9900, "stock": 0, "imagen": "img/3.jpg" },
  { "id": 4, "nombre": "Bacon BBQ", "descripcion": "Carne, panceta crocante, cheddar y salsa barbacoa", "categoria": "Especiales", "precio": 12500, "stock": 5, "imagen": "img/4.jpg" },
  { "id": 5, "nombre": "Provoleta", "descripcion": "Carne, provoleta fundida y cebolla caramelizada", "categoria": "Especiales", "precio": 13200, "stock": 4, "imagen": "img/5.jpg" },
  { "id": 6, "nombre": "Doble Cheddar", "descripcion": "Doble carne, doble cheddar, cebolla y lechuga", "categoria": "Especiales", "precio": 14000, "stock": 3, "imagen": "img/6.jpg" },
  { "id": 7, "nombre": "Combo Clásico", "descripcion": "Hamburguesa completa con papas fritas", "categoria": "Combos", "precio": 15900, "stock": 6, "imagen": "img/7.jpg" },
  { "id": 8, "nombre": "Combo Crispy", "descripcion": "Pollo crispy, coleslaw y papas fritas", "categoria": "Combos", "precio": 16500, "stock": 2, "imagen": "img/8.jpg" },
  { "id": 9, "nombre": "Combo Onion", "descripcion": "Carne, aros de cebolla, cheddar y papas fritas", "categoria": "Combos", "precio": 17800, "stock": 1, "imagen": "img/9.jpg" }
]`;


const productosParseados = JSON.parse(productosJSON);

localStorage.setItem("productos", JSON.stringify(productosParseados));

const textoRecuperado = localStorage.getItem("productos");
const arrayHamburguesas = JSON.parse(textoRecuperado);

console.table(arrayHamburguesas);




const tituloTienda = document.getElementById("titulo-tienda");
const contenedorProductos = document.getElementById("contenedor-productos");
const inputBusqueda = document.getElementById("input-busqueda");
const selectOrden = document.getElementById("select-orden");
const radiosCategoria = document.querySelectorAll('input[name="categoria"]');

const listaCarrito = document.getElementById("lista-carrito");
const precioTotal = document.getElementById("precio-total");
const cantidadCarrito = document.getElementById("cantidad-carrito");
const btnVaciar = document.getElementById("btn-vaciar-carrito");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let categoriaActual = "Todas";



function renderizarProductos(lista) {

    contenedorProductos.innerHTML = "";

    if (lista.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.className = "no-results";
        mensaje.textContent = "No se encontraron productos";

        contenedorProductos.appendChild(mensaje);
        return;
    }

    lista.forEach(prod => {

        const card = document.createElement("div");
        card.className = "card-producto";

        const img = document.createElement("img");
        img.src = prod.imagen;
        img.alt = prod.nombre;

        const h3 = document.createElement("h3");
        h3.textContent = prod.nombre;

        const p = document.createElement("p");
        p.textContent = prod.descripcion;

        const precio = document.createElement("div");
        precio.className = "precio";
        precio.textContent = `$${prod.precio.toLocaleString()}`;

        const btn = document.createElement("button");
        btn.className = "btn-agregar";

        if (prod.stock === 0) {
            btn.textContent = "Sin stock";
            btn.disabled = true;
        } else {
            btn.textContent = "AGREGAR AL CARRITO";

            btn.addEventListener("click", () => {
                agregarAlCarrito(prod.id);
            });
        }

        card.appendChild(img);
        card.appendChild(h3);
        card.appendChild(p);
        card.appendChild(precio);
        card.appendChild(btn);

        contenedorProductos.appendChild(card);
    });
}




function aplicarFiltros() {

    let filtrados = [...arrayHamburguesas];

    const texto = inputBusqueda.value.toLowerCase();

    if (texto) {
        filtrados = filtrados.filter(
            p =>
                p.nombre.toLowerCase().includes(texto) ||
                p.descripcion.toLowerCase().includes(texto)
        );
    }

    const orden = selectOrden.value;

    filtrados.sort((a, b) => {
        if (orden === "menor") {
            return a.precio - b.precio;
        }

        if (orden === "mayor") {
            return b.precio - a.precio;
        }

        return 0;
    });

    renderizarProductos(filtrados);
}



function agregarAlCarrito(id) {

    const producto = arrayHamburguesas.find(
        p => p.id === id
    );

    const itemEnCarrito = carrito.find(
        item => item.id === id
    );

    if (producto.stock === 0) {
        alert("Este producto no tiene stock disponible");
        return;
    }

    if (itemEnCarrito) {

        if (itemEnCarrito.cantidad < producto.stock) {
            itemEnCarrito.cantidad++;
        } else {
            alert("No hay más stock disponible");
            return;
        }

    } else {

        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    actualizarCarrito();
}


function quitarDelCarrito(id) {

    const itemEnCarrito = carrito.find(
        item => item.id === id
    );

    if (itemEnCarrito) {

        if (itemEnCarrito.cantidad > 1) {

            itemEnCarrito.cantidad--;

        } else {

            carrito = carrito.filter(
                item => item.id !== id
            );
        }
    }

    actualizarCarrito();
}


function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
}


function actualizarCarrito() {

    const carritoString = JSON.stringify(carrito);
    localStorage.setItem("carrito", carritoString);

    renderizarCarrito();

    actualizarContadores();
}




function renderizarCarrito() {

    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {

        const mensaje = document.createElement("li");
        mensaje.textContent = "Tu carrito está vacío";

        listaCarrito.appendChild(mensaje);
        return;
    }

    carrito.forEach(item => {

        const li = document.createElement("li");
        li.className = "item-carrito";

        const subtotal = item.precio * item.cantidad;

        const info = document.createElement("div");
        info.className = "cart-item-info";

        const nombre = document.createElement("div");
        nombre.className = "cart-item-name";
        nombre.textContent = `${item.nombre} x${item.cantidad}`;

        const precioSubtotal = document.createElement("div");
        precioSubtotal.className = "cart-item-subtotal";
        precioSubtotal.textContent = `${subtotal.toLocaleString()}`;

        const btnQuitar = document.createElement("button");
        btnQuitar.className = "remove-item";
        btnQuitar.textContent = "Quitar";

        btnQuitar.addEventListener("click", () => {
            quitarDelCarrito(item.id);
        });

        info.appendChild(nombre);
        info.appendChild(precioSubtotal);

        li.appendChild(info);
        li.appendChild(btnQuitar);

        listaCarrito.appendChild(li);
    });
}




function actualizarContadores() {

    const cantidadTotal = carrito.reduce(
        (total, item) => total + item.cantidad,
        0
    );

    const total = carrito.reduce(
        (acumulado, item) => acumulado + item.precio * item.cantidad,
        0
    );

    if (cantidadCarrito) {
        cantidadCarrito.textContent = cantidadTotal;
    }

    if (precioTotal) {
        precioTotal.textContent = `${total.toLocaleString()}`;
    }
}




inputBusqueda.addEventListener("keyup", aplicarFiltros);
selectOrden.addEventListener("change", aplicarFiltros);

radiosCategoria.forEach(radio => {

    radio.addEventListener("change", e => {
        categoriaActual = e.target.value;
        aplicarFiltros();
    });

});

btnVaciar.addEventListener("click", vaciarCarrito);




renderizarProductos(arrayHamburguesas);
actualizarCarrito();
