const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const userController = new UserController();
const UserService = require('../services/user.services.js');
const userService = new UserService();
const upload = require('../middleware/multer.js');


router.post('/', userController.register);// Ruta para registrar un nuevo usuario

router.post('/requestPasswordReset', userController.requestResetPassword);
router.post('/reset-password', userController.renderResetPassword);
router.put('/premium/:uid', userController.cambiarRolPremium);


router.post('/:uid/documents', upload.fields([{ name: "document" }, { name: "products" }, { name: "profile" }]), async (req, res) => {
    const { uid } = req.params;
    const uploadedDocuments = req.files;

    try {
        const user = await userService.findById(uid);

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        if (uploadedDocuments) {
            if (uploadedDocuments.document) {
                user.documents = user.documents.concat(uploadedDocuments.document.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })))
            }

            if (uploadedDocuments.products) {
                user.documents = user.documents.concat(uploadedDocuments.products.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })))
            }

            if (uploadedDocuments.profile) {
                user.documents = user.documents.concat(uploadedDocuments.profile.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })))
            }
        }
        await user.save();
        res.status(200).send("Documentos cargados exitosamente");

    } catch (error) {
        console.log(error);
        res.status(500).send("Error interno del servidor");
    }
})

module.exports = router;