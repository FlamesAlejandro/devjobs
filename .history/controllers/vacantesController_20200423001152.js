// Forma comun de importar un modelo, pero vamos a usar moongose
// const Vacante = require('../models/vacantes');

const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');
const multer = require('multer');
const shortid = require('shortid');

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
    const vacante = await Vacante.findOne({ url : req.params.url }).populate('autor');

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

exports.validarVacante = (req, res, next) => {
    // sanitizar los campos
    req.sanitizeBody('titulo').escape();
    req.sanitizeBody('empresa').escape();
    req.sanitizeBody('ubicacion').escape();
    req.sanitizeBody('salario').escape();
    req.sanitizeBody('contrato').escape();
    req.sanitizeBody('skills').escape();

    //validar
    req.checkBody('titulo','Agrega un titulo a la vacante').notEmpty();
    req.checkBody('empresa','Agrega una empresa a la vacante').notEmpty();
    req.checkBody('ubicacion','Agrega una ubicación').notEmpty();
    req.checkBody('contrato','Selecciona tipo de contrato').notEmpty();
    req.checkBody('skills','Agrega al menos una habilidad').notEmpty();

    const errores = req.validationErrors();

    if(errores) {
        //Recargar la vista con los errores
        req.flash('error', errores.map(error => error.msg));

        res.render('nueva-vacante', {
            nombrePagina: 'Nueva vacante',
            tagline: 'Llena el formulario y publica tu aviso',
            cerrarSesion : true,
            nombre : req.user.nombre,
            mensajes: req.flash()
        })
    }

    next(); // siguiente middleware
}

exports.eliminarVacante = async (req, res) => {
    const { id } = req.params;

    const vacante = await Vacante.findById(id);

    if(verificarAutor(vacante, req.user)){
        // todo bien
        vacante.remove();
        res.status(200).send('Vacante eliminadad Correctamente');
    }
    else {
        // no permitido
        res.status(403).send('Error');
    }

}

//metodo para verificar que el usuario que pida eliminar sea el mismo autor
const verificarAutor = (vacante = {}, usuario = {}) => {
    if(!vacante.autor.equals(usuario._id)){
        return false
    } 
    return true;
}

// Subir archivos en PDF
exports.subirCV = (req, res, next) => (req, res, next) => {
    upload(req, res, function(error){
        if(error){
            //error de multer
            if(error instanceof multer.MulterError){
                if(error.code === 'LIMIT_FIILE_SIZE'){
                    req.flash('error','El archivo es muy grande: Máximo 200kb');
                } else {
                    req.flash('error',error.message);
                }
            }
            else {
                //error generado por uno
                req.flash('error', error.message);
            }
            res.redirect('back');
            return;
        } else {

            return next();
        }
    });
    
}

const configuracionMulter = {
    // limite de 100 kb
    limits : { fileSize : 200000},

    storage: fileStorage = multer.diskStorage({
        destination : (req, file, cb) => {
            cb(null, __dirname+'../../public/uploads/perfiles');
        },
        filename : (req, file, cb) => {
            // sacar el tipo de archivo que se subio con mimetype
            const extension = file.mimetype.split('/')[1];
            // poner un nombre con una id generada para evitar duplicar nombres de la imagen
            cb(null, `${shortid.generate()}.${extension}`);
        }

    }),
    fileFilter(req, file, cb) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            // el callback se ejecuta como true o false : true cuando la imagen se acepta
            cb(null, true);
        } else {
            cb(new Error('Formato no valido'), false);
        }
    }
    
}

const upload = multer(configuracionMulter).single('imagen');