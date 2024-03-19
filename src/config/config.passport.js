const passport = require("passport");
const local = require("passport-local");

const UserModel = require("../models/user.model.js");
const {createHash, isValidPassword} = require("../utils/hashbcrypt.js");

const LocalStrategy = local.Strategy;

const initializePassport = () =>{
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async(req,username,password,done) =>{
        const{first_name,last_name,email,age} = req.body;

        try {
            let user = await UserModel.findOne({ email: email});
            if(user) return done (null,false);

            let newUser= {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }
            
            let result = await UserModel.create(newUser);
            return done (null,result);
        } catch (error) {
            return done (error);
        }

    }))

    passport.use("login", new LocalStrategy({
        usernameField: "email",
    }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                console.log("Usuario inexistente");
                return done(null, false); 
            }
            if (!isValidPassword(password,user)) {
                console.log("Contraseña inválida");
                return done(null, false); 
            }
            // Autenticación exitosa, devolver el usuario
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser(async (id, done) => {
        try {
            let user = await UserModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
})};


module.exports = initializePassport;
