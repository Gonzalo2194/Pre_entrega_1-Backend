const express = require('express');
const cartRouter = express.Router();
const CartManager = require('../controllers/cart.manager-db');
const { findOne } = require('../models/products.model');
const cartManager = new CartManager



cartRouter.post("/", cartManager.crearCarrito);
cartRouter.get("/:cid", cartManager.getCarritoById);
cartRouter.post("/:cartId/product/:productId", cartManager.agregarProductoAlCarrito,);
//cartRouter.post("/:cartId/product/:productId",[cartManager.crearCarrito, cartManager.agregarProductoAlCarrito]);
//cartRouter.post('/add-to-cart', cartManager.agregarProductoAlCarrito);



module.exports = cartRouter;






