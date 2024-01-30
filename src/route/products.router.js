/*const express = require('express');
const router = express.Router();    
const ProductManager = require('../controllers/ProductManager');

const products = [];

// todos los productos
router.get("/", async (req, res) => {
    try {
        const {limit} = req.query.limit
        const products = ProductManager.getProducts()
        limit = Number(limit);
        if (limit){
            const limitproducts = products.slice (0,limit);
            return res.json(limitproducts);}
            return res.json (products);
    } catch (error) {
        console.log(error);
        res.send ("Error al traer productos")
    }
    res.json(products);
});


//productos por ID

router.get("/:pid",async(req, res,) => {
    const {pid} = req.params;
    try {
        const products = ProductManager.getProdductById(pid);
        res.json(products);
    } catch (error) {
        console.log(error);
        res.send (`Error al traer producto con ID:${pid}`)
    }
});

//productos post
router.post("/", async (req, res) => {
    try {
        const newItem = req.body;
        products.push(newItem);
        res.send({ status: "success", message: "Producto creado correctamente" });
    } catch (error) {
        console.log(error);
        res.send ("Error al crear productos")
    }

});

router.put("/:pid", async (req,res) => {
    const {pid} = req.params;

    try {
        const {title, description, price, thumbnail, code, stock} = req.body;
        const reponse = await ProductManager.updateProduct(id,{title, description, price, thumbnail, code, stock})
        res.json(reponse);
        
    } catch (error) {
        console.log(error);
        res.send (`Error al actualizar producto con ID:${pid}`)
    }

});

router.delete("/:pid", async (req, res) => {
    const products =this.getProducts();
    const index = products.findIndex(Product => products.id === id);

    if (index !== -1) {
        const productName = this.products[index].title;
        this.products.splice(index, 1);
        await this.ProductManager.guardarProducto() 
        console.log(`Producto ${productName} eliminado`);
    } else {
        console.log("Producto no encontrado para eliminar");
    }
})

module.exports = router;*/


//__________________________________________________________//

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
