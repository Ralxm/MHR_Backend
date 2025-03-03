const express = require('express');

const router = express.Router();

const empresaController = require('../controllers/empresaController');

router.get('/list', empresaController.empresa_lista);
router.get('/list/:id', empresaController.empresa_detalhes);
router.post('/create', empresaController.empresa_adicionar);
router.post('/update', empresaController.empresa_editar);
router.put('/delete', empresaController.empresa_apagar);

module.exports = router;