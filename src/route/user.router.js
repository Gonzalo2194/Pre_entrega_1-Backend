const express = require('express');
const router = express.Router();
const UserModel = require("../models/user.model.js");

//post para generar usuario y almacenar:

router.post("/",async (req, res)=>{
    const{first_name,last_name,email,password,age} = req.body;

    try {
        await UserModel.create({first_name,last_name,email,password,age})

        res.status(200).send({message:"Usuario creado con éxito"});
    } catch (error) {
        console.error("Error al crear usuario:", error);
    res.status(400).send({ error: "Error al crear usuario", details: error.message });
    }
});

module.exports = router;
