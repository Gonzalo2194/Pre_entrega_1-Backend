
class ViewsController{
    async renderChat(req, res) {
        res.render("layouts/chat");
    }

    async renderResetPassword(req, res) {
        res.render ("layouts/passwordreset")
    }
    async renderCambioPassword(req, res) {
        res.render ("layouts/passwordcambio")
    }
    async renderConfirmacion(req, res) {
        res.render ("layouts/confirmacion-envio")
    }
}


module.exports = ViewsController;