// routes/products.js

const express = require('express');
const router = express.Router();
const ProductManager =require("../controllers/product.manager-db")
const productManager = new ProductManager();

// Obtener productos
router.get("/", productManager.getProducts)

//ruta para crear producto
router.post("/create-products",productManager.addProduct);

// Ruta para obtener un producto por ID
router.get("/:id", productManager.getProductById);

//ruta para eliminar producto:
router.delete("/:id", productManager.deleteProduct);

//ruta para actualizarproducto por id
router.put("/:id", productManager.updateProductById)


module.exports = router;
