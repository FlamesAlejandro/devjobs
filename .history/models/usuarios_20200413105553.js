const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');

const usuariosSchema = new mongoose.Schema({
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
    expira: Date
});

// hash password
// Antes de guardar .pre
usuariosSchema.pre('save', async function(next){
    // si el password ya esta hasheado
    if(!this.isModified('password')) {
        return next(); //deten la ejecucion
    }
    // si no lo esta
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
    next();
});
// Cuando intentes guardar un usuario con un correo ya usado, o errores similares
usuariosSchema.post('save', function(error, doc, next) {
    if(error.name === 'MongoError' && error.code === 11000 ){
        next('Ese correo ya esta registrado');
    } else {
        next(error);
    }
})
// Autentificar Usuarios
// En mongoose se usa methods para hacer funciones que afecten al modelo
usuariosSchema.methods = {
    compararPassword: function(password) {
        // password del formulario, y el que esta hasheado
        return bcrypt.compareSync(password, this.password);
    }
}

mongoose.exports = mongoose.model('Usuarios', usuariosSchema);