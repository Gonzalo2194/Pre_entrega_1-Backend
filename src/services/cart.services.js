const CartModel = require("../models/cart.model.js");
const mongoose = require('mongoose');
const TicketModel = require("../models/ticket.model.js")

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
                existeProducto = carrito.products.find(item => item.product.toString() === productId);}
            
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
                const carrito = await CartModel.findById(cartId);
            if (!carrito) {
                throw new Error('Carrito no encontrado');
            }

            carrito.products = carrito.products.filter(product => product.product.toString() !== productId);
            await carrito.save();
            return carrito;

            } catch (error) {
                throw new Error('Error al eliminar el producto del carrito');
            }
        };
        
        async vaciarCarrito(cartId) {
            try {
                const carrito = await CartModel.findByIdAndUpdate(
                    cartId,
                    { products: [] },
                    { new: true }
                );
    
                if (!carrito) {
                    throw new Error('Carrito no encontrado');
                }
                return carrito;
            } catch (error) {
                throw new Error("Error");
            }
        };

        async actualizarProductosEnCarrito(cartId, updatedProducts) {
            try {
                const carrito = await CartModel.findById(cartId);
    
                if (!carrito) {
                    throw new Error('Carrito no encontrado');
                }
    
                carrito.products = updatedProducts;
                carrito.markModified('products');
                await carrito.save();
                return carrito;
            } catch (error) {
                throw new Error ("error");
            }
        }

    async editarCantidadProducto(cartId, productId, newQuantity) {
        try {
            const carrito = await CartModel.findById(cartId);
            if (!carrito) {
                throw new Error('Carrito no encontrado');
            }

            const productIndex = carrito.products.findIndex(item => item.product.toString() === productId);
            if (productIndex !== -1) {
                carrito.products[productIndex].quantity = newQuantity;

                carrito.markModified("products");
                await carrito.save();
                return carrito;
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }
        } catch (error) {
            console.error('Error al editar la cantidad del producto en el carrito:', error);
            throw new Error('Error al editar la cantidad del producto en el carrito');
        }
    }
    async obtenerProductosDeCarrito(idCarrito) {
        try {
            const carrito = await CartModel.findById(idCarrito);
            if (!carrito) {
                console.log("No existe ese carrito con el id");
                return null;
            }
            return carrito;
        } catch (error) {
            throw new Error("Error");
        }
    }
    async agregarProductosATicket(products, purchaser) {
        try {
            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calcularTotal(products),
                purchaser
            });
            await ticket.save();
            return ticket;
        } catch (error) {
            throw new Error("Error");
        }
    }
}
module.exports = CartService;