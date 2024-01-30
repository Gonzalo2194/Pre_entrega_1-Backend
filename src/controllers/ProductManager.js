
/*class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = "products.json";
        this.cargarProductos(); // Cargar productos al iniciar la instancia
    }

    async cargarProductos() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.log("Error al cargar productos:", error.message);
        }
    }

    async guardarProducto() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.log("Error al guardar productos:", error.message);
        }
    }

    static id = 0;

    async addProduct({ title, description, price, thumbnail, code, stock }) {
        const newItem = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            id: ++ProductManager.id,
        };

        const missingField = Object.keys(newItem).find(key => newItem[key] === undefined);

        if (!missingField) {
            this.products.push(newItem);
            await this.guardarProducto();
        } else {
            console.log(`Falta el campo "${missingField}"`);
        }
    }

    getProducts(limit = 0) {
        limit = Number(limit);
        if (limit > 0)
            return this.products.slice(0, limit);
        else return this.products;
    }

    getProductById(id) {
        const product = this.products.find(item => item.id === id);

        if (product) {
            return product;
        } else {
            return null;
        }
    }

    async updateProduct(id, updatedFields) {
        const index = this.products.findIndex(item => item.id === id);

        if (index !== -1) {
            const updatedProduct = { ...this.products[index], ...updatedFields, id };
            this.products[index] = updatedProduct;
            await this.guardarProducto();
            return updatedProduct;
        } else {
            return null;
        }
    }

    async deleteProduct(id) {
        const index = this.products.findIndex(item => item.id === id);

        if (index !== -1) {
            const productName = this.products[index].title;
            this.products.splice(index, 1);
            await this.guardarProducto();
            console.log(`Producto ${productName} eliminado`);
        }
    }
}

module.exports = new ProductManager*/


//______________________________


const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class ProductManager {
    constructor(filePath) {
        this.products = [];
        this.path = filePath;
        this.cargarProductos(); 
    }

    async cargarProductos() {
        try {
            await fs.access(this.path); 
            const response = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(response);
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(`El archivo ${this.path} no existe. Se creará uno nuevo.`);
                await this.guardarProducto();
            } else {
                console.log('Error al cargar productos:', error.message);
            }
        }
    }

    async addProduct({ title, description, price, thumbnail, code, stock,status = true ,category }) {
        const id = uuidv4();
        let newItem = { id, title, description, price, thumbnail, code, stock ,status,category };

        this.products = await this.getProducts();
        this.products.push(newItem);

        await this.guardarProducto();

        return newItem;
    }

    async getProducts(limit = 0) {
        try {
            const response = await fs.readFile(this.path, 'utf-8');
            const responseJSON = JSON.parse(response);

            limit = Number(limit);
    
            if (limit > 0) {
                return responseJSON.slice(0, limit);
            } else {
                return responseJSON;
            }
        } catch (error) {
            console.log('Error al obtener productos:', error.message);
            return [];
        }
    }
    async getProductsById(id) {
        const response = await this.getProducts();
        const product = response.find((product) => product.id === id);
        return product;
    };

    async updateProduct(id, { ...data }) {
        const response = await this.getProducts();
        const index = response.findIndex(product => product.id === id);
    
        if (index !== -1) {
            response[index] = { id, ...data };
            await this.guardarProducto(response); 
            return response[index];
        } else {
            console.log('Producto no encontrado');
            return null;
        }
    }
    
    async deleteProduct(id) {
        const response = await this.getProducts();
        const index = response.findIndex((product) => product.id === id);
    
        if (index !== -1) {
            response.splice(index, 1);
            await this.guardarProducto(response); // Corregir aquí
        }
    }
    
    async guardarProducto(products=this.products) {
        try {
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        } catch (error) {
            console.log('Error al guardar productos:', error.message);
        }
    }
}

module.exports = new ProductManager(path.resolve(__dirname, '../route/products.json'));
