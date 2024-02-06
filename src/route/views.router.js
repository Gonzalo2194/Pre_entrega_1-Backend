
const express = require('express');
const vrouter = express.Router();
const ProductManager = require('../controllers/ProductManager.js');

vrouter.get('/',async (req, res) =>{
    try {
        const products = await ProductManager.getProducts();
        res.render("home",{products: products});
    } catch (error) {
        console.log("Error al obtener productos",error);
        res.status(500).json({error:"Error interno del servidor"});
    }
});

vrouter.get('/realtimeproducts',async (req, res) =>{
    try {
        res.render("realtimeproducts")
    } catch (error) {
        console.log("Error en la vista real time",error);
        res.status(500).json({error:"Error interno del servidor"});
    }
});






module.exports = vrouter;









