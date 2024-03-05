const Cartmodel = require("../models/cart.model.js");

class CartManager {
    async crearCarrito(){
        try {
            const nuevoCarrito = new Cartmodel ({products: [],})
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.log("Error al crear carrito nuevo");
            throw error;
        }
    }
    async getCarritoById(cartId){
        try {
            const carrito = await Cartmodel.findById(cartId);
            if(!carrito){
                console.log("No se encuentra carrito con ese Id");
                return null;
            }
            return carrito;

        } catch (error) {
            console.log("Error al obtener carrito por Id");
            throw error;
        }
    }
    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(cartId);
            const existeProducto = carrito.products.find(item => item.product.toString() === productId);
    
            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productId, quantity });
            }
            await carrito.save();
            return carrito;
        } catch (error) {
            console.log("Error al agregar un producto", error);
            throw error;
        }
    }
}

module.exports = CartManager