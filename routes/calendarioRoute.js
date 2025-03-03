const express = require('express');

const router = express.Router();

const calendarioController = require('../controllers/calendarioController');

router.get('/list/:id_user', calendarioController.eventos_lista_user);
router.get('/list', calendarioController.eventos_lista);
router.get('/diasFeriasRestantes/:id_user', calendarioController.numero_dias_ferias_restantes);
router.get('/diasFeriasUsados/:id_user', calendarioController.numero_dias_ferias_usados);

module.exports = router;