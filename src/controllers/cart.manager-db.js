/*const Cartmodel = require("../models/cart.model.js");

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
            const carrito = await Cartmodel.findById(cartId)
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

module.exports = CartManager*/

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const CartModel = require("../models/cart.model.js");
const CartService = require("../services/cart.services.js");
const cartService = new CartService();
const mongoose = require('mongoose');

class CartManager {
    async crearCarrito(req, res) {
        try {
            const nuevoCarrito = await cartService.crearCarrito(req.body);
            res.json(nuevoCarrito);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "No se puede crear el carrito" });
        }
    }

    async getCarritoById(req, res) {
        try {
            const { cid } = req.params
            const carrito = await cartService.getCarritoById(cid);

            if (!carrito) {
                
                return res.status(404).json({ error: "No se encontró el carrito" });
            }
            res.json(carrito); 
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener el carrito por Id" });
        }
    }


async agregarProductoAlCarrito(req, res) {
    try {
        const { cartId, productId } = req.params;
        const { quantity } = req.body; 

        // Verificar si 'cartId', 'productId' y 'quantity' están definidos y tienen valores válidos
        if (!cartId || !productId || isNaN(quantity)) {
            return res.status(400).json({ error: "Parámetros de solicitud incorrectos" });
        }

        // Llama al servicio para agregar el producto al carrito
        await cartService.agregarProductoAlCarrito(cartId, productId, parseInt(quantity, 10));

        res.redirect(`/api/cart/${cartId}`);
    } catch (error) {
        console.error("Error al agregar un producto al carrito:", error);
        res.status(500).json({ error: "Error al agregar un producto al carrito" });
    }};

    async eliminarProductoDeCarrito(req, res) {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        console.log(`Cart ID: ${cartId}, Product ID: ${productId}`);
        try {
            const updatedCart = await cartService.eliminarProductoDeCarrito(cartId, productId);
            res.json({
                status: 'success',
                message: 'Producto eliminado del carrito correctamente',
                updatedCart,
            });
        } catch (error) {
            res.status(500).send("Error");
        }
    }
    
    async vaciarCarrito(req, res) {
        const cartId = req.params.cartId;
        try {
            await cartService.vaciarCarrito(cartId);
            res.json({
                status: 'success',
                message: 'Carrito vaciado correctamente',
            });
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            res.status(500).json({ error: 'Error al vaciar el carrito' });
        }
    };

    async actualizarProductosEnCarrito(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;

        try {
            const updatedCart = await cartService.actualizarProductosEnCarrito(cartId, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            console.error("Error al actualizar productos en el carrito:", error);
            res.status(500).json({ error: "Error al actualizar productos en el carrito" });
        }
    }

    /*async editarCantidadProducto(req, res) {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        const newQuantity = parseInt(req.body.quantity, 10); 

        if (isNaN(newQuantity) || newQuantity <= 0) {
            return res.status(400).json({ error: "Cantidad no válida" });
        }

        try {
            const updatedCart = await cartService.editarCantidadProducto(cartId, productId, newQuantity);
            res.json({
                status: "success",
                message: "Cantidad del producto editada correctamente",
                products: updatedCart.products
            });
        } catch (error) {
            console.error("Error al editar la cantidad del producto en el carrito:", error);
            res.status(500).json({ error: "Error al editar la cantidad del producto en el carrito" });
        }
    }
}*/

async editarCantidadProducto(req, res) {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    const newQuantity = parseInt(req.body.quantity, 10); 

    if (isNaN(newQuantity) || newQuantity <= 0) {
        return res.status(400).json({ error: "Cantidad no válida" });
    }

    try {
        const updatedCart = await cartService.editarCantidadProducto(cartId, productId, newQuantity);
        res.json({
            status: "success",
            message: "Cantidad del producto editada correctamente",
            products: updatedCart.products
        });
    } catch (error) {
        console.error("Error al editar la cantidad del producto en el carrito:", error);
        res.status(500).json({ error: "Error al editar la cantidad del producto en el carrito" });
    }
}}

module.exports = CartManager;



