// Forma comun de importar un modelo, pero vamos a usar moongose
// const Vacante = require('../models/vacantes');

const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante'
    })
}

exports.agregarVacante = ( req, res) => {
    
    // sacar datos del body
    const vacante = new Vacante(req.body);

    // crear arreglo de habilidades
    vacante.skills = req.body.skills.split(',');

    // almacenarlo en la base de datos
    const nuevaVacante = await vacante.save();
}