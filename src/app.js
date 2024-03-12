const express = require('express');
const app = express();
const PUERTO = 8080;
const ProductManager = require('./controllers/product.manager-db');
const CartManager = require('./controllers/cart.manager-db');
const cartManager = new CartManager();
const exphbs = require('express-handlebars');
const viewsRouter = require('../src/route/views.router.js');
const productsRouter = require('../src/route/products.router');
const cartRouter = require('../src/route/cart.router');
const socket = require('socket.io');
const session = require('express-session');
const MongoStore = require('connect-mongo') ;
const userRouter = require('../src/route/user.router.js');
const sessionRouter = require('../src/route/sessions.router.js');
require('../src/database.js');
const UserModel = require('./models/user.model.js');
app.use(express.static('public'));

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

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/",viewsRouter);
app.use("/api/users", userRouter);//Ruta login
app.use("/api/sessions", sessionRouter); //Ruta session

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
    });});


        app.use(session({      
        secret: "secretCoder",
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: "mongodb+srv://gonzalosoto2194:Yanigonza0721@cluster0.rp4awlz.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0",
            ttl: 5000
        })
        }));

app.get("/login", (req, res) => {
    let usuario = req.query.usuario;

    req.session.usuario = usuario;
    res.send("Guardamos el usuario por medio de query");
});

app.get("/usuario", (req, res) => {
    if (req.session.usuario) {
        return res.send(`El usuario registrado es: ${req.session.usuario}`);
    }

    res.send("No tenemos un usuario registrado");
});

app.get("/logout",(req, res) => {

        req.session.destroy((error)=>{
            if(!error){
                res.send("Sesión cerrada!");
            }else{
                res.send({status:"error al logout", body: error});
            }
        })
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
