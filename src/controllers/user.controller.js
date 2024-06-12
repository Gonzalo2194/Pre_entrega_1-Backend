const UserService = require('../services/user.services');
const passport = require("passport");

const userService = new UserService();

class UserController {
    async register(req, res) {
        try {
            if (req.session.user) {
                return res.status(400).send({ status: 'error', message: 'Usuario ya autenticado' });
            }

            // Llamar al servicio de usuario para registrar el nuevo usuario
            const newUser = await userService.registerUser(req.body);

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
}

module.exports = UserController;