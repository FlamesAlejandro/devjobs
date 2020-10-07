"use strict";

// Forma comun de importar un modelo, pero vamos a usar moongose
// const Vacante = require('../models/vacantes');
var mongoose = require('mongoose');

var Vacante = mongoose.model('Vacante');

var multer = require('multer');

var shortid = require('shortid');

exports.formularioNuevaVacante = function (req, res) {
  res.render('nueva-vacante', {
    nombrePagina: 'Nueva Vacante',
    tagline: 'Llena el formulario y publica tu vacante',
    cerrarSesion: true,
    nombre: req.user.nombre
  });
};

exports.agregarVacante = function _callee(req, res) {
  var vacante, nuevaVacante;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // sacar datos del body
          vacante = new Vacante(req.body); //autor de la vacante, el usuario se guarda en request user

          vacante.autor = req.user._id; // crear arreglo de habilidades

          vacante.skills = req.body.skills.split(','); // almacenarlo en la base de datos

          _context.next = 5;
          return regeneratorRuntime.awrap(vacante.save());

        case 5:
          nuevaVacante = _context.sent;
          // redirect
          res.redirect("/vacantes/".concat(nuevaVacante.url));

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}; //Mostrar vacante


exports.mostrarVacante = function _callee2(req, res, next) {
  var vacante;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Vacante.findOne({
            url: req.params.url
          }).populate('autor'));

        case 2:
          vacante = _context2.sent;

          if (vacante) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", next());

        case 5:
          res.render('vacante', {
            vacante: vacante,
            nombrePagina: vacante.titulo,
            barra: true
          });

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}; //Editar Vacante


exports.formEditarVacante = function _callee3(req, res, next) {
  var vacante;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Vacante.findOne({
            url: req.params.url
          }));

        case 2:
          vacante = _context3.sent;

          if (vacante) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", next());

        case 5:
          res.render('editar-vacante', {
            vacante: vacante,
            nombrePagina: "Editar - ".concat(vacante.titulo),
            cerrarSesion: true,
            nombre: req.user.nombre
          });

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.editarVacante = function _callee4(req, res, next) {
  var vacanteActualizada, vacante;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          vacanteActualizada = req.body; // splitear los skills en ,

          vacanteActualizada.skills = req.body.skills.split(','); // parametros de findOne y update

          _context4.next = 4;
          return regeneratorRuntime.awrap(Vacante.findOneAndUpdate({
            url: req.params.url
          }, vacanteActualizada, {
            "new": true,
            runValidators: true
          }));

        case 4:
          vacante = _context4.sent;
          res.redirect("/vacantes/".concat(vacante.url));

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.validarVacante = function (req, res, next) {
  // sanitizar los campos
  req.sanitizeBody('titulo').escape();
  req.sanitizeBody('empresa').escape();
  req.sanitizeBody('ubicacion').escape();
  req.sanitizeBody('salario').escape();
  req.sanitizeBody('contrato').escape();
  req.sanitizeBody('skills').escape(); //validar

  req.checkBody('titulo', 'Agrega un titulo a la vacante').notEmpty();
  req.checkBody('empresa', 'Agrega una empresa a la vacante').notEmpty();
  req.checkBody('ubicacion', 'Agrega una ubicación').notEmpty();
  req.checkBody('contrato', 'Selecciona tipo de contrato').notEmpty();
  req.checkBody('skills', 'Agrega al menos una habilidad').notEmpty();
  var errores = req.validationErrors();

  if (errores) {
    //Recargar la vista con los errores
    req.flash('error', errores.map(function (error) {
      return error.msg;
    }));
    res.render('nueva-vacante', {
      nombrePagina: 'Nueva vacante',
      tagline: 'Llena el formulario y publica tu aviso',
      cerrarSesion: true,
      nombre: req.user.nombre,
      mensajes: req.flash()
    });
  }

  next(); // siguiente middleware
};

exports.eliminarVacante = function _callee5(req, res) {
  var id, vacante;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          id = req.params.id;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Vacante.findById(id));

        case 3:
          vacante = _context5.sent;

          if (verificarAutor(vacante, req.user)) {
            // todo bien
            vacante.remove();
            res.status(200).send('Vacante eliminadad Correctamente');
          } else {
            // no permitido
            res.status(403).send('Error');
          }

        case 5:
        case "end":
          return _context5.stop();
      }
    }
  });
}; //metodo para verificar que el usuario que pida eliminar sea el mismo autor


