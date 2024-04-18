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
    }

        async addProduct(productData) {
        try {
            const newProduct = new productosModel(productData);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            throw new Error("Error al agregar producto: " + error.message);
        }
    }
}

module.exports = ProductService;



