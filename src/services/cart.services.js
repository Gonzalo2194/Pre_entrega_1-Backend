const CartModel = require("../models/cart.model.js");
const mongoose = require('mongoose');

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
        async getCarritoById(cartId) {
            try {
            const carrito = await CartModel.findById(cartId).populate({
                path: 'products.product', 
                select: 'title' 
            });
            
            if (!carrito) {
                console.log("No se encuentra carrito con ese Id");
                return null;
            }
            return carrito;
        } catch (error) {
            console.log("Error al obtener carrito por Id:", error);
        throw error; 
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try {

            const carrito = await CartModel.findById(cartId);
            
            let existeProducto = null;
            
            if (!carrito) {
                const nuevoCarrito = new CartModel({ products: [{ product: productId, quantity }] });
                return await nuevoCarrito.save();
                
            }else{
                const existeProducto = carrito.products.find(item => item.product.toString() === productId);}
            
            if (existeProducto) {

                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productId, quantity });
            }

            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.log("Error al agregar un producto al carrito :", error);
            throw error;
        }}

        async eliminarProductoDeCarrito(cartId, productId) {
            try {
                const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            cart.products = cart.products.filter(product => product.productId !== productId);
            await cart.save();

            return cart;

            } catch (error) {
                throw new Error('Error al eliminar el producto del carrito');
            }
        };


};


module.exports = CartService;