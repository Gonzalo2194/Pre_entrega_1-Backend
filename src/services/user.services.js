const UserModel = require('../models/user.model');
const { createHash } = require("../utils/hashbcrypt.js");

class UserService {
    async registerUser(userData) {
        try {
            const existingUser = await UserModel.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('El correo electrónico ya está registrado');
            }

            // Crear hash de la contraseña antes de guardar en la base de datos
            const hashedPassword = await createHash(userData.password);
            userData.password = hashedPassword;

            // Crear el nuevo usuario
            const newUser = await UserModel.create(userData);

            return newUser;
        } catch (error) {
            throw error;
        }
    }
    async findByEmail(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        try {
            return await UserModel.findById(id);
        } catch (error) {
            throw error;
        }
    }
    async save(user) {
        try {
            return await user.save();
        } catch (error) {
            throw error;
        }
    }
    async create(user) {
        try {
            return await user.save();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserService;