const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    products:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity:{
            type:number,
            required:true,
        }
    }
    ]
});


const CartModel = mongoose.model("carts",cartSchema);

module.exports = CartModel;