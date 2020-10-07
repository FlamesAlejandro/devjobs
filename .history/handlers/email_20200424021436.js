const emailConfig = require('../config/email');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const util = require('util');

let transport = nodemailer.createTransport({
    host : emailConfig.host,
    port : emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
})

exports.email = async(opciones) => {

    // todo lo que este dentro de context se puede usar dentro del template
    const opcionesEmail = {
        from : 'devJobs <noreply@devjobs.com',
        to : opciones.usuario.email,
        subject : opciones.subject,
        context : {
            resetUrl : opciones.resetUrl
        }
    }
}