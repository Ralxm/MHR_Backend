const express = require('express');

const router = express.Router();

const notificacoesController = require('../controllers/Notificacoes_Controller');

router.get('/listManager', notificacoesController.notificacoesListManager);
router.get('/listUser/:id', notificacoesController.notificacoesListUser);


module.exports = router;