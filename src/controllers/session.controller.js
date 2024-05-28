const SessionService = require('../services/session.service');
const sessionService = new SessionService();
const passport = require('passport');
const { isValidPassword } = require('../utils/hashbcrypt.js');


class SessionController {
    async login(req, res, next) {
        passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }, async (err, user, info) => {
            try {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(400).send({ status: "error" });
                }

                if (!isValidPassword(req.body.password, user)) {
                    return res.status(400).send({ status: "error", message: "Contraseña incorrecta" });
                }
                req.session.user = {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    age: user.age,
                    email: user.email
                };
                req.session.login = true;
                res.redirect("/profile");
            } catch (error) {
                next(error);
            }
        })(req, res, next);
    }

    async failLogin(req, res) {
        res.send({ error: "Login fallido" });
    }

    async logout(req, res) {
        if (req.session.login) {
            req.session.destroy();
        }
        
        res.redirect("/login",);
    }

    async githubLogin(req, res) {

        res.redirect('/auth/github');
    }
    
    async githubCallback(req, res) {
            try {
                req.session.user = req.user;
                req.session.login = true;
                res.redirect("/profile")

            } catch (error) {
                console.error('Error al autenticar en githubCallback:', error);
            res.redirect("/login");
            }}
            
        };


module.exports = SessionController;