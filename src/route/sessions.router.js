const express = require("express");
const router = express.Router();
const passport = require("passport");
const SessionController = require("../controllers/session.controller");

const sessionController = new SessionController();

router.post("/login", sessionController.login);
router.get("/faillogin", sessionController.failLogin);
router.get("/logout", sessionController.logout);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/githubcalback", passport.authenticate("github", { failureRedirect: "/login" }), sessionController.githubCallback);


module.exports = router;


