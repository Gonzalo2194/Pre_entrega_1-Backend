const express = require('express');
const cartRouter = express.Router();
const CartManager = require('../controllers/cart.manager-db');
const { findOne } = require('../models/products.model');
const cartManager = new CartManager



cartRouter.post("/", cartManager.crearCarrito);
cartRouter.get("/:cid", cartManager.getCarritoById);
cartRouter.post("/:cartId/product/:productId", cartManager.agregarProductoAlCarrito,);
cartRouter.delete("/:cartId/product/:productId",cartManager.eliminarProductoDeCarrito);
cartRouter.delete("/:cartId",cartManager.vaciarCarrito);

cartRouter.put('/:cartId/product/:productId', cartManager.editarCantidadProducto);
cartRouter.put('/:cid', cartManager.actualizarProductosEnCarrito);

module.exports = cartRouter;






