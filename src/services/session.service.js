const UserModel = require("../models/user.model")

class SessionService {
    async loginUser(email, password) {
        try {
            const user = await UserModel.findOne({ email });
            return user;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = SessionService;