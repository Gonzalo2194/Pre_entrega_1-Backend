const express = require('express');
const app = express();
const PUERTO= 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//app.use("/api/products",productsRouter);










app.listen(PUERTO,() =>{
    console.log (`escuchando desde ${PUERTO}`)
});
