const UserService = require('../services/user.services');
const userService = new UserService();
const passport = require("passport");
const CartModel = require("../models/cart.model.js");
const UserModel = require('../models/user.model.js');
const { generarResetToken } = require('../utils/tokenreset.js');
const { createHash, isValidPassword } = require('../utils/hashbcrypt.js');
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
                age: newUser.age,
                
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
        const { email } = req.body;
        try {
            const user = await UserModel.findOne({ email })

            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }
            const token = generarResetToken();
            user.resetToken = {
                token: token,
                expire: new Date(Date.now() + 3600000) //expira en 1 hora
            }
            await user.save();
            //enviar correo de restablecimiento:

            await emailManager.enviarCorreoRestablecimiento(email, user.first_name, token);

            res.redirect("/confirmacion-envio");
        } catch (error) {
            res.status(500).send("Error interno del servidor");
        }
    }

    async renderResetPassword(req, res) {
        const { email, password, token } = req.body;

        try {
            const user = await UserModel.findOne({ email })

            if (!user) {
                return res.render("layouts/passwordcambio", { error: "Usuario no encontrado" })
            }

            const resetToken = user.resetToken;
            if (!resetToken || resetToken.token !== token) {
                return res.render("layouts/passwordreset", { error: "El token de restablecimiento de contraseña es inválido" });
            }

            // Verificar si el token ha expirado
            const now = new Date();
            if (now > resetToken.expiresAt) {
                return res.redirect("layouts/passwordcambio");
            }

            // chequear contraseña para que no sea como la anterior
            if (isValidPassword(password, user)) {
                return res.render("layouts/passwordcambio", { error: "La nueva contraseña no puede ser igual a la anterior" });
            }

            // Actualizar contraseña
            user.password = createHash(password);
            user.resetToken = undefined;
            await user.save();

            // confirmación de cambio de contraseña
            return res.redirect("/login");
        } catch (error) {
            console.error(error);
            return res.status(500).render("layouts/passwordreset", { error: "Error interno del servidor" });
        }

    }

    async cambiarRolPremium(req, res) {
        const { uid } = req.params;

        try {
            const user = await userService.findById(uid);
            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }

            const documentacionRequerida = ["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"];
            const userDocuments = user.documents.map(doc => doc.name);
            const tieneDocumentacion = documentacionRequerida.every(doc => userDocuments.includes(doc));

            if (!tieneDocumentacion) {
                return res.status(400).send("Falta documentación por cargar para ser premium");
            }

            const nuevoRol = user.role === "usuario" ? "premium" : "usuario";
            user.role = nuevoRol;

            await user.save();

            res.json({ role: nuevoRol });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error del servidor");
        }
    }
    async admin(req, res) {
        if (req.user.user.role !== "admin") {
            return res.status(403).send("Acceso denegado");
        }
        res.render("layouts/admin");
    }
}

module.exports = UserController;