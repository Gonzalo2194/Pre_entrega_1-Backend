const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const userController = new UserController();



router.post('/', userController.register);// Ruta para registrar un nuevo usuario

router.post('/requestPasswordReset', userController.requestResetPassword);
router.post('/reset-password', userController.renderResetPassword);
router.put('/premium/:uid', userController.cambiarRolPremium);



module.exports = router;