const mongoose= require('mongoose');

//hago el schema de la collection

const productSchema = new mongoose.Schema ({
    title:{
        type: String,
        required:true,
        },
    description:{
        type: String,
        required:true,
        },
    price:{
        type: Number,
        required:true,
        },
    img:{
        type: String,
        },
    code:{
        type: Number,
        unique:false,
        required:true,
        },
    stock:{
        type: Number,
        required:true,
        },
    category:{
            type: String,
            required:true,
        },
    status:{
        type: Boolean,
        required:true,
        },
    thumbnail:[],
    owner: {
        type: String, 
        required: true, 
        default: 'admin'
        }
});

//defino modelo
const productosModel = mongoose.model("products",productSchema);

//exporto:

module.exports = productosModel;