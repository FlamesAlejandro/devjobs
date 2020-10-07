// Forma comun de importar un modelo, pero vamos a usar moongose
// const Vacante = require('../models/vacantes');

const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante',
        cerrarSesion: true,
        nombre : req.user.nombre,
    })
}

exports.agregarVacante = async ( req, res) => {
    
    
    // sacar datos del body
    const vacante = new Vacante(req.body);

    //autor de la vacante, el usuario se guarda en request user
    vacante.autor = req.user._id;
    

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

    res.render('vacante', {
        vacante,
        nombrePagina : vacante.titulo,
        barra: true
    })
}

//Editar Vacante
exports.formEditarVacante = async (req, res, next ) => {
    const vacante = await Vacante.findOne({ url : req.params.url });

    if(!vacante) return next();

    res.render('editar-vacante', {
        vacante,
        nombrePagina : `Editar - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre : req.user.nombre,
    })
} 

exports.editarVacante = async (req, res, next) => {
    const vacanteActualizada = req.body;

    // splitear los skills en ,
    vacanteActualizada.skills = req.body.skills.split(',');

    // parametros de findOne y update
    const vacante = await Vacante.findOneAndUpdate({url: req.params.url},
        vacanteActualizada, {
            new: true,
            runValidators: true
        });

        res.redirect(`/vacantes/${vacante.url}`);
}

exports.validarVacante = (req, res) => {
    // sanitizar los campos
    req.sanitizeBody('titulo').escape();
    req.sanitizeBody('empresa').escape();
    req.sanitizeBody('ubicacion').escape();
    req.sanitizeBody('salario').escape();
    req.sanitizeBody('contrato').escape();
    req.sanitizeBody('skills').escape();
}