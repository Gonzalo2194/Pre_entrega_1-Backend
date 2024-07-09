const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    first_name:{
        type: String,
        required: true,
    },
    last_name:{ 
        type: String,
        required: false,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    password:{
        type: String,
        required: true,
    },
    age:{
        type: Number,
        required: false,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        enum: ['admin', 'usuario', 'premium'],
        default: function () {
            // Establece el rol como "admin" si el correo contiene ".admin", sino "usuario"
            return this.email.includes(".admin") ? "admin" : "usuario";
        },
    },
    resetToken: {
        token:String,
        expire:Date,
    },
    documents:[{
        name: String,
        reference: String,
    }],
    last_connection: {
        type: Date,
        default: Date.now,
    }

});

const UserModel=mongoose.model("user",userSchema);
module.exports = UserModel;