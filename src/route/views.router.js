const express = require('express');
const vrouter = express.Router();
const ProductManager = require('../controllers/product.manager-db.js');
const productManager = new ProductManager();
const UserModel = require("../models/user.model");
const CartModel = require("../models/cart.model.js");
const CartService = require("../services/cart.services.js");
const cartService = new CartService();
const ViewsController = require("../controllers/viewscontroller.js")
const viewsController = new ViewsController();


vrouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        let cartId = req.session.cartId

            if(!cartId){
                const nuevoCarrito = await cartService.crearCarrito({ products: [] });
            cartId = nuevoCarrito._id;
            req.session.cartId = cartId;}

        res.render("home", { 
            products: products.map(product => ({
                img:product.img,
                title: product.title,
                description: product.description,
                price: product.price,
                stock: product.stock,
                _id:product.id,
                
            })),
            cartId: cartId

        });
    } catch (error) {
        req.logger.info("error al obtener productos")
        res.status(500).json({ error: "Error interno del servidor" });

    }
});



vrouter.get('/realtimeproducts', async (req, res) => {
    try {
        res.render("realtimeproducts");
    } catch (error) {
        req.logger.warning("Error en vista")
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


vrouter.get('/productlist', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        let cartId = req.session.cartId

            if(!cartId){
                const nuevoCarrito = await cartService.crearCarrito({ products: [] });
            cartId = nuevoCarrito._id;
            req.session.cartId = cartId;}

        res.render("layouts/productlist", { 
            products: products.map(product => ({
                img:product.img,
                title: product.title,
                description: product.description,
                price: product.price,
                stock: product.stock,
                _id:product.id,
                
            })),
            cartId: cartId

        });
    } catch (error) {
        req.logger.info("error al obtener productos")
        res.status(500).json({ error: "Error interno del servidor" });

    }
});


vrouter.get('/api/cart/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid; // Obtener el ID del carrito de los parámetros de la URL
        const carrito = await CartModel.findById(cartId).populate('products.product');
        
        if (!carrito) {
            return res.status(404).render('error', { message: "No se encontró el carrito" });
        }

        let total = 0;
        carrito.products.forEach(item => {
            total += item.product.price * item.quantity;
        });

        res.render('layouts/cart', {
            cart: {
                _id: carrito._id,
                products: carrito.products,
                total: total
            }
        });
    } catch (error) {
        req.logger.info("error al obtener productos de carrito")
        res.status(500).render('error', { message: "Error interno del servidor" });
    }
});

vrouter.get("/chat",viewsController.renderChat);
vrouter.get("/reset-password",viewsController.renderResetPassword);
vrouter.get("/passwordcambio",viewsController.renderCambioPassword);
vrouter.get("/confirmacion-envio",viewsController.renderConfirmacion);

module.exports = vrouter;









