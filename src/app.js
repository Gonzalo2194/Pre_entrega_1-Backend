const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const passport = require('passport'); // Importa el módulo passport
const LocalStrategy = require('passport-local').Strategy; // Importa la estrategia local de passport
const initializePassport = require('./config/config.passport.js');
const session = require('express-session');
const ProductManager = require('./controllers/product.manager-db');
const CartManager = require("./controllers/cart.manager-db.js");
const cartManager = new CartManager();
const CartService = require ("../src/services/cart.services.js");
const cartService = new CartService();
const exphbs = require('express-handlebars');
const viewsRouter = require('../src/route/views.router.js');
const productsRouter = require('../src/route/products.router.js');
const cartRouter = require('../src/route/cart.router');
const socket = require('socket.io');
const userRouter = require('../src/route/user.router.js');
const UserModel = require('./models/user.model.js');
const sessionRouter = require('../src/route/sessions.router.js');
const productManager = new ProductManager();
const ViewsController = require("../src/controllers/viewscontroller.js");
const viewsController = new ViewsController();
const AddLogger = require("../src/utils/loggers.js");
const dotenv = require("dotenv");
dotenv.config();
const SocketManager = require("./socket/socket.manager.js");

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// Configuración de Handlebars

const hbs = exphbs.create({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        multiply: (a, b) => a * b
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.static('./src/public'));
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(AddLogger.middleware());
// Configuración de express-session

app.use(session({      
    secret: "secretCoder",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://gonzalosoto2194:Yanigonza0721@cluster0.rp4awlz.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0",
        ttl: 8000
    })
}));

const main = async () => {
    await mongoose.connect("mongodb+srv://gonzalosoto2194:Yanigonza0721@cluster0.rp4awlz.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0");
}

main();

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/sessions", sessionRouter); // Ruta de sesión
// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);
app.use("/api/users", userRouter); // Ruta login

const PUERTO = process.env.NODE_ENV === 'production' ? process.env.PORT_PROD : process.env.PORT_DEV || 8080;
const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando desde ${PUERTO}`);
});

// Websocket:
new SocketManager(httpServer);

app.get("/login", (req, res) => {
    if (req.session.login) {
        return res.redirect("/profile");
    } else {
        res.render("layouts/login");
    }
});

app.get("/usuario", (req, res) => {
    if (req.session.usuario) {
        return res.send(`El usuario registrado es: ${req.session.usuario.email}`);
    }
    res.send("No hay usuario registrado en la sesión");
});

function auth(req, res, next) {
    if (req.session.login && req.session.admin) {
        return next();
    }
    return res.status(401).send("Error de autorización");
}

// Ruta admin
app.get("/admin", auth, (req, res) => {
    res.send("Bienvenido, administrador");
});

// Register:
app.get('/register', async (req, res) => {
    if (req.session.login) {
        return res.redirect("/profile");
    } else {
        res.render('layouts/register');
    }
});

app.get("/profile", async (req, res) => {
    try {
        if (req.session && req.session.user) {
            const user = await UserModel.findOne({ email: req.session.user.email });
            if (user) {
                let cartId = req.session.cartId;

                if (!cartId) {
                    const nuevoCarrito = await cartService.crearCarrito({ products: [] });
                    cartId = nuevoCarrito._id;
                    req.session.cartId = cartId;
                }
                const isAdmin = user.role === 'admin';
                res.render('layouts/profile', { user, cartId, isAdmin });
            } else {
                res.status(404).send('Usuario no encontrado');
            }
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.get("/chat", (req, res) => viewsController.renderChat(req, res));

// Logger
app.get("/loggertest", (req, res) =>{
    req.logger.debug("Este es un mensaje de debug");
    req.logger.http("Este es un mensaje HTTP");
    req.logger.info("Estamos navegando la app");
    req.logger.warning("¡Cuidado!");
    req.logger.error("Error ocurrido");
    req.logger.fatal("Error fatal!");

    res.send("Logs generados!");
});