var verificarAutor = function verificarAutor() {
  var vacante = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var usuario = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!vacante.autor.equals(usuario._id)) {
    return false;
  }

  return true;
}; // Subir archivos en PDF


exports.subirCV = function (req, res, next) {
  upload(req, res, function (error) {
    if (error) {
      //error de multer
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FIILE_SIZE') {
          req.flash('error', 'El archivo es muy grande: Máximo 200kb');
        } else {
          req.flash('error', error.message);
        }
      } else {
        //error generado por uno
        req.flash('error', error.message);
      } // esto te envia a la misma pagina donde cometiste el error


      res.redirect('back');
      return;
    } else {
      return next();
    }
  });
};

var configuracionMulter = {
  // limite de 100 kb
  limits: {
    fileSize: 200000
  },
  storage: fileStorage = multer.diskStorage({
    destination: function destination(req, file, cb) {
      cb(null, __dirname + '../../public/uploads/cv');
    },
    filename: function filename(req, file, cb) {
      // sacar el tipo de archivo que se subio con mimetype
      var extension = file.mimetype.split('/')[1]; // poner un nombre con una id generada para evitar duplicar nombres de la imagen

      cb(null, "".concat(shortid.generate(), ".").concat(extension));
    }
  }),
  fileFilter: function fileFilter(req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      // el callback se ejecuta como true o false : true cuando la imagen se acepta
      cb(null, true);
    } else {
      cb(new Error('Formato no valido'), false);
    }
  }
};
var upload = multer(configuracionMulter).single('cv'); //Termino del subir CV
//almacenar candidatos en la bd

exports.contactar = function _callee6(req, res, next) {
  var vacante, nuevoCandidato;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(Vacante.findOne({
            url: req.params.url
          }));

        case 2:
          vacante = _context6.sent;

          if (vacante) {
            _context6.next = 5;
            break;
          }

          return _context6.abrupt("return", next());

        case 5:
          //all ok
          nuevoCandidato = {
            nombre: req.body.nombre,
            email: req.body.email,
            cv: req.file.filename
          }; //almacenar, candidatos es un arreglo, asi que podemos usar metodos de ellos
          // por si hay o no algun candidato ya en el arreglo .push

          vacante.candidatos.push(nuevoCandidato);
          _context6.next = 9;
          return regeneratorRuntime.awrap(vacante.save());

        case 9:
          //redireccion
          req.flash('correcto', 'Se envió tu curriculum correctamente');
          res.redirect('/');

        case 11:
        case "end":
          return _context6.stop();
      }
    }
  });
};

exports.mostrarCandidatos = function _callee7(req, res, next) {
  var vacante;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(Vacante.findById(req.params.id));

        case 2:
          vacante = _context7.sent;

          if (!(vacante.autor != req.user._id.toString())) {
            _context7.next = 5;
            break;
          }

          return _context7.abrupt("return", next());

        case 5:
          if (vacante) {
            _context7.next = 7;
            break;
          }

          return _context7.abrupt("return", next());

        case 7:
          res.render('candidatos', {
            nombrePagina: "Candidatos Vacante - ".concat(vacante.titulo),
            cerrarSesion: true,
            nombre: req.user.nombre,
            imagen: req.user.imagen,
            candidatos: vacante.candidatos
          });

        case 8:
        case "end":
          return _context7.stop();
      }
    }
  });
}; //buscar vacantes


exports.buscarVacantes = function _callee8(req, res) {
  var vacantes;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(Vacante.find({
            $text: {
              $search: req.body.q
            }
          }));

        case 2:
          vacantes = _context8.sent;
          // mostrar vacantes
          res.render('home', {
            nombrePagina: "Resultados de b\xFAsqueda : ".concat(req.body.q),
            barra: true,
            vacantes: vacantes
          });

        case 4:
        case "end":
          return _context8.stop();
      }
    }
  });
};