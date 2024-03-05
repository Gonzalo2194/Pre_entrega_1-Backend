const productosModel = require ("../models/products.model.js");

class ProductManager {
    async addProduct ({title, description,price,img,code,stock,category,status,thumbnail}) {

        try {
        if(!title||!description||!price||!code||!stock||!category||!status) {
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

    async getProducts () {
        try {
            const product = await productosModel.find();
            return product;
        } catch (error) {
            console.log("Error al recuperar productos",error);
            throw error;
        }}

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

module.exports = ProductManager;