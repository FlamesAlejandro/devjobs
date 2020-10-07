"use strict";

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var slug = require('slug');

var shortid = require('shortId'); // con schema declaramos las tablas para la bd


var vacantesSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: 'El nombre de la vacante es obligatorio',
    trim: true
  },
  empresa: {
    type: String,
    trim: true
  },
  ubicacion: {
    type: String,
    trim: true,
    required: 'La ubicación es obligatoria'
  },
  salario: {
    type: String,
    "default": 0,
    trim: true
  },
  contrato: {
    type: String,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    lowercase: true
  },
  skills: [String],
  candidatos: [{
    nombre: String,
    email: String,
    cv: String
  }],
  autor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Usuarios',
    required: 'El autor es obligatorio'
  }
}); // Middlewares en mongoose

vacantesSchema.pre('save', function (next) {
  //crear url con los -
  var url = slug(this.titulo);
  this.url = "".concat(url, "-").concat(shortid.generate()); // los guines y el id unico

  next();
}); // crear un indice para el buscador, esto es para evitar problemas, y lo hace mas rapido

vacantesSchema.index({
  titulo: 'text'
});
module.exports = mongoose.model('Vacante', vacantesSchema);