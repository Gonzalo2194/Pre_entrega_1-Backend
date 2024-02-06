const express = require('express');
const app = express();
const PUERTO = 8080;
const ProductManager = require('./controllers/ProductManager');
const CartManager = require('./controllers/CartManager');
const exphbs = require("express-handlebars");
const viewsRouter = require("../src/route/views.router.js");
const productsRouter = require('../src/route/products.router');
const cartRouter = require('../src/route/cart.router');
const socket = require('socket.io');

app.engine("handlebars",exphbs.engine());
app.set('view engine',"handlebars"); 
app.set("views","./src/views") 
app.use(express.static ("./src/public"));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/",viewsRouter);

const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando desde ${PUERTO}`);
});


const io = socket(httpServer);

io.on ("connection",(socket) =>{
    console.log("Un cliente se conectó conmigo")
});



module.exports = {
    ProductManager,
    CartManager,
};