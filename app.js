//requires
var express = require('express');
var mongoose = require('mongoose');

// inicializar variables

var app = express();

// conexion base de datos

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) {
        throw err;
    }
    console.log("Base de datos en puerto 27017: \x1b[32m%s\x1b[0m", "Online");
});

//Rutas

app.get('/', (req, resp, next) => {

    resp.status(200).json({
        ok: true,
        mensaje: "peticion realizada correctamente"
    });

});

//escuchar peticiones

app.listen(3000, () => { console.log("Express server escuchando en puerto 3000: \x1b[32m%s\x1b[0m", "Online"); });