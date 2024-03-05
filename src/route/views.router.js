const express = require('express');
const vrouter = express.Router();
const ProductManager = require('../controllers/product.manager-db.js');
const productManager = new ProductManager();

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





module.exports = vrouter;









