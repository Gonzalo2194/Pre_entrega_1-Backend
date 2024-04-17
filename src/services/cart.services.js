const CartModel = require("../models/cart.model.js");

class CartService {
    async crearCarrito(cartData) {
        try {
            const nuevoCarrito = new CartModel(cartData);
            return await nuevoCarrito.save();
        } catch (error) {
            console.error(error);
            console.log("Error al crear carrito nuevo");
            throw error;
        }
    }

    //async getCarritoById(cartId) {
        async getCarritoById(cartId) {
            try {
            const carrito = await CartModel.findById(cartId).populate({
                path: 'products.product', // Nombre del campo de referencia en el esquema del carrito
                select: 'title' // Campos que deseas mostrar del producto (en este caso, solo el título)
            });
        
        
        /*try {
            const carrito = await CartModel.findById(cartId);*/
            
            if (!carrito) {
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

            const carrito = await CartModel.findById(cartId);
            console.log(cartId);
            if (!carrito) {
                throw new Error("No se encontró el carrito");
            }

            const existeProducto = carrito.products.find(item => item.product.toString() === productId);
            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productId, quantity });
            }

            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.log("Error al agregar un producto al carrito:", error);
            throw error;
        }
    }

};


module.exports = CartService;