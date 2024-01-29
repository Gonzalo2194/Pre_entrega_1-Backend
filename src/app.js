const express = require('express');
const app = express();
const PUERTO= 8080;
const ProductManager = require('./controllers/ProductManager');

const productsRouter = require('../src/route/products.router');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/products",productsRouter);







app.listen(PUERTO,() =>{
    console.log (`escuchando desde ${PUERTO}`)
});

module.exports = ProductManager;