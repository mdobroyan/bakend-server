var express = require('express');
var app = express();
var fileUpload = require('express-fileupload');
var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var fs = require('fs');
// default options
app.use(fileUpload());


app.put('/:tipo/:id', (req, resp, next) => {


    var tipo = req.params.tipo;
    var id = req.params.id;

    var tipos = ['hospitales', 'usuarios', 'medicos'];

    if (tipos.indexOf(tipo) < 0) {

        return resp.status(400).json({
            ok: false,
            mensaje: "path tipo incorrecto"
        });


    }

    if (!req.files) {

        return resp.status(400).json({
            ok: false,
            mensaje: "no viene ningun archivo"
        });

    }

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extension = nombreCortado[nombreCortado.length - 1];
    var extensionesValidas = ['png', 'gif', 'jpg', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {

        return resp.status(400).json({
            ok: false,
            mensaje: "extension no valida",
            error: { message: 'Las extensiones validas son ' + extensionesValidas.join(', ') }
        });


    }

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    var path = `./upload/${tipo}/${nombreArchivo}`;

    archivo.mv(path, (err) => {

        if (err) {

            return resp.status(500).json({
                ok: false,
                mensaje: "error al mover el archivo",
                error: { message: 'error al mover el archivo al siguiente path: ' + path }
            });


        }

        subirPorTipo(tipo, id, nombreArchivo, resp);

        // resp.status(200).json({
        //     ok: true,
        //     mensaje: "archivo movido"
        // });


    });


});


function subirPorTipo(tipo, id, nombreArchivo, resp) {


    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {

                return resp.status(400).json({
                    ok: false,
                    mensaje: "Usuario no existe",
                    errors: { message: 'usuario inexistente' }
                });

            }

            var pathViejo = './upload/usuarios/' + usuario.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = '(:';

                return resp.status(200).json({
                    ok: true,
                    mensaje: "Usuario actualizado",
                    usuario: usuarioActualizado
                });





            });


        });

    }
    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {


            if (!hospital) {

                return resp.status(400).json({
                    ok: false,
                    mensaje: "Hospital no existe",
                    errors: { message: 'hospital inexistente' }
                });

            }


            var pathViejo = './upload/hospitales/' + hospital.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {

                return resp.status(200).json({
                    ok: true,
                    mensaje: "Hospital actualizado",
                    medico: hospitalActualizado
                });

            });

        });






    }
    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {

                return resp.status(400).json({
                    ok: false,
                    mensaje: "Medico no existe",
                    errors: { message: 'medico inexistente' }
                });

            }

            var pathViejo = './upload/medicos/' + medico.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                return resp.status(200).json({
                    ok: true,
                    mensaje: "Medico actualizado",
                    medico: medicoActualizado
                });

            });

        });



    }


}

module.exports = app;