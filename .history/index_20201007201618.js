const mongoose = require('mongoose');
require('./config/db');

const express = require('express');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
 
const path = require('path');
const router = require('./routes');
//sesiones
const cookieParser = require('cookie-parser');
const session = require('express-session');
// session le pasa variables a mongo store
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const createError = require('http-errors');
const passport = require ('./config/passport');

require('dotenv').config({ path : 'variables.env'});

const app = express();

// validación de campos
app.use(expressValidator());

//habilitar bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



//habilitar handlebars como view
app.engine('handlebars',
    exphbs({
        defaultLayout: 'layout',
        helpers: require('./helpers/handlebars'),
        handlebars: allowInsecurePrototypeAccess(Handlebars)
    })
);

// static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection : mongoose.connection})
}));

//inicializar passport
app.use(passport.initialize());
app.use(passport.session());


// Alertas flash
app.use(flash());

// Middleware
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    next();
});

app.use('/', router());

//Manejo de errores con http errors, esto va al final despues de los middlewares
// 404 error
app.use((req, res, next) => {
    next(createError(404, 'No Encontrado'));
})

//Administracion de los errores
app.use((error, req, res) => {
    res.locals.mensaje = error.message;
    const status = error.status || 500;
    res.locals.status = status;
    res.status(status);
    res.render('error');
})

app.set('view engine', 'handlebars');

// heroku stuff
const host = '0.0.0

app.listen(process.env.PUERTO);