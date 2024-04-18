/*const productosModel = require ("../models/products.model.js");

class ProductManager {
    async addProduct ({title, description,price,img,code,stock,category,status,thumbnail}) {

        try {
        if(!title||!description||!price||!stock||!category||!status) {
            console.log("Todos los campos son obligatrios");
            return;
        }

        const existeProducto = await productosModel.findOne({code: code});

        if(existeProducto){
            console.log("El código debe ser único");
            return;
        }

        const nuevoProducto = new productosModel({
            title, 
            description,
            price,
            img,
            code,
            stock,
            category,
            status: true,
            thumbnail: thumbnail ||[],
        });
        await nuevoProducto.save();
        

        } catch (error) {
            console.log("Error al agregar producto",error);
            throw error;
        }
    }


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
            console.log("Error al recuperar productos", error);
            throw error;
        }
    }


    async getProductById (id) {
        try {
            const producto = await productosModel.findById(id);
            if(!producto){
                console.log("No se encuentra producto");
                return null
            }
            console.log("Producto encontrado");
            return producto;

        } catch (error) {
            console.log("Error al recuperar productos",error);
            throw error;
        }
    }

    async updatedProduct (id,productoActualizado) {
        try {
            const updatedProduct = await productosModel.findByIdAndUpdate(id,productoActualizado);
            if(!updatedProduct){
                console.log("No se encuentra producto");
                return null
            }
            console.log("Producto actualizado");
            return updatedProduct;
        } catch (error) {
            console.log("Error al actualizar producto",error);
            throw error;
        }
    }
    async deleteProduct (id){
        try {
            const deleteProduct = await productosModel.findByIdAndDelete(id);
            if(!deleteProduct){
                console.log("No se encuentra producto");
                return null;
            }
            console.log("Producto eliminado");

        } catch (error) {
            console.log("Error al eliminar producto",error);
            throw error;
        }
    }
}

module.exports = ProductManager;*/

    /*async addProduct({ title, description, price, img, code,stock, category, status, thumbnail }) {
        try {
            // Verificar si todos los campos obligatorios están presentes
            if (!title || !description || !price || !stock || !category || !status) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            // Verificar si el código del producto es único
            const existingProduct = await productosModel.findOne({ code: code });
            if (existingProduct) {
                console.log("El código del producto debe ser único");
                return;
            }

            // Crear un nuevo producto
            const newProduct = new productosModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnail: thumbnail || [],
            });

            // Guardar el nuevo producto en la base de datos
            await newProduct.save();
            console.log("Producto agregado correctamente");
        } catch (error) {
            console.log("Error al agregar producto:", error);
            throw error;
        }
    }*/

//nuevo addproduct:
const ProductService = require ("../services/product.services.js");
const productosModel = require("../models/products.model.js");
const productService = new ProductService();

class ProductManager {
    constructor() {
        this.productService = new ProductService();
    }

    async addProduct(productData) {
        try {
            const newProduct = await this.productService.addProduct(productData);
            return newProduct;
        } catch (error) {
            throw error;
        }
    };

//nuevo getProducts:
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
    async updateProductById(id, updatedProductData) {
        try {
            const product = await this.productService.updateProductById(id, updatedProductData);
            if (!product) {
                console.log("No se encontró el producto");
                return null;
            }
            console.log("Producto actualizado correctamente");
            return product;
        } catch (error) {
            console.log("Error al actualizar producto:", error);
            throw error;
        }
    };
    
    async deleteProduct(req, res) {

        try {
            const { id } = req.params;
            const deletedProduct = await productService.deleteProduct(id);
            if (deletedProduct) {
                res.json({ message: "Producto eliminado correctamente" });
            } else {
                res.status(404).json({ error: `Producto con ID ${id} no encontrado` });
            }
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            res.status(500).json({ error: "Error al eliminar producto por ID" });
        }}

}

module.exports = ProductManager;