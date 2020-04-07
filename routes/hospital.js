var express = require('express');
var Hospital = require('../models/hospital');
var autenticador = require('../middleware/autenticacion');

var app = express();


//========================================
// Listar hospitales
//========================================

app.get('/', (req, resp) => {


    var desde = req.query.desde || 0;
    desde = Number(desde);
    Hospital.find({})

    .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {

            if (err) {

                return resp.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar hospitale)s',
                    errors: err
                });

            }


            Hospital.count({}, (err, conteo) => {

                resp.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total: conteo


                });


            });



        });





});


//========================================
// Crear nuevo Hospital
//========================================

app.post('/', autenticador.verificacionToken, (req, resp) => {


    var body = req.body;

    var hospital = new Hospital({

        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id

    });

    hospital.save((err, hospital) => {


        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: "Error al guardar hospital",
                errors: err
            });


        }

        resp.status(201).json({
            oh: true,
            hospital: hospital
        });

    });




});


//========================================
// Modificar Hospital
//========================================

app.put('/:id', autenticador.verificacionToken, (req, resp) => {


    var id = req.params.id;

    Hospital.findById(id, (err, hospital) => {


        if (err) {

            return resp.status(500).json({
                ok: false,
                mensaje: "Error al buscar hospital",
                errors: err
            });


        }

        if (!hospital) {

            return resp.status(400).json({
                ok: false,
                mensaje: "Hospital no encontrado",
                errors: { message: 'El id no se encuentra en la bd de hospitales' }
            });


        }



        var body = req.body;
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospital) => {


            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar hospital",
                    errors: err
                });


            }

            resp.status(201).json({
                oh: true,
                hospital: hospital
            });

        });







    });






});



//========================================
// Borrar un hospital por su id
//========================================


app.delete('/:id', autenticador.verificacionToken, (req, resp) => {


    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospital) => {


        if (err) {

            return resp.status(500).json({
                ok: false,
                mensaje: "Error al borrar hospital",
                errors: err
            });

        }

        if (!hospital) {

            return resp.status(400).json({
                ok: false,
                mensaje: "No existe hospital con ese id",
                errors: err
            });

        }

        resp.status(200).json({
            ok: true,
            hospital: hospital
        });





    });



});



module.exports = app;