const express = require('express');
const app = express();
const PUERTO = 8080;
const ProductManager = require('./controllers/product.manager-db');
const CartManager = require('./controllers/cart.manager-db');
const cartManager = new CartManager();
const exphbs = require("express-handlebars");
const viewsRouter = require("../src/route/views.router.js");
const productsRouter = require('../src/route/products.router');
const cartRouter = require('../src/route/cart.router');
const socket = require('socket.io');
require("./database.js");
app.use(express.static('public'));

app.engine("handlebars",exphbs.engine());
app.set('view engine',"handlebars"); 
app.set("views","./src/views") 
app.use(express.static ("./src/public"));


app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/",viewsRouter);

const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando desde ${PUERTO}`);
});

const productManager = new ProductManager();
const io = socket(httpServer);

io.on("connection", async (socket) => {
    console.log("Un cliente se conectó conmigo");

    // Emitir array de productos al cliente que se conectó:
    socket.emit("productos", await productManager.getProducts());

    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);

        // Emitir el array actualizado de productos después de eliminar 
        io.emit("productos", await productManager.getProducts());
    });

    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto);
        io.emit("productos", await ProductManager.getProducts());
    });});


module.exports = {
    productManager,
    CartManager,
};