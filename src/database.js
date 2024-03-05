const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://gonzalosoto2194:Yanigonza0721@cluster0.rp4awlz.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(()=>console.log("conectados a la BD"))
    .catch(()=>console.log("error en conexion"))