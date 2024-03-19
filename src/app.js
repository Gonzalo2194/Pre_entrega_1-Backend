const express = require('express');
const app = express();
const PUERTO = 8080;
require('../src/database.js');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const ProductManager = require('./controllers/product.manager-db');
const CartManager = require('./controllers/cart.manager-db');
const exphbs = require('express-handlebars');
const viewsRouter = require('../src/route/views.router.js');
const productsRouter = require('../src/route/products.router');
const cartRouter = require('../src/route/cart.router');
const socket = require('socket.io');
const userRouter = require('../src/route/user.router.js');
const UserModel = require('./models/user.model.js');
const passport = require('passport'); // Importa el módulo passport
const LocalStrategy = require('passport-local').Strategy; // Importa la estrategia local de passport
const initializePassport = require('./config/config.passport.js');
const sessionRouter = require('../src/route/sessions.router.js');






// Configuración de Handlebars
const hbs = exphbs.create({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './src/views');
app.use(express.static('./src/public'));
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// Configuración de express-session
app.use(session({      
    secret: "secretCoder",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://gonzalosoto2194:Yanigonza0721@cluster0.rp4awlz.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0",
        ttl: 1000
    })
}));

////////////////////////////////

initializePassport();
app.use(passport.initialize());
app.use(passport.session());


////////////////////////////////
app.use("/api/sessions", sessionRouter); // Ruta de sesión
// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);
app.use("/api/users", userRouter); // Ruta login



const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando desde ${PUERTO}`);
});

const productManager = new ProductManager();
const io = socket(httpServer);

io.on("connection", async (socket) => {
    console.log("Un cliente se conectó conmigo");

    // Emitir array de productos al cliente que se conectó:
    socket.emit("productos", await productManager.getProducts());

    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);

        // Emitir el array actualizado de productos después de eliminar 
        io.emit("productos", await productManager.getProducts());
    });

    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto);
        io.emit("productos", await ProductManager.getProducts());
    });
});

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

//Register:

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
            const user = await UserModel.findById(req.session.user._id);
            if (!user) {
                res.render('layouts/profile', { user });
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
