const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const homeController = require('../controllers/vacantesController');

module.exports = () => {
    router.get('/', homeController.mostrarTrabajos);

    //Crear vacantes
    router.get('/', vacantesController.formularioNuevaVacante);

    return router;
}