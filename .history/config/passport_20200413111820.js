const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');

passport.use(new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password'
    const usuarios = await Usuarios.findOne({ email });
    if(!usuario) return done()
}))
