"use strict";

var mongoose = require('mongoose');

var Vacante = mongoose.model('Vacante');

exports.mostrarTrabajos = function _callee(req, res, next) {
  var vacantes;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Vacante.find());

        case 2:
          vacantes = _context.sent;

          if (vacantes) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", next());

        case 5:
          res.render('home', {
            nombrePagina: 'DevJobs',
            tagline: 'Encuentra y publica trabajos',
            barra: true,
            boton: true,
            vacantes: vacantes
          });

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
};