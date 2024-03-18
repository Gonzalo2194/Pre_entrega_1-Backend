const express = require('express');
const router = express.Router();
const UserModel = require("../models/user.model")

//Login:
/*router.post("/sessionlogin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuario = await UserModel.findOne({ email: email });
        if (usuario) {
            if (!req.session) {
                req.session = {};
            }
            // Si el password es el correcto después de chequear que existe el email
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
        res.status(500).send({ error: "Error interno del servidor" });
    }
});*/


    //Logout:

   /* router.get("/logout", (req, res) => {
        if (req.session && req.session.login) {
            req.session.destroy();
        }else{
        res.status(200).send({ message: "Login eliminado" });}
    });*/



//login:
router.post("/login", async(req, res) => {
    const {email,password} = req.body;
    try {
        const usuario = await UserModel.findOne({email: email})
        if (usuario) {
            if (usuario.password === password) {
                req.session.login =true;
                req.session.user = {...usuario._doc};

                return res.redirect("/profile");

            }else {
                res.status (401).send({error:"Contraseña no valida"})
            }
        }else{
            res.status(404).send({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(400).send({ error: "Error en login" });
    }
    });









//logout

router.get("/logout", (req, res) => {
    if(req.session.login) {
        req.session.destroy();
    }
    res.redirect ("/login");
});





    
module.exports = router;
