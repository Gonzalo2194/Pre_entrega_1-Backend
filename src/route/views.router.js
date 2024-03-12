const express = require('express');
const vrouter = express.Router();
const ProductManager = require('../controllers/product.manager-db.js');
const productManager = new ProductManager();
const UserModel = require("../models/user.model");

vrouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("home", { 
            products: products.map(product => ({
                title: product.title,
                description: product.description,
                
                price: product.hasOwnProperty('price') ? product.price : undefined,

            }))
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

vrouter.get('/products', async (req, res) => {
    try {
        const { limit, page, sort, category, availability, query } = req.query;
        const products = await productManager.getProducts(limit, page, query, sort, category, availability);

        // Verifica si req.session está definido y si tiene la propiedad usuario
        const currentUser = req.session && req.session.usuario ? await UserModel.findOne({ email: req.session.usuario }) : null;
        // Renderiza la vista con la lista de productos
        res.render('layouts/productlist', { products,currentUser});
    } catch (error) {
        console.error('Error al obtener la lista de productos', error);
        res.status(500).json({ status: 'error', error: 'Error al obtener productos' });
    }

});



module.exports = vrouter;









