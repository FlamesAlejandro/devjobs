const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = () => {
    //pagina principal
    router.get('/', homeController.mostrarTrabajos);

    //Crear vacantes
    router.get('/vacantes/nueva', 
        authController.verificarUsuario,
        vacantesController.formularioNuevaVacante);
    router.post('/vacantes/nueva', 
        authController.verificarUsuario,
        vacantesController.agregarVacante);

    //Mostrar vacantes
    router.get('/vacantes/:url', vacantesController.mostrarVacante);

    //editar vacante
    router.get('/vacantes/editar/:url', 
        authController.verificarUsuario,
        vacantesController.formEditarVacante);
    router.post('/vacantes/editar/:url', 
        authController.verificarUsuario,
        vacantesController.editarVacante);

    //crear cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', 
        usuariosController.validarRegistro,
        usuariosController.crearUsuario);

    // Autentificar Usuarios
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuarios);
    // Cerrar sesion
    router.get('/cerrar-sesion',
        usuariosController.verificarUsuario,
        authController.cerrarSesion);

    // Panel de administracion
    router.get('/administracion', 
        authController.verificarUsuario,
        authController.mostrarPanel);

    //editar perfil
    router.get('/editar-perfil', 
        authController.verificarUsuario,
        usuariosController.formEditarPerfil);
    router.post('/editar-perfil',
        authController.verificarUsuario,
        usuariosController.editarPerfil);

    return router;
}