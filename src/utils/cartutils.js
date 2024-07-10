const generateUniqueCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = 8;
    let code = '';

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    const timestamp = Date.now().toString(36);
    return code + '-' + timestamp;
}

// Función para calcular el total de la compra
const calcularTotal = (products) => {
    let total = 0;

    products.forEach(item => {
        if (item.product && typeof item.product.price === 'number' && typeof item.quantity === 'number') {
            total += item.product.price * item.quantity;
            console.log(`Producto: ${item.product.title}, Precio Unitario: ${item.product.price}, Cantidad: ${item.quantity}, Subtotal: ${subtotal}`);
            total += subtotal;
        } else {
            console.error('Error: Producto o cantidad inválidos:', item);
        }
    });

    return total;
}


module.exports = {
    generateUniqueCode,
    calcularTotal
}