const express = require('express');
const router = express.Router();
const UserModel = require("../models/user.model.js");
const {createHash} = require("../utils/hashbcrypt.js");

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
            password : createHash (password),
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
