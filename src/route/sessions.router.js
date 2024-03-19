const express = require('express');
const router = express.Router();
const UserModel = require("../models/user.model")
const {isValidPassword} = require('../utils/hashbcrypt.js');
const passport = require("passport");

//login con passport

router.post("/login", (req, res, next) => {
    passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }, async (err, user, info) => {
        try {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(400).send({ status: "error" });
            }
            // Verificar la contraseña del usuario utilizando isValidPassword
            if (!isValidPassword(req.body.password, user)) {
                return res.status(400).send({ status: "error", message: "Contraseña incorrecta" });
            }
            req.session.user = {
                first_name: user.first_name,
                last_name: user.last_name,
                age: user.age,
                email: user.email
            };
            req.session.login = true;
            res.redirect("/profile");
        } catch (error) {
            next(error);
        }
    })(req, res, next);
});

router.get("/faillogin", async (req, res) => {
    res.send({ error: "Login fallido" });
});



//logout

router.get("/logout", (req, res) => {
    if(req.session.login) {
        req.session.destroy();
    }
    res.redirect ("/login");
});





    
module.exports = router;
