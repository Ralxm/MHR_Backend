const express = require('express');

const router = express.Router();

const vagaController = require('../controllers/vagaController').controllers;

router.get('/list', vagaController.vaga_lista);
router.get('/list/:id_vaga', vagaController.vaga_detalhes);
router.get('/listEmAberto', vagaController.vagas_em_aberto);
router.post('/create', vagaController.vagas_adicionar);
router.put('/delete', vagaController.vaga_apagar);
router.post('/update', vagaController.vaga_atualizar);
router.put('/vagaAtribuir/:id_candidatura', vagaController.vaga_atribuir);

module.exports = router;