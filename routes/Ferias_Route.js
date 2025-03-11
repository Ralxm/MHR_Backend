const express = require('express');

const router = express.Router();

const controller = require('../controllers/Ferias_Controller');

router.post('/create', controller.feriasCreate);
router.get('/list', controller.feriasList);
router.get('/listAprovadas', controller.feriasListAprovadas); //Lista todas as férias aprovadas
router.get('/listAnalise', controller.feriasListEmAnalise); //Lista todas as férias por aprovar
router.get('/listRejeitadas', controller.feriasListRejeitadas); //Lista todas as férias rejeitadas
router.get('/listUser/:id', controller.feriasListUser); //Lista todas as férias pedidas por um utilizador
router.get('/get/:id', controller.feriasGet);
router.put('/delete/:id', controller.feriasDelete);
router.post('/update/:id', controller.feriasUpdate);

/*router.get('/list/:id_user', feriasController.ferias_lista_user);
router.get('/list', feriasController.ferias_lista);
router.put('/aprovar/:id_solicitacao', feriasController.ferias_aprovar);
router.put('/rejeitar/:id_solicitacao', feriasController.ferias_rejeitar);
router.get('/listAprovadas/:id_user', feriasController.ferias_lista_aprovadas_user);
router.post('/create', feriasController.ferias_adicionar);
router.delete('/delete/:id_solicitacao', feriasController.ferias_apagar);
router.post('/update', feriasController.ferias_atualizar);
router.get('/listDetalhes/:id', feriasController.ferias_detalhes);
*/

module.exports = router;