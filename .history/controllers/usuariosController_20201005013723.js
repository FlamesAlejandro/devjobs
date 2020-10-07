const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');
const multer = require('multer');
const shortid = require('shortid');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta',
        tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    })
}

exports.validarRegistro = (req, res, next) => {

    // sanitizar los datos
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape();
    req.sanitizeBody('confirmar').escape();

    //validar
    req.checkBody('nombre', 'El nombre es obligatorio').notEmpty();
    req.checkBody('email', 'El email debe ser valido').notEmpty();
    req.checkBody('password', 'El password es obligatorio').notEmpty();
    req.checkBody('confirmar', 'Confirmar es obligatorio').notEmpty();
    //comparar que ambas contraseñas esten iguales
    req.checkBody('confirmar', 'El password es diferente').equals(req.body.password);    

    const errores = req.validationErrors();


    if(errores){
        // si no hay errores, almacenar cada mensaje de error en un flash, ya que errores contiene un arreglo con varios parametros
        req.flash('error', errores.map(error => error.msg));

        res.render('crear-cuenta', {
            nombrePagina: 'Crea tu cuenta',
            tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
            mensajes: req.flash()
        });
        return; 
    }

    //Si todo es correcto
    next();
}

exports.crearUsuario = async ( req, res, next) => {
    // crear usuario
    const usuario = new Usuarios(req.body);

    // salvar usuario, y mostrar mensajes en caso de error
    try {
    
        await usuario.save();
        res.redirect('/iniciar-sesion');

    } catch (e) {
    
        req.flash('error', error);
        res.redirect('/crear-cuenta');

    }   
}

// iniciar sesion
exports.formIniciarSesion = (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesión'
    })
}

// editar perfil
exports.formEditarPerfil = (req, res) => {
    res.render('editar-perfil', {
        nombrePagina: 'Edita tu perfil',
        cerrarSesion: true,
        nombre : req.user.nombre,
        usuario: req.user,
        imagen : req.user.imagen
    })
}

exports.editarPerfil = async (req, res) => {
    // usuario actual
    const usuario = await Usuarios.findById(req.user._id);

    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    // en caso de poner un password nuevo
    if(req.body.password){
        usuario.password = req.body.password
    }

    //imagen
    if(req.file){
        usuario.imagen = req.file.filename;
    }

    //salvar
    await usuario.save();

    req.flash('correcto','Cambios Guardados Correctamente');

    res.redirect('/administracion');
}

exports.validarPerfil = (req, res, next) => {
    // sanitizar
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    if(req.body.password){
        req.sanitizeBody('password').escape();
    }
    //validar
    req.checkBody('nombre', 'El nombre no puede ir vacio').notEmpty();
    req.checkBody('email', 'El correo no puede ir vacio').notEmpty();
    

    const errores = req.validationErrors();

    if(errores){
        //Recargar la vista con los errores
        req.flash('error', errores.map(error => error.msg));

        res.render('editar-perfil', {
            nombrePagina: 'Edita tu perfil',
            cerrarSesion: true,
            nombre : req.user.nombre,
            usuario: req.user,
            mensajes: req.flash()
        })
    }
    next();
}

exports.subirImagen = (req, res, next) => {
    upload(req, res, function(error){
        if(error){
            //error de multer
            if(error instanceof multer.MulterError){
                if(error.code === 'LIMIT_FIILE_SIZE'){
                    req.flash('error','El archivo es muy grande: Máximo 100kb');
                } else {
                    req.flash('error',error.message);
                }
            }
            else {
                //error generado por uno
                req.flash('error', error.message);
            }
            res.redirect('/administracion');
            return;
        } else {

            return next();
        }
    });
    
}

//opciones de multer
const configuracionMulter = {
    // limite de 100 kb
    limits : { fileSize : 100000},

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

