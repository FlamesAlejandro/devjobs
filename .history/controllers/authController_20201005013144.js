const passport = require('passport');
const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');
const Usuarios = mongoose.model('Usuarios');
const crypto = require('crypto');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuarios = passport.authenticate('local', {
    successRedirect : '/administracion',
    failureRedirect : '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage : 'Ambos campos son obligatorios'
});

// Revisar si el usuario esta autenticado o no
exports.verificarUsuario = (req, res, next) => {
    //revisar usuario, esto devuelve true o false si el usuario esta autenticado
    if(req.isAuthenticated()){
        return next(); //estan autenticados
    }

    //redireccionar
    res.redirect('/iniciar-sesion');
}

exports.mostrarPanel = async (req, res) => {

    // consultar el usuario autenticado
    const vacantes = await Vacante.find({ autor: req.user._id});

    res.render('administracion', {
        nombrePagina: 'Panel de administración',
        tagline: 'Crea y Administra las vacantes desde aquí',
        cerrarSesion: true,
        nombre : req.user.nombre,
        imagen : req.user.imagen,
        vacantes
    }) 
}

exports.cerrarSesion = ( req, res) => {
    req.logout();
    req.flash('correcto', 'Cerraste Sesión');
    return res.redirect('/iniciar-sesion');
}

//formulario para reiniciar password
exports.formReestablecerPassword = (req, res) => {
    res.render('reestablecer-password',{
        nombrePagina : 'Reestablecer tu Password',
        tagline : 'Si ya tienes una cuenta pero olvidaste tu password, coloca tu email'
    })
}

//generar token en tabla de usuarios
exports.enviarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({ email : req.body.email });

    if(!usuario){
        req.flash('error','No existe esa cuenta');
        return res.redirect('/iniciar-sesion');
    }

    // si el usuario existe. Esto genera un token automaticamente
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expira = Date.now() + 3600000;

    //Guardar el usuario
    await usuario.save();
    const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;

    //Enviar notificacion por email
    await enviarEmail.enviar({
        usuario,
        subject : 'Password reset',
        resetUrl,
        archivo: 'reset'
    })

    req.flash('correcto','Revisa tu email para las indicaciones');
    res.redirect('/iniciar-sesion');
}

// VAlida si el token es correcto y el usuario existe

exports.reestablecerPassword = async (req, res) => {

    //validar token y expira
    const usuario = await Usuarios.findOne({
        token : req.params.token,
        expira : {
            $gt : Date.now()
        }
    });

    if(!usuario) {
        req.flash('error', 'El formulario ya no es valido, intenta de nuevo');
        return res.redirect('/reestablecer-password');
    }

    // Todo ok
    res.render('nuevo-password', {
        nombrePagina : 'Nuevo Password'
    })
}

//almacenar la pw en la BDD
exports.nuevoPassword = async (req, res) => {

    //validar token y expira
    const usuario = await Usuarios.findOne({
        token : req.params.token,
        expira : {
            $gt : Date.now()
        }
    });

    if(!usuario) {
        req.flash('error', 'El formulario ya no es valido, intenta de nuevo');
        return res.redirect('/reestablecer-password');
    }

    // Todo ok, guardar bd
    usuario.password = req.body.password;
    usuario.token = undefined;
    usuario.expira = undefined;

    // agregar objeto
    await usuario.save();

    req.flash('correcto', 'Password Modificado Correctamente');
    res.redirect('/iniciar-sesion');
    
}

