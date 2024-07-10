const express = require('express');
const ProductManager = require('../controllers/product.manager-db.js');
const productManager = new ProductManager();
const CartModel = require("../models/cart.model.js");
const CartService = require("../services/cart.services.js");
const cartService = new CartService();


class ViewsController {
    async renderChat(req, res) {
        res.render("layouts/chat");
    }

    async renderResetPassword(req, res) {
        res.render("layouts/passwordreset")
    }
    async renderCambioPassword(req, res) {
        res.render("layouts/passwordcambio")
    }
    async renderConfirmacion(req, res) {
        res.render("layouts/confirmacion-envio")
    }

    async realtime(req, res) {
        try {
            const message = req.session.message;
            delete req.session.message; // Elimina el mensaje de la sesión después de leerlo
            res.render("realtimeproducts", { message });
        } catch (error) {
            req.logger.warning("Error en vista");
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async productlist(req, res) {
        try {
            const products = await productManager.getProducts();
            let cartId = req.session.cartId

            if (!cartId) {
                const nuevoCarrito = await cartService.crearCarrito({ products: [] });
                cartId = nuevoCarrito._id;
                req.session.cartId = cartId;
            }

            res.render("layouts/productlist", {
                products: products.map(product => ({
                    img: product.img,
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    _id: product.id,

                })),
                cartId: cartId

            });
        } catch (error) {
            req.logger.info("error al obtener productos")
            res.status(500).json({ error: "Error interno del servidor" });

        }
    }

    async cart(req, res) {
        try {
            const cartId = req.params.cid; // Obtener el ID del carrito de los parámetros de la URL
            const carrito = await CartModel.findById(cartId).populate('products.product');

            if (!carrito) {
                return res.status(404).render('error', { message: "No se encontró el carrito" });
            }

            let total = 0;
            carrito.products.forEach(item => {
                total += item.product.price * item.quantity;
            });

            res.render('layouts/cart', {
                cart: {
                    _id: carrito._id,
                    products: carrito.products,
                    total: total
                }
            });
        } catch (error) {
            req.logger.info("error al obtener productos de carrito")
            res.status(500).render('error', { message: "Error interno del servidor" });
        }
    };

    async home(req, res) {
        try {
            const products = await productManager.getProducts();
            let cartId = req.session.cartId

            if (!cartId) {
                const nuevoCarrito = await cartService.crearCarrito({ products: [] });
                cartId = nuevoCarrito._id;
                req.session.cartId = cartId;
            }

            res.render("home", {
                products: products.map(product => ({
                    img: product.img,
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    _id: product.id,

                })),
                cartId: cartId

            });
        } catch (error) {
            req.logger.info("error al obtener productos")
            res.status(500).json({ error: "Error interno del servidor" });

        }
    }
}



module.exports = ViewsController;