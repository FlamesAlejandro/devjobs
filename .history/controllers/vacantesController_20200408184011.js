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

exports.agregarVacante = async ( req, res) => {
    
    // sacar datos del body
    const vacante = new Vacante(req.body);

    // crear arreglo de habilidades
    vacante.skills = req.body.skills.split(',');

    // almacenarlo en la base de datos
    const nuevaVacante = await vacante.save()

    // redirect
    res.redirect(`/vacantes/${nuevaVacante.url}`);
}

//Mostrar vacante
exports.mostrarVacante = async ( req, res, next ) => {
    const vacante = await Vacante.findOne({ url : req.params.url });

    // si no hay resultados
    if(!vacante) return next();
}