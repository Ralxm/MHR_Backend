const express = require('express');
const router = express.Router();

const controller = require('../controllers/Linha_Temporal_Controller');

router.post('/create', controller.linhaTemporalCreate);
router.get('/list', controller.linhaTemporalList);
router.get('/listProjeto/:id', controller.linhaTemporalListProjeto); //Lista todas os pontos da linha pertencentes a um projeto
router.get('/listIdeia/:id', controller.linhaTemporalListIdeia); //Lista todas os pontos da linha pertencentes a uma ideia
router.get('/get/:id', controller.linhaTemporalGet);
router.put('/delete/:id', controller.linhaTemporalDelete);
router.put('/update/:id', controller.linhaTemporalUpdate);

module.exports = router;