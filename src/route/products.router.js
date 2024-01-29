const express = require('express');
const router = express.Router();    

const products = [];


//productos get (todos los productos)
router.get("/",(req, res) =>{
    res.json = products
})

//producto por ID REVER
router.get("/",(req, res) =>{
    res.json = products
})

//productos post

router.post("/",(req, res) =>{
    const nuevoProducto = req.body;
    products.push(nuevoProducto);
    res.send({status:"success",message:"Producto creado correctamente"});
});



module.exports = products;