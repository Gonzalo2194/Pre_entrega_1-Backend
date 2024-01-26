const express = require('express');
const app = express();
const PUERTO= 8080;













app.listen(PUERTO,() =>{
    console.log (`escuchando desde ${PUERTO}`)
});
