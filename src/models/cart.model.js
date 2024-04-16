const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "product",
            required: true,
        },
        producto:[{
            type: mongoose.Schema.Types.ObjectId, 
            ref: "title",
        }],
        
        quantity: {
            type: Number,
            required: true,
        },
    }]
});


const CartModel = mongoose.model("carts", cartSchema);

module.exports = CartModel;