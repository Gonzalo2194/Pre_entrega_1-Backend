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
    role: {
        type: String,
        default: function () {
            // Establece el rol como "admin" si el correo es adminCoder@coder.com, sino "usuario"
            return this.email === "adminCoder@coder.com" ? "admin" : "usuario";
        },
    },
    
});

const UserModel=mongoose.model("user",userSchema);
module.exports = UserModel;