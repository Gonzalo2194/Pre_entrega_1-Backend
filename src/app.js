const express = require('express');
const app = express();
const PUERTO = 8080;
const ProductManager = require('./controllers/ProductManager');
const CartManager = require('./controllers/CartManager');

const productsRouter = require('../src/route/products.router');
const cartRouter = require('../src/route/cart.router');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.listen(PUERTO, () => {
    console.log(`Escuchando desde ${PUERTO}`);
});


module.exports = {
    ProductManager,
    CartManager,
};