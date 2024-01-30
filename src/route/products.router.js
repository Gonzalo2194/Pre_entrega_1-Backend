const express = require('express');
const router = express.Router();
const ProductManager = require('../controllers/ProductManager');

// Rutas para traer todos los productos y limit
router.get("/", async (req, res) => {
    try {
        let { limit } = req.query;

        if (limit !== undefined) {
            limit = Number(limit);

            if (isNaN(limit) || limit < 0 || !Number.isInteger(limit)) {
                return res.status(400).json({ error: 'El parámetro limit debe ser un número entero positivo o no proporcionarse' });
            }
        }

        const products = await ProductManager.getProducts(limit);
        return res.json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener productos' });
    }
});


// Ruta buscar un producto por ID
router.get("/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
        const product = await ProductManager.getProductsById(pid);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: `Producto con ID ${pid} no encontrado` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Error al obtener producto con ID: ${pid}` });
    }
});

// Ruta para crear un nuevo producto
router.post("/", async(req, res) => {
    try {
        const newItem = req.body;
        await ProductManager.addProduct(newItem);
        res.send({ status: "success", message: "Producto creado correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al crear productos");
    }
});

// Ruta para actualizar un producto por ID
router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const { title, description, price, thumbnail, code, stock, status = true ,category } = req.body;
        const response = await ProductManager.updateProduct(pid, { title, description, price, thumbnail, code, stock, status, category });
        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error al actualizar producto con ID: ${pid}`);
    }
});

// Ruta para eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        await ProductManager.deleteProduct(pid);
        res.json(`Producto con ID: ${pid} eliminado correctamente`);
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error al eliminar producto con ID: ${pid}`);
    }
});

module.exports = router;
