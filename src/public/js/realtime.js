const socket = io();
console.log("El script main.js se ha cargado correctamente.");

// Escuchar eventos de productos desde el servidor
socket.on("productos", (data) => {
    console.log("Datos de productos recibidos:", data);
    renderProductos(data);
});


// Función para renderizar la lista de productos
const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";

    productos.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("col-lg-4", "col-md-6", "mb-4");

        card.innerHTML = `
            <div class="card h-100">
                <img src="${item.img}" class="card-img-top" alt="${item.title}">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.description}</p>
                    <p class="card-text">$${item.price}</p>
                </div>
                <div class="card-footer">
                    <button class="btn btn-danger" onclick="eliminarProducto('${item._id}')">Eliminar</button>
                    
                </div>
            </div>
        `;

        contenedorProductos.appendChild(card);
    });
};



// Función para eliminar un producto
const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
};

// Escuchar evento de confirmación de producto eliminado
socket.on("productoEliminado", () => {
    // Actualizar la lista de productos después de eliminar uno
    socket.emit("obtenerProductos");
});

// Manejar el evento click en el botón de agregar producto
document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
});

// Función para agregar un nuevo producto
const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        category: document.getElementById("category").value,
        stock: document.getElementById("stock").value,
        status: document.getElementById("status").value === "true",
    };

    socket.emit("agregarProducto", producto);
};






////////////////////////////////////////////////////////////////////////


