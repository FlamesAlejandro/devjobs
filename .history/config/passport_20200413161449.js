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
    if(!usuarios) return done(null , false, {
        // done use 2 parametros, error, usuarios y opciones de error
        message: 'Usuario No existente'
    });

    // el usuario existe, usamos la metodo que esta en el modelo
    const verificarPass = usuarios.compararPassword(password);
    if(!verificarPass) return done(null , false, {
        message: 'Password Incorrecto'
    }); 

    // Usuario y password correcto
    return done (null, usuarios);

}));

//funciones de passport por defecto. _id como esta en mongo
passport.serializeUser((usuario, done) => done(null,usuario._id));

passport.deserializeUser(async (id, done) => {
    const usuario = await Usuarios.findById(id).exec();
    return done(null, usuario);
});

module.exports = passport;
