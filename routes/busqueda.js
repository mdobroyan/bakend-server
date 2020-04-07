var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


//========================================
// Busqueda especifica
//========================================

app.get('/coleccion/:tabla/:busqueda', (req, resp, next) => {


    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var tabla = req.params.tabla;
    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = busquedaUsuarios(busqueda, regex);
            break;
        case 'hospitales':
            promesa = busquedaHospitales(busqueda, regex);
            break;
        case 'medicos':
            promesa = busquedaMedicos(busqueda, regex);
            break;

        default:
            return resp.status(400).json({
                ok: false,
                mensaje: "error en la peticion"
            });

    }

    promesa.then((respuesta) => {

        resp.status(200).json({
            ok: true,
            mensaje: "peticion realizada correctamente",
            [tabla]: respuesta
        });


    });





});


//========================================
// Busqueda General
//========================================
app.get('/todo/:busqueda', (req, resp, next) => {


    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([busquedaHospitales(busqueda, regex),
        busquedaMedicos(busqueda, regex),
        busquedaUsuarios(busqueda, regex)
    ]).then((respuesta) => {

        resp.status(200).json({
            ok: true,
            mensaje: "peticion realizada correctamente",
            hospitales: respuesta[0],
            medicos: respuesta[1],
            usuarios: respuesta[2]
        });



    });





});

function busquedaHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex }).populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {

                    reject('Error en la busqueda de hospitales');
                } else {

                    resolve(hospitales);
                }




            });



    });

}

function busquedaMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {

                    reject('Error en la busqueda de medicos');
                } else {

                    resolve(medicos);
                }




            });



    });


}

function busquedaUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role').or([{ nombre: regex }, { email: regex }]).exec((err, usuarios) => {

            if (err) {

                reject('Error en la busqueda de usuarios', err);
            } else {

                resolve(usuarios);
            }




        });



    });


}



module.exports = app;