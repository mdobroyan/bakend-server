//requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// inicializar variables

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//import rutas

var appRoutes = require('./routes/app');
var usuariosRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');


// conexion base de datos

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) {
        throw err;
    }
    console.log("Base de datos en puerto 27017: \x1b[32m%s\x1b[0m", "Online");
});

//rutas

app.use('/usuario', usuariosRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


//escuchar peticiones

app.listen(3000, () => { console.log("Express server escuchando en puerto 3000: \x1b[32m%s\x1b[0m", "Online"); });