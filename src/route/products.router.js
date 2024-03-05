const express = require('express');
const router = express.Router();
const ProductManager = require ("../../src/controllers/product.manager-db")
const productManager = new ProductManager();


//mongoose:
const productosModel = require("../models/products.model");

//obtener productos:
//1) obtener listado de todos los productos:
router.get("/",async (req, res) => {
    try {
        const productos = await productosModel.find();
        let { limit } = req.query;

        if (limit !== undefined) {
            limit = Number(limit);

            if (isNaN(limit) || limit < 0 || !Number.isInteger(limit)) {
                return res.status(400).json({ error: 'El parámetro limit debe ser un número entero positivo o no proporcionarse' });
            }
        }

        const products = await productManager.getProducts(limit);
        return res.json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener productos' });
    }
});
// Rutas para traer todos los productos y limit
/*router.get("/", async (req, res) => {
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
});*/


// Ruta buscar un producto por ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await productManager.getProductById(id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: `Producto con ID ${id} no encontrado` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Error al obtener producto con ID: ${id}` });
    }
});

// Ruta para crear un nuevo producto
router.post("/", async(req, res) => {
    const nuevoProducto = req.body;
    try {
        
        await productManager.addProduct(nuevoProducto);
        res.send({ status: "success", message: "Producto creado correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al crear productos");
    }
});

// Ruta para actualizar un producto por ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { title, description, price, thumbnail, code, stock, status = true ,category } = req.body;
        const response = await productManager.updatedProduct(id, { title, description, price, thumbnail, code, stock, status, category });
        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error al actualizar producto con ID: ${id}`);
    }
});

// Ruta para eliminar un producto por ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await productManager.deleteProduct(id);
        res.json(`Producto con ID: ${id} eliminado correctamente`);
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error al eliminar producto con ID: ${id}`);
    }
});


module.exports = router;



