const express = require('express');

const router = express.Router();


const feriasController = require('../controllers/feriasController');

router.get('/list/:id_user', feriasController.ferias_lista_user);
router.get('/list', feriasController.ferias_lista);
router.put('/aprovar/:id_solicitacao', feriasController.ferias_aprovar);
router.put('/rejeitar/:id_solicitacao', feriasController.ferias_rejeitar);
router.get('/listAprovadas/:id_user', feriasController.ferias_lista_aprovadas_user);
router.post('/create', feriasController.ferias_adicionar);
router.delete('/delete/:id_solicitacao', feriasController.ferias_apagar);
router.post('/update', feriasController.ferias_atualizar);
router.get('/listDetalhes/:id', feriasController.ferias_detalhes);

module.exports = router;