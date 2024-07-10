const express = require('express');
const vrouter = express.Router();
const ViewsController = require("../controllers/viewscontroller.js")
const viewsController = new ViewsController();


vrouter.get('/',viewsController.home);
vrouter.get('/realtimeproducts',viewsController.realtime);
vrouter.get('/productlist',viewsController.productlist);
vrouter.get('/api/cart/:cid',viewsController.cart); 
vrouter.get("/chat", viewsController.renderChat);
vrouter.get("/reset-password", viewsController.renderResetPassword);
vrouter.get("/passwordcambio", viewsController.renderCambioPassword);
vrouter.get("/confirmacion-envio", viewsController.renderConfirmacion);

module.exports = vrouter;









