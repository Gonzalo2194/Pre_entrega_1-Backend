const express = require('express');
const vrouter = express.Router();
const ProductManager = require('../controllers/product.manager-db.js');
const productManager = new ProductManager();
const UserModel = require("../models/user.model");
const CartModel = require("../models/cart.model.js");
const CartService = require("../services/cart.services.js");
const cartService = new CartService();


//ruta carrito
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
                title: product.title,
                description: product.description,
                price: product.price,
                stock: product.stock,
                _id:product.id,
                
            })),
            cartId: cartId

        });
    } catch (error) {
        console.log("Error al obtener productos", error);
        res.status(500).json({ error: "Error interno del servidor" });

    }
});



vrouter.get('/realtimeproducts', async (req, res) => {
    try {
        res.render("realtimeproducts");
    } catch (error) {
        console.log("Error en la vista real time", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

vrouter.get('/productlist', async (req, res) => {
    try {
        
        const { limit, page, sort, category, availability, query } = req.query;
        const products = await productManager.getProducts(limit, page, query, sort, category, availability);
        

        // Verifica si req.session está definido y si tiene la propiedad usuario
        const currentUser = req.session && req.session.usuario ? await UserModel.findOne({ email: req.session.usuario }) : null;
        console.log(currentUser);
        
        // Renderiza la vista con la lista de productos
        return res.render('layouts/productlist', { products, user: currentUser });
    } catch (error) {
        console.error('Error al obtener la lista de productos', error);
        res.status(500).json({ status: 'error', error: 'Error al obtener productos' });
    }

});

vrouter.get('/api/carts', async (req, res) => {
    try {
        
        const products = await CartModel.find(); // Ejemplo, obtiene todos los productos del carrito

        res.render('layouts/carts', { products }); // Renderiza la plantilla cart.handlebars con los productos
    } catch (error) {
        console.error('Error al obtener productos del carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
});






module.exports = vrouter;









