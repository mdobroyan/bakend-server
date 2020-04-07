var express = require('express');
var app = express();
const path = require('path');
var fs = require('fs');
app.get('/:tipo/:img', (req, resp, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImagen = path.resolve(__dirname, `../upload/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {

        resp.sendFile(pathImagen);
    } else {
        var noImagen = path.resolve(__dirname, `../assets/no-img.jpg`);
        resp.sendFile(noImagen);
    }

    // resp.status(200).json({
    //     ok: true,
    //     mensaje: "peticion realizada correctamente"
    // });

});


module.exports = app;