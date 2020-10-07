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