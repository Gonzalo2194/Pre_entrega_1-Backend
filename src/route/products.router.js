// routes/products.js

const express = require('express');
const router = express.Router();
const ProductManager =require("../controllers/product.manager-db")
const productManager = new ProductManager();



// Obtener productos
router.get("/products", productManager.getProducts);
// Ruta para obtener un producto por ID
router.get("/:id", productManager.getProductById);
//ruta para eliminar producto:
router.delete("/:id", productManager.deleteProduct);



//Ruta para actualizar un producto por ID
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProductData = req.body; // Suponemos que los datos actualizados están en el cuerpo de la solicitud

        const updatedProduct = await productManager.updateProductById(id, updatedProductData);

        if (!updatedProduct) {
            return res.status(404).json({ error: `Producto con ID ${id} no encontrado` });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ error: "Error al actualizar producto" });
    }});



// Ruta para eliminar un producto por ID
/*router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await productManager.deleteProduct(id);
        res.json(`Producto con ID: ${id} eliminado correctamente`);
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error al eliminar producto con ID: ${id}`);
    }
});*/

// Para obtener la lista de productos con paginación
router.get('/list', async (req, res) => {
    try {
        const { limit, page, sort, category, availability, query } = req.query;
        const products = await productManager.getProducts(limit, page, query, sort, category, availability);
        // Renderizar la vista con la lista de productos
        res.render('productList', { products });
    } catch (error) {
        console.error('Error al obtener la lista de productos', error);
        res.status(500).json({ status: 'error', error: 'Error al obtener productos' });
    }
});

//Nuevo add product
router.post("/create-products", async (req, res) => {
    try {
        const { title, description, price, img, code, stock, category, status, thumbnail } = req.body;
        const productData = { title, description, price, img, code, stock, category, status, thumbnail };
        const newProduct = await productManager.addProduct(productData);
        res.json(newProduct);
    } catch (error) {
        console.error("Error al agregar producto:", error);
        res.status(500).json({ error: "Error al agregar producto" });
    }
});


module.exports = router;
