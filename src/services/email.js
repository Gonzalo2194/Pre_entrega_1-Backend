const nodemailer = require('nodemailer');

class EmailManager{

    constructor(){
        this.transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                auth: {
                    user:"g76654634@gmail.com",
                    pass:"olva wyyf ippo qcjp",
                    }
            });
        }
        async enviarCorreoRestablecimiento(email,first_name,token){
            try {
                const mailOptions = {
                    from: "Test e-commerce <g76654634@gmail.com>",
                    to: email,
                    subject: 'Restablecimiento de Contraseña',
                    html: `
                        <h1>Restablecimiento de Contraseña</h1>
                        <p>Hola ${first_name},</p>
                        <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código para cambiar tu contraseña:</p>
                        <p><strong>${token}</strong></p>
                        <p>Este código expirará en 1 hora.</p>
                        <a href="http://localhost:8080/passwordcambio">Restablecer Contraseña</a>
                        <p>Si no solicitaste este restablecimiento, ignora este correo.</p>
                    `
                };
                await this.transporter.sendMail(mailOptions);
            } catch (error) {
                console.error("Error al enviar correo electrónico:", error);
                throw new Error("Error al enviar correo electrónico");
            }
        }  
    };      


module.exports = EmailManager

