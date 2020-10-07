const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

mongoose.connect(process.env.DATABASE, {useNewUrlParser:true,
    useUnifiedTopology: true,});

mongoose.connection.on('error', (error) => {
    console.log(error);
})

// importar modelos
require('../models/vacantes');
require('../models/usuarios');