const express = require('express');
const cartRouter = express.Router();
const CartManager = require('../controllers/CartManager');

//Ruta para crear carrito

cartRouter.post("/", async (req, res) => {
    try {
        const response = await CartManager.newCart();
        res.json(response);
    } catch (error) {
        res.send("Error al crear carrito");
    }
});

//ruta para traer carrito por id

cartRouter.get("/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
        const response = await CartManager.getCartsProducts(cid);
        res.json(response);
    } catch (error) {
        res.send("Error al enviar productos al carrito");
    }
});

//Ruta para actualizar carrito por id y traer productos

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {
        await CartManager.addProductToCart(cid, pid);
        res.send("Producto agregado correctamente");
    } catch (error) {
        res.send("Error al guardar producto en carrito");
    }
});

module.exports = cartRouter;






