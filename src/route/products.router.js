// routes/products.js

const express = require('express');
const router = express.Router();
const ProductManager =require("../controllers/product.manager-db")
const productManager = new ProductManager();

// Obtener productos
router.get("/products", productManager.getProducts);

//ruta para crear producto
router.post("/create-products",productManager.addProduct);

// Ruta para obtener un producto por ID
router.get("/:id", productManager.getProductById);

//ruta para eliminar producto:
router.delete("/:id", productManager.deleteProduct);

//ruta para actualizarproducto por id
router.put("/:id", productManager.updateProductById)





// Para obtener la lista de productos con paginación
/*router.get('/list', async (req, res) => {
    try {
        const { limit, page, sort, category, availability, query } = req.query;
        const products = await productManager.getProducts(limit, page, query, sort, category, availability);
        // Renderizar la vista con la lista de productos
        res.render('productList', { products });
    } catch (error) {
        console.error('Error al obtener la lista de productos', error);
        res.status(500).json({ status: 'error', error: 'Error al obtener productos' });
    }
});*/


module.exports = router;
