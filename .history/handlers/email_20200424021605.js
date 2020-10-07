const emailConfig = require('../config/email');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const util = require('util');

// aqui es distinto que pug, asi se hace en nodemailer

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
        template : opciones.archivo,
        context : {
            resetUrl : opciones.resetUrl
        }
    }

    const sendEmail = util.promisify(transport.sendMail, transport);
    return sendEmail.call(transport, opcionesEmail)
}