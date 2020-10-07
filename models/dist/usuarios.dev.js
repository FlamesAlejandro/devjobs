"use strict";

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var bcrypt = require('bcrypt');

var usuariosSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  nombre: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  token: String,
  expira: Date,
  imagen: String
}); // hash password
// Antes de guardar .pre

usuariosSchema.pre('save', function _callee(next) {
  var hash;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (this.isModified('password')) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", next());

        case 2:
          _context.next = 4;
          return regeneratorRuntime.awrap(bcrypt.hash(this.password, 12));

        case 4:
          hash = _context.sent;
          this.password = hash;
          next();

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
}); // Cuando intentes guardar un usuario con un correo ya usado, o errores similares

usuariosSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next('Ese correo ya esta registrado');
  } else {
    next(error);
  }
}); // Autentificar Usuarios
// En mongoose se usa methods para hacer funciones que afecten al modelo

usuariosSchema.methods = {
  compararPassword: function compararPassword(password) {
    // password del formulario, y el que esta hasheado
    return bcrypt.compareSync(password, this.password);
  }
};
mongoose.exports = mongoose.model('Usuarios', usuariosSchema);