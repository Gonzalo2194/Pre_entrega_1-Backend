const socket= io();

socket.on("productos",(data)=>{
    renderProductos(data);
})

const renderProductos = (productos) => { 
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML ="";

    productos.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("col-lg-4", "col-md-6", "mb-4");

        card.innerHTML = `
            <div class="card h-100">
                <img src="${item.thumbnail}" class="card-img-top" alt="${item.title}">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.description}</p>
                    <p class="card-text">$${item.price}</p>
                </div>
                <div class="card-footer">
                    <button class="btn btn-danger" onclick="eliminarProducto('${item.id}')">Eliminar</button>
                </div>
            </div>
        `;

        contenedorProductos.appendChild(card);

        card.querySelector("button").addEventListener("click", () =>{
            eliminarProducto (item.id);
        })
    });
}  

const eliminarProducto =(id)=>{
    socket.emit("eliminarProducto",id);
}

document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
});

const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        imagen: document.getElementById("img").value,
        code: document.getElementById("code").value,
        category: document.getElementById("category").value,
        stock: document.getElementById("stock").value,
        status: document.getElementById("status").value === "true",
    }

    socket.emit("agregarProducto", producto);
}