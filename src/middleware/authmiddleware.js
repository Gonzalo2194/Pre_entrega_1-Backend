const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model.js'); // Ajusta la ruta según tu estructura

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; 
        jwt.verify(token, 'your_jwt_secret', async (err, user) => {
            if (err) {
                return res.sendStatus(403); 
            }
            req.user = await UserModel.findById(user.id); 
            next(); 
        });
    } else {
        res.sendStatus(401); // Unauthorized si no hay token
    }
};

module.exports = authenticateJWT;