const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

module.exports = () => {
    router.get('/', (req, res) => {

    });

    return router;
}