const ProductService = require ("../services/product.services.js");
const productosModel = require("../models/products.model.js");
const productService = new ProductService();

class ProductManager {
    constructor() {
        this.productService = new ProductService();
    }

    async addProduct(req,res) {
        try {
            const { title, description, price, img, code, stock, category, status, thumbnail, owner } = req.body;
            const ownerEmail = req.session.user?.email || 'admin';
            
            const productData = { 
                title, 
                description, 
                price, 
                img, 
                code, 
                stock, 
                category, 
                status, 
                thumbnail,
                owner: ownerEmail || 'admin' 
            };
    
            const newProduct = await productService.addProduct(productData);
            req.session.message = 'Producto creado correctamente';

        // Redirigir a la página de productos en tiempo real
        res.redirect('/realtimeproducts');
            // res.json(newProduct);
            // return newProduct;
        } catch (error) {
            console.log("Error al agregar producto:", error); 
            res.status(500).json({ error: "Error al agregar producto" }); 
            throw error;
        }
    };

    async getProducts(limit, page, query, sort) {
        try {
            let queryObject = {};

            if (query) {
                queryObject = { $text: { $search: query } };
            }

            let queryBuilder = productosModel.find(queryObject);

            if (limit !== undefined) {
                queryBuilder = queryBuilder.limit(limit);
            }

            if (page !== undefined) {
                const skip = (page - 1) * (limit || 10);
                queryBuilder = queryBuilder.skip(skip);
            }

            let sortObject = {};

            if (sort === 'asc') {
                sortObject = { price: 1 };
            } else if (sort === 'desc') {
                sortObject = { price: -1 };
            }

            queryBuilder = queryBuilder.sort(sortObject);

            const products = await queryBuilder.exec();
            return products;
        } catch (error) {
            console.log("Error al recuperar productos:", error);
            throw error;
        }
    };

    async getProductById(req, res) {
        try {
            const { id } = req.params;

            const product = await productService.getProductById(id);

            if (product) {
                return res.json(product);
            } else {
                return res.status(404).json({ error: `Producto con ID ${id} no encontrado` });
            }
        } catch (error) {
            console.error("Error al obtener producto por ID:", error);
            return res.status(500).json({ error: `Error al obtener producto por ID` });
        };
    };
    async updateProductById(req,res) {
        try {
            const { id } = req.params;
            const updatedProductData = req.body; //  obtener los datos del cuerpo de la solicitud
    
            const product = await productService.updateProductById(id, updatedProductData);
            if (!product) {
                console.log("No se encontró el producto");
                return res.status(404).json({ error: "No se encontró el producto" }); 
            }
            res.json({ message: "Producto actualizado correctamente" }); 
            console.log("Producto actualizado correctamente");
            return product;
        } catch (error) {
            console.log("Error al actualizar producto:", error);
            throw error;
        }
    };
    async deleteProduct(id, io) {
        try {
            const result = await productosModel.findByIdAndDelete(id);
            if (!result) {
                throw new Error("No se encontró el producto para eliminar");
            }
            // Emitir el array actualizado de productos después de eliminar 
            io.emit("productos", await this.getProducts());
            return { message: "Producto eliminado correctamente" };
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            throw new Error("Error al eliminar producto por ID");
        }
    }
}

module.exports = ProductManager;