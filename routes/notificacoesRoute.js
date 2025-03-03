const express = require('express');

const router = express.Router();

const notificacoesController = require('../controllers/notificacoesController');

router.get('/list', notificacoesController.notificacoes_lista);


module.exports = router;