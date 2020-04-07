var express = require('express');
var bcryptjs = require('bcryptjs');
var Usuario = require('../models/usuario');
var autenticador = require('../middleware/autenticacion');
var app = express();



//========================================
// Obtener todos los usuarios
//========================================


app.get('/', (req, resp, next) => {


    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email role img')

    .skip(desde)
        .limit(5)

    .exec((err, usuarios) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: "Error al cargar los datos",
                errors: err
            });
        }


        Usuario.count({}, (err, conteo) => {


            resp.status(201).json({
                ok: true,
                usuarios: usuarios,
                total: conteo
            });


        });



    });

});


// //========================================
// // Verificar token
// //========================================

// app.use('/', (req, resp, next) => {

//     var token = req.query.token;

//     jwt.verify(token, SEED, (err, decoded) => {

//         if (err) {
//             return resp.status(401).json({
//                 ok: false,
//                 mensaje: "No esta autorizado, token incorrecto",
//                 errors: err
//             });
//         }

//         next();



//     });

// });



//========================================
// Actualizar usuario
//========================================


app.put('/:id', autenticador.verificacionToken, (req, resp) => {

    var id = req.params.id;

    Usuario.findById(id, (err, usuario) => {

        if (err) {

            return resp.status(500).json({
                ok: false,
                mensaje: "Error al buscar un encontrado",
                errors: err
            });


        }

        if (!usuario) {

            return resp.status(400).json({
                ok: false,
                mensaje: "Usuario no encontrado",
                errors: { message: 'El id no se encuentra en la bd de usuarios' }
            });


        }

        var body = req.body;

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {

                return resp.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar",
                    errors: err
                });


            }

            usuarioGuardado.password = ':)';

            resp.status(200).json({
                ok: true,
                usuario: usuario,
                usuarioToken: req.usuario
            });




        });



    });


});


//========================================
// crear nuevo usuario
//========================================

app.post('/', autenticador.verificacionToken, (req, resp) => {


    var body = req.body;


    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        role: body.role,
        password: bcryptjs.hashSync(body.password, 10),
        img: body.img



    });
    usuario.save((err, usuario) => {

        if (err) {

            return resp.status(400).json({
                ok: false,
                mensaje: "Error al guardar usuario",
                errors: err
            });

        }

        resp.status(201).json({
            ok: true,
            usuario: usuario,
            usuarioToken: req.usuario
        });



    });





});


//========================================
// Borrar un usuario por su id
//========================================


app.delete('/:id', autenticador.verificacionToken, (req, resp) => {


    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuario) => {


        if (err) {

            return resp.status(500).json({
                ok: false,
                mensaje: "Error al borrar usuario",
                errors: err
            });

        }

        if (!usuario) {

            return resp.status(400).json({
                ok: false,
                mensaje: "No existe usuario con ese id",
                errors: err
            });

        }

        resp.status(200).json({
            ok: true,
            usuario: usuario
        });





    });



});



module.exports = app;