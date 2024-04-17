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
            const { cartId, productId, quantity } = req.body;
            const carrito = await cartService.agregarProductoAlCarrito(cartId, productId, quantity);
            res.json(carrito);
        } catch (error) {
            res.status(500).json({ error: "Error al agregar un producto al carrito" });
        }
    }
}


module.exports = CartManager



