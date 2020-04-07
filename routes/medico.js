var express = require('express');
var app = express();
var Medico = require('../models/medico');
var autenticador = require('../middleware/autenticacion');


//========================================
// Listar medicos
//========================================

app.get('/', (req, resp) => {


    var desde = req.query.desde || 0;
    desde = Number(desde);


    Medico.find({})

    .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {

            if (err) {

                return resp.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar medicos',
                    errors: err
                });

            }


            Medico.count({}, (err, conteo) => {

                resp.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: conteo


                });


            });




        });





});


//========================================
// Crear nuevo Medico
//========================================

app.post('/', autenticador.verificacionToken, (req, resp) => {


    var body = req.body;

    var medico = new Medico({

        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital

    });

    medico.save((err, medico) => {


        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: "Error al guardar medico",
                errors: err
            });


        }

        resp.status(201).json({
            oh: true,
            medico: medico
        });

    });




});


//========================================
// Modificar Medico
//========================================

app.put('/:id', autenticador.verificacionToken, (req, resp) => {


    var id = req.params.id;

    Medico.findById(id, (err, medico) => {


        if (err) {

            return resp.status(500).json({
                ok: false,
                mensaje: "Error al buscar medico",
                errors: err
            });


        }

        if (!medico) {

            return resp.status(400).json({
                ok: false,
                mensaje: "Medico no encontrado",
                errors: { message: 'El id no se encuentra en la bd de medicos' }
            });


        }



        var body = req.body;
        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medico) => {


            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar medico",
                    errors: err
                });


            }

            resp.status(201).json({
                oh: true,
                medico: medico
            });

        });







    });






});



//========================================
// Borrar un medico por su id
//========================================


app.delete('/:id', autenticador.verificacionToken, (req, resp) => {


    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medico) => {


        if (err) {

            return resp.status(500).json({
                ok: false,
                mensaje: "Error al borrar medico",
                errors: err
            });

        }

        if (!medico) {

            return resp.status(400).json({
                ok: false,
                mensaje: "No existe medico con ese id",
                errors: err
            });

        }

        resp.status(200).json({
            ok: true,
            medico: medico
        });





    });



});



module.exports = app;