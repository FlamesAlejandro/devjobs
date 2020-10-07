"use strict";

var mongoose = require('mongoose');

require('./config/db');

var express = require('express');

var Handlebars = require('handlebars');

var exphbs = require('express-handlebars');

var _require = require('@handlebars/allow-prototype-access'),
    allowInsecurePrototypeAccess = _require.allowInsecurePrototypeAccess;

var path = require('path');

var router = require('./routes'); //sesiones


var cookieParser = require('cookie-parser');

var session = require('express-session'); // session le pasa variables a mongo store


var MongoStore = require('connect-mongo')(session);

var bodyParser = require('body-parser');

var expressValidator = require('express-validator');

var flash = require('connect-flash');

var createError = require('http-errors');

var passport = require('./config/passport');

require('dotenv').config({
  path: 'variables.env'
});

var app = express(); //habilitar bodyparser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); // validación de campos

app.use(expressValidator()); //habilitar handlebars como view

app.engine('handlebars', exphbs({
  defaultLayout: 'layout',
  helpers: require('./helpers/handlebars'),
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.use(cookieParser());
app.use(session({
  secret: process.env.SECRETO,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
})); //inicializar passport

app.use(passport.initialize());
app.use(passport.session()); // Alertas flash

app.use(flash()); // Middleware

app.use(function (req, res, next) {
  res.locals.mensajes = req.flash();
  next();
}); // static files

app.use(express["static"](path.join(__dirname, 'public')));
app.use('/', router()); //Manejo de errores con http errors, esto va al final despues de los middlewares
// 404 error

app.use(function (req, res, next) {
  next(createError(404, 'No Encontrado'));
}); //Administracion de los errores

app.use(function (error, req, res) {
  res.locals.mensaje = error.message;
  var status = error.status || 500;
  res.locals.status = status;
  res.status(status);
  res.render('error');
});
app.set('view engine', 'handlebars');
app.listen(process.env.PUERTO);