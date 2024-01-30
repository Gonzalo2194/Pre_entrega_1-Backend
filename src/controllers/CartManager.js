const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const path = require('path');
    
    class CartManager {
        constructor(filePath) {
            this.path = filePath || path.resolve(__dirname, '../route/cart.json');
        }
    
        async getCart() {
            try {
                await fs.access(this.path);
                const response = await fs.readFile(this.path, 'utf-8');
                const responseJSON = JSON.parse(response);
                return responseJSON;
            } catch (error) {
                if (error.code === 'ENOENT') {
                    console.log(`El archivo ${this.path} no existe. Se creará uno nuevo.`);
                    await this.guardarCart([]); 
                    return [];
                } else {
                    throw new Error(`Error al cargar carritos: ${error.message}`);
                }
            }
        }
    
        async getCartsProducts(id) {
            const carts = await this.getCart();
            const cart = carts.find(cart => cart.id === id);
    
            if (cart) {
                return cart.products;
            } else {
                console.log("Carrito no encontrado");
                return [];
            }
        }
    
        async newCart() {
            const id = uuidv4();
            const carts = await this.getCart(); 
            const newCart = { id, products: [] };
            carts.push(newCart);
            await this.guardarCart(carts);
            return newCart;
        }
    
        async addProductToCart(cart_id, product_id) {
            const carts = await this.getCart();
            const index = carts.findIndex(cart => cart.id === cart_id);
    
            if (index !== -1) {
                const cartProducts = await this.getCartsProducts(cart_id);
                const existingProductIndex = cartProducts.findIndex(product => product.product_id === product_id);
    
                if (existingProductIndex !== -1) {
                    cartProducts[existingProductIndex].quantity = cartProducts[existingProductIndex].quantity + 1;
                } else {
                    cartProducts.push({ product_id, quantity: 1 });
                }
    
                carts[index].products = cartProducts;
    
                await this.guardarCart(carts);
                console.log("Producto agregado correctamente");
            } else {
                console.log("Carrito no encontrado");
            }
        }
    
        async guardarCart(carts) {
            try {
                await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
            } catch (error) {
                throw new Error(`Error al guardar carritos: ${error.message}`);
            }
        }
    }
    
    module.exports = new CartManager();
    