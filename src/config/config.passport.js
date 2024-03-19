const passport = require("passport");
const local = require("passport-local");
//estrategia github:
const GitHubStrategy = require("passport-github2");

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
})

//Github strategy:

passport.use("github", new GitHubStrategy({
    clientID: "Iv1.970ddf15d6599e68",
    clientSecret: "ffb0f027048a96dc8a05f175039591e3cd249fcb",
    callbackURL: "http://localhost:8080/api/sessions/githubcalback",
}, async(accessToken,refresToken,profile,done)=>{

    try {
        let user = await UserModel.findOne({email: profile._json.email});

        if(!user){
            let newUser = {
                first_name: profile._json.name,
                last_name: "",
                age:22,
                email: profile._json.email,
                password:"secret"
            }
            let result = await UserModel.create(newUser);
            done(null,result);
        }else{
            done(null,user);
        }

    } catch (error) {
        return done(error);
    }
}))

};


module.exports = initializePassport;
