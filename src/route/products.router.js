const express = require('express');
const router = express.Router();
const ProductManager = require("../../src/controllers/product.manager-db");
const productManager = new ProductManager();

//mongoose:
const productosModel = require("../models/products.model");

// Obtener productos:
router.get("/", async (req, res) => {
    try {
        let { limit, page, sort, query } = req.query;

        // Validación del parámetro limit
        if (limit !== undefined) {
            limit = Number(limit);

            if (isNaN(limit) || limit < 0 || !Number.isInteger(limit)) {
                return res.status(400).json({ status: 'error', error: 'El parámetro limit debe ser un número entero positivo o no proporcionarse' });
            }
        }

        // Validación del parámetro page
        if (page !== undefined) {
            page = Number(page);

            if (isNaN(page) || page < 1 || !Number.isInteger(page)) {
                return res.status(400).json({ status: 'error', error: 'El parámetro page debe ser un número entero positivo o no proporcionarse' });
            }
        } else {
            page = 1;
        }

        // Validación del parámetro sort (asc o desc)
        if (sort !== undefined && !['asc', 'desc'].includes(sort)) {
            return res.status(400).json({ status: 'error', error: 'El parámetro sort debe ser "asc", "desc" o no proporcionarse' });
        }

        // Validación del parámetro query
        let queryObject = {};
        if (query) {
            queryObject = { $text: { $search: query } };
        }

        let queryBuilder = productosModel.find(queryObject);

        // Aplicar limit, skip y sort
        if (limit !== undefined) {
            queryBuilder = queryBuilder.limit(limit);
        }

        const skip = (page - 1) * (limit || 10);
        queryBuilder = queryBuilder.skip(skip);

        if (sort !== undefined) {
            queryBuilder = queryBuilder.sort({ price: sort === 'asc' ? 1 : -1 });
        }

        const totalProducts = await productosModel.countDocuments(queryObject);
        const totalPages = Math.ceil(totalProducts / (limit || 10));
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;

        const prevLink = hasPrevPage ? `${req.baseUrl}?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query || ''}` : null;
        const nextLink = hasNextPage ? `${req.baseUrl}?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query || ''}` : null;

        const products = await queryBuilder.exec();

        res.json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage: page - 1,
            nextPage: page + 1,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: 'Error al obtener productos' });
    }
});


// Ruta para obtener un producto por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await productManager.getProductById(id);

        if (product) {
            return res.json(product);
        } else {
            return res.status(404).json({ error: `Producto con ID ${id} no encontrado` });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: `Error al obtener producto con ID: ${id}` });
    }
});

// Ruta para crear un nuevo producto
router.post("/", async (req, res) => {
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
        const { title, description, price, thumbnail, code, stock, status = true, category } = req.body;
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
