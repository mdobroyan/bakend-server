var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;


exports.verificacionToken = function(req, resp, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return resp.status(401).json({
                ok: false,
                mensaje: "No esta autorizado, token incorrecto",
                errors: err
            });
        }


        req.usuario = decoded.usuario;

        next();




    });



}