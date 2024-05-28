
class ViewsController{
    async renderChat(req, res) {
        res.render("layouts/chat");
    }
}


module.exports = ViewsController;