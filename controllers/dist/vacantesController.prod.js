"use strict";var mongoose=require("mongoose"),Vacante=mongoose.model("Vacante"),multer=require("multer"),shortid=require("shortid");exports.formularioNuevaVacante=function(e,r){r.render("nueva-vacante",{nombrePagina:"Nueva Vacante",tagline:"Llena el formulario y publica tu vacante",cerrarSesion:!0,nombre:e.user.nombre})},exports.agregarVacante=function(r,a){var n,t;return regeneratorRuntime.async(function(e){for(;;)switch(e.prev=e.next){case 0:return(n=new Vacante(r.body)).autor=r.user._id,n.skills=r.body.skills.split(","),e.next=5,regeneratorRuntime.awrap(n.save());case 5:t=e.sent,a.redirect("/vacantes/".concat(t.url));case 7:case"end":return e.stop()}})},exports.mostrarVacante=function(r,a,n){var t;return regeneratorRuntime.async(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,regeneratorRuntime.awrap(Vacante.findOne({url:r.params.url}).populate("autor"));case 2:if(t=e.sent){e.next=5;break}return e.abrupt("return",n());case 5:a.render("vacante",{vacante:t,nombrePagina:t.titulo,barra:!0});case 6:case"end":return e.stop()}})},exports.formEditarVacante=function(r,a,n){var t;return regeneratorRuntime.async(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,regeneratorRuntime.awrap(Vacante.findOne({url:r.params.url}));case 2:if(t=e.sent){e.next=5;break}return e.abrupt("return",n());case 5:a.render("editar-vacante",{vacante:t,nombrePagina:"Editar - ".concat(t.titulo),cerrarSesion:!0,nombre:r.user.nombre});case 6:case"end":return e.stop()}})},exports.editarVacante=function(r,a){var n,t;return regeneratorRuntime.async(function(e){for(;;)switch(e.prev=e.next){case 0:return(n=r.body).skills=r.body.skills.split(","),e.next=4,regeneratorRuntime.awrap(Vacante.findOneAndUpdate({url:r.params.url},n,{new:!0,runValidators:!0}));case 4:t=e.sent,a.redirect("/vacantes/".concat(t.url));case 6:case"end":return e.stop()}})},exports.validarVacante=function(e,r,a){e.sanitizeBody("titulo").escape(),e.sanitizeBody("empresa").escape(),e.sanitizeBody("ubicacion").escape(),e.sanitizeBody("salario").escape(),e.sanitizeBody("contrato").escape(),e.sanitizeBody("skills").escape(),e.checkBody("titulo","Agrega un titulo a la vacante").notEmpty(),e.checkBody("empresa","Agrega una empresa a la vacante").notEmpty(),e.checkBody("ubicacion","Agrega una ubicación").notEmpty(),e.checkBody("contrato","Selecciona tipo de contrato").notEmpty(),e.checkBody("skills","Agrega al menos una habilidad").notEmpty();var n=e.validationErrors();n&&(e.flash("error",n.map(function(e){return e.msg})),r.render("nueva-vacante",{nombrePagina:"Nueva vacante",tagline:"Llena el formulario y publica tu aviso",cerrarSesion:!0,nombre:e.user.nombre,mensajes:e.flash()})),a()},exports.eliminarVacante=function(r,a){var n,t;return regeneratorRuntime.async(function(e){for(;;)switch(e.prev=e.next){case 0:return n=r.params.id,e.next=3,regeneratorRuntime.awrap(Vacante.findById(n));case 3:t=e.sent,verificarAutor(t,r.user)?(t.remove(),a.status(200).send("Vacante eliminadad Correctamente")):a.status(403).send("Error");case 5:case"end":return e.stop()}})};var verificarAutor=function(e,r){var a=1<arguments.length&&void 0!==r?r:{};return!!(0<arguments.length&&void 0!==e?e:{}).autor.equals(a._id)};exports.subirCV=function(r,a,n){upload(r,a,function(e){return e?(e instanceof multer.MulterError&&"LIMIT_FIILE_SIZE"===e.code?r.flash("error","El archivo es muy grande: Máximo 200kb"):r.flash("error",e.message),void a.redirect("back")):n()})};var configuracionMulter={limits:{fileSize:2e5},storage:fileStorage=multer.diskStorage({destination:function(e,r,a){a(null,__dirname+"../../public/uploads/cv")},filename:function(e,r,a){var n=r.mimetype.split("/")[1];a(null,"".concat(shortid.generate(),".").concat(n))}}),fileFilter:function(e,r,a){"application/pdf"===r.mimetype?a(null,!0):a(new Error("Formato no valido"),!1)}},upload=multer(configuracionMulter).single("cv");exports.contactar=function(r,a,n){var t,o;return regeneratorRuntime.async(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,regeneratorRuntime.awrap(Vacante.findOne({url:r.params.url}));case 2:if(t=e.sent){e.next=5;break}return e.abrupt("return",n());case 5:return o={nombre:r.body.nombre,email:r.body.email,cv:r.file.filename},t.candidatos.push(o),e.next=9,regeneratorRuntime.awrap(t.save());case 9:r.flash("correcto","Se envió tu curriculum correctamente"),a.redirect("/");case 11:case"end":return e.stop()}})},exports.mostrarCandidatos=function(r,a,n){var t;return regeneratorRuntime.async(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,regeneratorRuntime.awrap(Vacante.findById(r.params.id));case 2:if((t=e.sent).autor!=r.user._id.toString())return e.abrupt("return",n());e.next=5;break;case 5:if(t){e.next=7;break}return e.abrupt("return",n());case 7:a.render("candidatos",{nombrePagina:"Candidatos Vacante - ".concat(t.titulo),cerrarSesion:!0,nombre:r.user.nombre,imagen:r.user.imagen,candidatos:t.candidatos});case 8:case"end":return e.stop()}})},exports.buscarVacantes=function(r,a){var n;return regeneratorRuntime.async(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,regeneratorRuntime.awrap(Vacante.find({$text:{$search:r.body.q}}));case 2:n=e.sent,a.render("home",{nombrePagina:"Resultados de búsqueda : ".concat(r.body.q),barra:!0,vacantes:n});case 4:case"end":return e.stop()}})};