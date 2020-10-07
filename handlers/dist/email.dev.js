"use strict";

var emailConfig = require('../config/email');

var nodemailer = require('nodemailer');

var hbs = require('nodemailer-express-handlebars');

var util = require('util'); // aqui es distinto que pug, asi se hace en nodemailer


var transport = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  }
}); // utilizar templates de handlebars
//codigo re utilizable, aqui definimos el ViewEngine y la carpeta de Views

transport.use('compile', hbs({
  viewEngine: 'handlebars',
  viewPath: __dirname + '/../views/emails',
  extName: '.handlebars'
}));

exports.email = function _callee(opciones) {
  var opcionesEmail, sendEmail;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // todo lo que este dentro de context se puede usar dentro del template
          opcionesEmail = {
            from: 'devJobs <noreply@devjobs.com',
            to: opciones.usuario.email,
            subject: opciones.subject,
            template: opciones.archivo,
            context: {
              resetUrl: opciones.resetUrl
            }
          };
          sendEmail = util.promisify(transport.sendMail, transport);
          return _context.abrupt("return", sendEmail.call(transport, opcionesEmail));

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};