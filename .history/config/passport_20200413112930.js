const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');

passport.use(new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password'
}, async (email, password, done) => {
    // done es similar al next
    const usuarios = await Usuarios.findOne({ email });
    if(!usuario) return done(null , false, {
        // done use 2 parametros, error, usuarios y opciones de error
        message: 'Usuario No existente'
    });

    // el usuario existe, usamos la metodo que esta en el modelo
    const verificarPass = usuario.compararPassword(password);
    if(!verificarPass) return done(null , false, {
        message: 'Password Incorrecto'
    }); 

    // Usuario y password correcto
    return done (null, usuario);

}));

//funciones de passport por defecto
passport.serializeUser((usuario, done) => done(null,usuario._id))
