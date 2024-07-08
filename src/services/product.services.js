const productosModel = require("../models/products.model");



class ProductService {

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
            console.error("Error al recuperar productos:", error);
            throw error;
        }
    };

        async addProduct(productData) {
        try {
            const newProduct = new productosModel(productData);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            throw new Error("Error al agregar producto: " + error.message);
        }
    };

    async getProductById(id) {
        try {
            const product = await productosModel.findById(id);
            if (!product) {
                console.log("No se encontró el producto");
                return null;
            }
            console.log("Producto encontrado");
            return product;
        } catch (error) {
            console.log("Error al recuperar producto por ID:", error);
            throw error;
        }
    };

    async updateProductById(id, updatedProductData) {
        try {

            const updates = {};
            for (let key in updatedProductData) {
                if (updatedProductData[key] !== "") {
                    updates[key] = updatedProductData[key];
                }
            }
            const product = await productosModel.findByIdAndUpdate(id, { $set: updates }, { new: true });
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

        async deleteProduct(id) {
            try {
                const deletedProduct = await productosModel.findByIdAndDelete(id);
                return deletedProduct;
            } catch (error) {
                throw error;
            }
        }
}

module.exports = ProductService;



