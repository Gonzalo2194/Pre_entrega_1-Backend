/*const express = require('express');
const router = express.Router();
const UserModel = require("../models/user.model.js");
const {createHash} = require("../utils/hashbcrypt.js");
const passport = require("passport");


router.post('/', passport.authenticate('register', { failureRedirect: '/login' }), async (req, res) => {
    try {

        if (req.session.user) {
            return res.status(400).send({ status: 'error', message: 'Usuario ya autenticado' });
        }

        const { first_name, last_name, age, email } = req.user;

        req.session.user = {
            first_name,
            last_name,
            age,
            email
        };

        res.redirect('/profile');
    } catch (error) {
        console.error('Error al procesar la autenticación del usuario:', error);
        res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
    }
});


module.exports = router;*/

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const userController = new UserController();


// Ruta para registrar un nuevo usuario
router.post('/', userController.register);





module.exports = router;