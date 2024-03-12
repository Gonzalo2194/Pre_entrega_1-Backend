const express = require('express');
const router = express.Router();
const UserModel = require("../models/user.model.js");

//Login:
    router.post("/sessionlogin", async (req, res) => {
        const { email, password } = req.body;
    
        try {
            const usuario = await UserModel.findOne({ email: email });
    
            if (usuario) {
                // Verificar que req.session esté definido
                if (!req.session) {
                    req.session = {};
                }
                // Identificar si el password es el correcto después de chequear que existe el email
                if (usuario.password === password) {
                    
                    req.session.usuario = usuario;
                    req.session.login = true;
                    
                if (usuario.role === "admin") {
                        req.session.admin = true;
                } else {
                        req.session.admin = false;
                    }
                    return res.status(200).send({ message: "Login correcto" });
                }
    
                res.status(401).send({ error: "Contraseña incorrecta" });
            } else {
                res.status(404).send({ error: "Usuario no encontrado" });
            }
        } catch (error) {
            console.log("Error en el login:", error);
            res.status(400).send({ error: "Error en el inicio de sesión: " + error.message });
        }
    });
    

    //Logout:

    router.get("/logout", (req, res) => {
        if (req.session && req.session.login) {
            req.session.destroy();
        }else{
        res.status(200).send({ message: "Login eliminado" });}
    });

module.exports = router;
