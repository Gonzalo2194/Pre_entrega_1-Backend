const socket = require("socket.io");
const ProductManager = require("../controllers/product.manager-db.js");
const productManager = new ProductManager(); 
//const MessageModel = require("../models/message.model.js");

class SocketManager {
    constructor(httpServer) {
        this.io = socket(httpServer);
        this.messages = []; // Inicializar messages
        this.initSocketEvents();
    }

    initSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("Un cliente se conectó conmigo");

            // Emitir array de productos al cliente que se conectó:
            socket.emit("productos", await productManager.getProducts());

            socket.on("eliminarProducto", async (id) => {
                await productManager.deleteProduct(id, this.io);
            });

            // Emitir historial de mensajes al nuevo cliente
            socket.emit("message", this.messages);

            socket.on("message", (data) => {
                this.messages.push(data);
                this.io.emit("message", this.messages);
            });
            
            socket.on("agregarProducto", async (producto) => {
                await productManager.addProduct(producto);
                this.io.emit("productos", await productManager.getProducts());
            });
        });
    }
}

module.exports = SocketManager;