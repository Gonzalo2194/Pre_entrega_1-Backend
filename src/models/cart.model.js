const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    products: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product",
        required: true,
    }],
    quantity: {
        type: Number,
        required: true,
    },
});

const CartModel = mongoose.model("carts", cartSchema);

module.exports = CartModel;