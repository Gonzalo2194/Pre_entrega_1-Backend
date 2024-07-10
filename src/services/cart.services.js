const CartModel = require("../models/cart.model.js");
const mongoose = require('mongoose');
const TicketModel = require("../models/ticket.model.js")
const productosModel = require("../models/products.model.js");

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
        const product = await productosModel.findById(productId);
        const carrito = await CartModel.findById(cartId);

        if (!product) {
            throw new Error('Producto no encontrado');
        }

        if (!carrito) {
            const nuevoCarrito = new CartModel({ products: [{ product: productId, quantity }] });
            await nuevoCarrito.save();
        } else {
            let existeProducto = carrito.products.find(item => item.product.toString() === productId);

            if (existeProducto) {
                if (product.stock < (existeProducto.quantity + quantity)) {
                    throw new Error('No hay suficientes productos en stock');
                }
                existeProducto.quantity += quantity;
            } else {
                if (product.stock < quantity) {
                    throw new Error('No hay suficientes productos en stock');
                }
                carrito.products.push({ product: productId, quantity });
            }

            carrito.markModified("products");
            await carrito.save();
        }

        product.stock -= quantity;
        await product.save();

        return carrito;
    } catch(error) {
        console.error("No hay suficientes productos en stock", error.message);
        throw new Error(error.message);
    }


    async eliminarProductoDeCarrito(cartId, productId) {
        try {
            const producto = await productosModel.findById(productId);
            const carrito = await CartModel.findById(cartId);

            if (!carrito) {
                throw new Error('Carrito no encontrado');
            }

            const productToRemove = carrito.products.find(product => product.product.toString() === productId);
            if (!productToRemove) {
                throw new Error('Producto no encontrado en el carrito');
            }

            producto.stock += productToRemove.quantity;
            await producto.save();


            carrito.products = carrito.products.filter(product => product.product.toString() !== productId);
            await carrito.save();

            return carrito;
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            throw new Error('Error al eliminar el producto del carrito');
        }
    }

    async vaciarCarrito(cartId) {
        try {
            const carrito = await CartModel.findById(cartId);
            if (!carrito) {
                throw new Error('Carrito no encontrado');
            }

            for (const item of carrito.products) {
                const productId = item.product;
                const quantity = item.quantity;
                const product = await productosModel.findById(productId);
                if (product) {
                    product.stock += quantity;
                    await product.save();
                }
            }

            carrito.products = [];
            await carrito.save();

            return carrito;
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            throw new Error("Error al vaciar el carrito");
        }
    };

    async actualizarProductosEnCarrito(cartId, updatedProducts) {
        try {
            const carrito = await CartModel.findById(cartId);

            if (!carrito) {
                throw new Error('Carrito no encontrado');
            }

            for (const updatedItem of updatedProducts) {
                const { product: updatedProductId, quantity: updatedQuantity } = updatedItem;
                const currentProduct = carrito.products.find(item => item.product.toString() === updatedProductId);

                if (currentProduct) {
                    const product = await productosModel.findById(updatedProductId);
                    const quantityDifference = updatedQuantity - currentProduct.quantity;

                    if (product) {
                        product.stock -= quantityDifference;
                        await product.save();
                    }
                } else {
                    const product = await productosModel.findById(updatedProductId);
                    if (product) {
                        product.stock -= updatedQuantity;
                        await product.save();
                    }
                }
            }

            carrito.products = updatedProducts;
            carrito.markModified('products');
            await carrito.save();
            return carrito;
        } catch (error) {
            console.error("Error al actualizar productos en el carrito:", error);
            throw new Error("Error al actualizar productos en el carrito");
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
                const currentProduct = carrito.products[productIndex];
                const product = await productosModel.findById(productId);
                const quantityDifference = newQuantity - currentProduct.quantity;

                if (product) {
                    product.stock -= quantityDifference;
                    await product.save();
                }

                currentProduct.quantity = newQuantity;
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
        // try {
        //     const carrito = await CartModel.findById(idCarrito);
        //     if (!carrito) {
        //         console.log("No existe ese carrito con el id");
        //         return null;
        //     }
        //     return carrito;
        // } catch (error) {
        //     throw new Error("Error");
        // }
        try {
            const carrito = await CartModel.findById(idCarrito);
            if (!carrito) {
                console.log("No se encontró el carrito con el ID proporcionado:", idCarrito);
                return null; // Retorna null o algún valor indicativo de que no se encontró el carrito
            }
            return carrito.products; // Retorna directamente los productos del carrito
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            throw new Error("Error al obtener el carrito de la base de datos");
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