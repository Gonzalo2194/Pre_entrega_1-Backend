const CartService = require("../services/cart.services.js");
const cartService = new CartService();
const mongoose = require('mongoose');
const ProductService = require("../services/product.services.js");
const productService = new ProductService();
const EmailManager = require("../services/email.js")
const emailManager = new EmailManager();
const TicketService = require("../services/ticket.service.js");
const ticketService = new TicketService();
const { generateUniqueCode, calcularTotal } = require("../utils/cartutils.js");
const UserModel = require("../models/user.model.js");


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

            if (!cartId || !productId || isNaN(quantity)) {
                return res.status(400).json({ error: "Parámetros de solicitud incorrectos" });
            }

            await cartService.agregarProductoAlCarrito(cartId, productId, parseInt(quantity, 10));

            res.redirect(`/api/cart/${cartId}`);
        } catch (error) {
            console.error("Error al agregar un producto al carrito:", error);
            res.status(500).json({ error: "Error al agregar un producto al carrito" });
        }
    };

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
    }
    async finalizarCompra(req, res) {

        const cartId = req.params.cartId;
        const { email } = req.body;

        console.log('CartId recibido:', cartId);
        console.log('Email recibido:', email);
        try {
            if (!cartId) {
                return res.status(400).json({ error: "Se requiere proporcionar el cartId en la consulta" });
            }

            const products = await cartService.obtenerProductosDeCarrito(cartId);


            if (!Array.isArray(products) || products.length === 0) {
                return res.status(400).json({ error: "La propiedad products del carrito es inválida o está vacía" });
            }


            const productosNoDisponibles = [];
            for (const item of products) {
                if (!item.product || !item.quantity) {
                    return res.status(400).json({ error: "Los productos en el carrito no tienen la estructura esperada" });
                }
                const productId = item.product;
                const product = await productService.getProductById(productId);
                if (!product || product.stock < item.quantity) {
                    productosNoDisponibles.push(productId);
                }
            }

            if (productosNoDisponibles.length > 0) {
                return res.status(400).json({
                    message: 'Algunos productos no están disponibles en la cantidad requerida',
                    productosNoDisponibles
                });
            }


            let userWithCart = null;
            try {
                userWithCart = await UserModel.findOne({ cart: cartId });
            } catch (error) {
                console.error('Error al buscar al usuario con el carrito:', error);
            }

            const ticket = await ticketService.crearTicket({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calcularTotal(products),
                purchaser: userWithCart ? userWithCart._id : null,
                products: products
            });


            for (const item of products) {
                const productId = item.product;
                const product = await productService.getProductById(productId);
                if (!product) {
                    return res.status(404).json({ error: `Producto con ID ${productId} no encontrado` });
                }
                if (product.stock < item.quantity) {
                    return res.status(400).json({ error: `Producto ${product.title} no disponible en la cantidad requerida` });
                }
                product.stock -= item.quantity;
                await product.save();
            }


            await cartService.vaciarCarrito(cartId);


            if (email) {
                await emailManager.enviarCorreoCompra(email, userWithCart ? userWithCart.first_name : "", ticket._id);
            }


            res.render("layouts/checkout", {
                cliente: userWithCart ? userWithCart.first_name : "",
                email: email || "",
                numTicket: ticket._id
            });

        } catch (error) {
            console.error('Error al procesar la compra:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
module.exports = CartManager;



