
const express = require('express');
const vrouter = express.Router();
const ProductManager = require('../controllers/ProductManager.js');

vrouter.get('/',async (req, res) =>{
    try {
        const products = await ProductManager.getProducts();
        res.render("home",{products: products});
    } catch (error) {
        console.error(error);
    }
});

vrouter.get('/realtimeproducts',async (req, res) =>{
    try {
        const products = await ProductManager.getProducts();
        res.render("home",{products})
    } catch (error) {
        console.error(error);
    }
});

module.exports = vrouter;









