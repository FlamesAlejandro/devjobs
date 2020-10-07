"use strict";

var passport = require('passport');

var mongoose = require('mongoose');

var Vacante = mongoose.model('Vacante');
var Usuarios = mongoose.model('Usuarios');

var crypto = require('crypto');

var enviarEmail = require('../handlers/email');

exports.autenticarUsuarios = passport.authenticate('local', {
  successRedirect: '/administracion',
  failureRedirect: '/iniciar-sesion',
  failureFlash: true,
  badRequestMessage: 'Ambos campos son obligatorios'
}); // Revisar si el usuario esta autenticado o no

exports.verificarUsuario = function (req, res, next) {
  //revisar usuario, esto devuelve true o false si el usuario esta autenticado
  if (req.isAuthenticated()) {
    return next(); //estan autenticados
  } //redireccionar


  res.redirect('/iniciar-sesion');
};

exports.mostrarPanel = function _callee(req, res) {
  var vacantes;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Vacante.find({
            autor: req.user._id
          }));

        case 2:
          vacantes = _context.sent;
          res.render('administracion', {
            nombrePagina: 'Panel de administración',
            tagline: 'Crea y Administra las vacantes desde aquí',
            cerrarSesion: true,
            nombre: req.user.nombre,
            imagen: req.user.imagen,
            vacantes: vacantes
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.cerrarSesion = function (req, res) {
  req.logout();
  req.flash('correcto', 'Cerraste Sesión');
  return res.redirect('/iniciar-sesion');
}; //formulario para reiniciar password


exports.formReestablecerPassword = function (req, res) {
  res.render('reestablecer-password', {
    nombrePagina: 'Reestablecer tu Password',
    tagline: 'Si ya tienes una cuenta pero olvidaste tu password, coloca tu email'
  });
}; //generar token en tabla de usuarios


exports.enviarToken = function _callee2(req, res) {
  var usuario, resetUrl;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Usuarios.findOne({
            email: req.body.email
          }));

        case 2:
          usuario = _context2.sent;

          if (!usuario) {
            req.flash('error', 'No existe esa cuenta');
            res.redirect('/iniciar-sesion');
          } // si el usuario existe. Esto genera un token automaticamente


          usuario.token = crypto.randomBytes(20).toString('hex');
          usuario.expira = Date.now() + 3600000; //Guardar el usuario

          _context2.next = 8;
          return regeneratorRuntime.awrap(usuario.save());

        case 8:
          resetUrl = "http://".concat(req.headers.host, "/reestablecer-password/").concat(usuario.token); //Enviar notificacion por email

          _context2.next = 11;
          return regeneratorRuntime.awrap(enviarEmail.enviar({
            usuario: usuario,
            subject: 'Password reset',
            resetUrl: resetUrl,
            archivo: 'reset'
          }));

        case 11:
          req.flash('correcto', 'Revisa tu email para las indicaciones');
          res.redirect('/iniciar-sesion');

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // VAlida si el token es correcto y el usuario existe


exports.reestablecerPassword = function _callee3(req, res) {
  var usuario;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Usuarios.findOne({
            token: req.params.token,
            expira: {
              $gt: Date.now()
            }
          }));

        case 2:
          usuario = _context3.sent;

          if (usuario) {
            _context3.next = 6;
            break;
          }

          req.flash('error', 'El formulario ya no es valido, intenta de nuevo');
          return _context3.abrupt("return", res.redirect('/reestablecer-password'));

        case 6:
          // Todo ok
          res.render('nuevo-password', {
            nombrePagina: 'Nuevo Password'
          });

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
}; //almacenar la pw en la BDD


exports.nuevoPassword = function _callee4(req, res) {
  var usuario;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Usuarios.findOne({
            token: req.params.token,
            expira: {
              $gt: Date.now()
            }
          }));

        case 2:
          usuario = _context4.sent;

          if (usuario) {
            _context4.next = 6;
            break;
          }

          req.flash('error', 'El formulario ya no es valido, intenta de nuevo');
          return _context4.abrupt("return", res.redirect('/reestablecer-password'));

        case 6:
          // Todo ok, guardar bd
          usuario.password = req.body.password;
          usuario.token = undefined;
          usuario.expira = undefined; // agregar objeto

          _context4.next = 11;
          return regeneratorRuntime.awrap(usuario.save());

        case 11:
          req.flash('correcto', 'Password Modificado Correctamente');
          res.redirect('/iniciar-sesion');

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  });
};