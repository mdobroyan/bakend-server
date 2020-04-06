var express = require('express');
var bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');


app.post('/', (req, resp) => {

    var body = req.body;


    Usuario.findOne({ email: body.email }, (err, usuario) => {

        if (err) {

            return resp.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuario",
                errors: err
            });


        }

        if (!usuario) {

            return resp.status(400).json({
                ok: false,
                mensaje: "Usuario no encontrado -email",
                errors: { message: 'Usuario o password incorrectos' }
            });


        }

        if (!bcryptjs.compareSync(body.password, usuario.password)) {

            return resp.status(400).json({
                ok: false,
                mensaje: "Usuario no encontrado -pass",
                errors: { message: 'Usuario o password incorrectos' }
            });


        }

        usuario.password = ':)';

        var token = jwt.sign({ usuario }, SEED, { expiresIn: 14400 });

        resp.status(200).json({
            ok: true,
            usuario: usuario,
            id: usuario.id,
            token: token,
            mensaje: 'login ok'
        });







    });




});


module.exports = app;