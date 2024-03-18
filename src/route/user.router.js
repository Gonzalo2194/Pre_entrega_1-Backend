const express = require('express');
const router = express.Router();
const UserModel = require("../models/user.model.js");

//post para generar usuario y almacenar:

/*router.post("/",async (req, res)=>{
    const{first_name,last_name,email,password,age} = req.body;

    try {
        await UserModel.create({first_name,last_name,email,password,age})

        res.status(200).send({message:"Usuario creado con éxito"});
    } catch (error) {
        console.error("Error al crear usuario:", error);
    res.status(400).send({ error: "Error al crear usuario", details: error.message });
    }
});*/


//Handlebars de login:

router.post("/", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    try {
        const existeUsuario = await UserModel.findOne({ email: email });
        if (existeUsuario) {
            return res.status(400).send({ error: "El e-mail ya está siendo utilizado" });
        }
        
        const nuevoUsuario = await UserModel.create({
            first_name,
            last_name,
            email,
            password,
            age,
        });
        if (!req.session) {
            req.session = {};
        }
        req.session.login = true;
        
        req.session.user = { ...nuevoUsuario._doc };

        res.redirect("/profile");

    } catch (error) {
        console.error("Error al crear el usuario:", error);
        res.status(500).send({ error: "Error al crear el usuario" });
    }
});



module.exports = router;
