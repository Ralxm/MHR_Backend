const express = require('express');

const router = express.Router();

const departamentoController = require('../controllers/departamentoController');

router.get('/list', departamentoController.departamento_lista);
router.get('/list/:id', departamentoController.departamento_detalhes);
router.post('/create', departamentoController.departamento_adicionar);
router.post('/update', departamentoController.departamento_editar);
router.put('/delete', departamentoController.departamento_apagar);

module.exports = router;