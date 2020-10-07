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
})

mongoose.exports = mongoose.model('Usuarios', usuariosSchema);