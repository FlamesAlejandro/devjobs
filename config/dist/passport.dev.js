"use strict";

var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');

var Usuarios = mongoose.model('Usuarios');
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function _callee(email, password, done) {
  var usuario, verificarPass;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Usuarios.findOne({
            email: email
          }));

        case 2:
          usuario = _context.sent;

          if (usuario) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", done(null, false, {
            // done use 2 parametros, error, usuarios y opciones de error
            message: 'Usuario No existente'
          }));

        case 5:
          // el usuario existe, usamos la metodo que esta en el modelo
          verificarPass = usuario.compararPassword(password);

          if (verificarPass) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", done(null, false, {
            message: 'Password Incorrecto'
          }));

        case 8:
          return _context.abrupt("return", done(null, usuario));

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
})); //funciones de passport por defecto. _id como esta en mongo

passport.serializeUser(function (usuario, done) {
  return done(null, usuario._id);
});
passport.deserializeUser(function _callee2(id, done) {
  var usuario;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Usuarios.findById(id).exec());

        case 2:
          usuario = _context2.sent;
          return _context2.abrupt("return", done(null, usuario));

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
});
module.exports = passport;