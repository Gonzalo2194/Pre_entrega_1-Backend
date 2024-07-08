const UserService = require('../services/user.services');
const passport = require("passport");
const CartModel = require("../models/cart.model.js");
const UserModel = require('../models/user.model.js');
const { generarResetToken } = require('../utils/tokenreset.js');
const userService = new UserService();
const EmailManager = require("../services/email.js")
const emailManager = new EmailManager();
class UserController {
    async register(req, res) {
        try {
            if (req.session.user) {
                return res.status(400).send({ status: 'error', message: 'Usuario ya autenticado' });
            }

            // Llamar al servicio de usuario para registrar el nuevo usuario
            const newUser = await userService.registerUser(req.body);
            //Crear Carrito:
            const nuevoCarrito = new CartModel();
            await nuevoCarrito.save();
            // Si el registro fue exitoso, redirigir al perfil
            req.session.user = {
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                age: newUser.age
            };
            res.redirect('/profile');
        } catch (error) {
            // Manejar el error de correo electrónico duplicado
            if (error.message === 'El correo electrónico ya está registrado') {
                return res.status(400).send({ status: 'error', message: 'El correo electrónico ya está registrado' });
            }
            req.logger.info("error al registrar usuario");
            res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
        }
    }

    async requestResetPassword(req, res) {
        const {email} = req.body;
        try { 
            const user = await UserModel.findOne({email})
            
            if(!user){
                return res.status(404).send("Usuario no encontrado");
            }
            const token = generarResetToken();
            user.resetToken = {
                token: token,
                expire:new Date(Date.now() + 3600000) //expira en 1 hora
            }
                await user.save();
                //enviar correo de restablecimiento:

                await emailManager.enviarCorreoRestablecimiento(email, user.first_name, token);

                res.redirect("/confirmacion-envio");
        } catch (error) {
            res.status(500).send("Error interno del servidor");
        }
    }
}

module.exports = UserController;