"use strict";

var mongoose = require('mongoose');

var Usuarios = mongoose.model('Usuarios');

var multer = require('multer');

var shortid = require('shortid');

exports.formCrearCuenta = function (req, res) {
  res.render('crear-cuenta', {
    nombrePagina: 'Crea tu cuenta',
    tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
  });
};

exports.validarRegistro = function (req, res, next) {
  // sanitizar los datos
  req.sanitizeBody('nombre').escape();
  req.sanitizeBody('email').escape();
  req.sanitizeBody('password').escape();
  req.sanitizeBody('confirmar').escape(); //validar

  req.checkBody('nombre', 'El nombre es obligatorio').notEmpty();
  req.checkBody('email', 'El email debe ser valido').notEmpty();
  req.checkBody('password', 'El password es obligatorio').notEmpty();
  req.checkBody('confirmar', 'Confirmar es obligatorio').notEmpty(); //comparar que ambas contraseñas esten iguales

  req.checkBody('confirmar', 'El password es diferente').equals(req.body.password);
  var errores = req.validationErrors();

  if (errores) {
    // si no hay errores, almacenar cada mensaje de error en un flash, ya que errores contiene un arreglo con varios parametros
    req.flash('error', errores.map(function (error) {
      return error.msg;
    }));
    res.render('crear-cuenta', {
      nombrePagina: 'Crea tu cuenta',
      tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
      mensajes: req.flash()
    });
    return;
  } //Si todo es correcto


  next();
};

exports.crearUsuario = function _callee(req, res, next) {
  var usuario;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // crear usuario
          usuario = new Usuarios(req.body); // salvar usuario, y mostrar mensajes en caso de error

          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(usuario.save());

        case 4:
          res.redirect('/iniciar-sesion');
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          req.flash('error', error);
          res.redirect('/crear-cuenta');

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 7]]);
}; // iniciar sesion


exports.formIniciarSesion = function (req, res) {
  res.render('iniciar-sesion', {
    nombrePagina: 'Iniciar Sesión'
  });
}; // editar perfil


exports.formEditarPerfil = function (req, res) {
  res.render('editar-perfil', {
    nombrePagina: 'Edita tu perfil',
    cerrarSesion: true,
    nombre: req.user.nombre,
    usuario: req.user,
    imagen: req.user.imagen
  });
};

exports.editarPerfil = function _callee2(req, res) {
  var usuario;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Usuarios.findById(req.user._id));

        case 2:
          usuario = _context2.sent;
          usuario.nombre = req.body.nombre;
          usuario.email = req.body.email; // en caso de poner un password nuevo

          if (req.body.password) {
            usuario.password = req.body.password;
          } //imagen


          if (req.file) {
            usuario.imagen = req.file.filename;
          } //salvar


          _context2.next = 9;
          return regeneratorRuntime.awrap(usuario.save());

        case 9:
          req.flash('correcto', 'Cambios Guardados Correctamente');
          res.redirect('/administracion');

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.validarPerfil = function (req, res, next) {
  // sanitizar
  req.sanitizeBody('nombre').escape();
  req.sanitizeBody('email').escape();

  if (req.body.password) {
    req.sanitizeBody('password').escape();
  } //validar


  req.checkBody('nombre', 'El nombre no puede ir vacio').notEmpty();
  req.checkBody('email', 'El correo no puede ir vacio').notEmpty();
  var errores = req.validationErrors();

  if (errores) {
    //Recargar la vista con los errores
    req.flash('error', errores.map(function (error) {
      return error.msg;
    }));
    res.render('editar-perfil', {
      nombrePagina: 'Edita tu perfil',
      cerrarSesion: true,
      nombre: req.user.nombre,
      usuario: req.user,
      mensajes: req.flash()
    });
  }

  next();
};

exports.subirImagen = function (req, res, next) {
  upload(req, res, function (error) {
    if (error) {
      //error de multer
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FIILE_SIZE') {
          req.flash('error', 'El archivo es muy grande: Máximo 100kb');
        } else {
          req.flash('error', error.message);
        }
      } else {
        //error generado por uno
        req.flash('error', error.message);
      }

      res.redirect('/administracion');
      return;
    } else {
      return next();
    }
  });
}; //opciones de multer


var configuracionMulter = {
  // limite de 100 kb
  limits: {
    fileSize: 100000
  },
  storage: fileStorage = multer.diskStorage({
    destination: function destination(req, file, cb) {
      cb(null, __dirname + '../../public/uploads/perfiles');
    },
    filename: function filename(req, file, cb) {
      // sacar el tipo de archivo que se subio con mimetype
      var extension = file.mimetype.split('/')[1]; // poner un nombre con una id generada para evitar duplicar nombres de la imagen

      cb(null, "".concat(shortid.generate(), ".").concat(extension));
    }
  }),
  fileFilter: function fileFilter(req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      // el callback se ejecuta como true o false : true cuando la imagen se acepta
      cb(null, true);
    } else {
      cb(new Error('Formato no valido'), false);
    }
  }
};
var upload = multer(configuracionMulter).single('imagen');