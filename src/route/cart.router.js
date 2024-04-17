const express = require('express');
const cartRouter = express.Router();
const CartManager = require('../controllers/cart.manager-db');
const { findOne } = require('../models/products.model');
const cartManager = new CartManager

//Ruta para crear carrito

/*cartRouter.post("/", async (req, res) => {
    try {
        const response = await cartManager.crearCarrito();
        res.json(response);
    } catch (error) {
        res.send("Error al crear carrito");
    }
});*/


cartRouter.post("/", cartManager.crearCarrito);
cartRouter.get("/:cid", cartManager.getCarritoById);
cartRouter.post("/:cid/product/:pid",cartManager.agregarProductoAlCarrito);




// Ruta para actualizar carrito por id y traer productos
cartRouter.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {

        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error("Error al guardar producto en carrito");
        res.status(500).json({error:"Error al interno del servidor"});
    }
});

module.exports = cartRouter;






