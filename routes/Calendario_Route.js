const express = require('express');

const router = express.Router();

const controller = require('../controllers/Calendario_Controller');

router.post('/create', controller.calendarioCreate);
router.get('/list', controller.calendarioList);
router.post('/listUser/:id', controller.calendarioListUser); //Mostra o calendário de um dado utilizador
router.get('/get/:id', controller.calendarioGet);
router.put('/delete/:id', controller.calendarioDelete);
router.post('/update/:id', controller.calendarioUpdate);

/*router.get('/list/:id_user', calendarioController.eventos_lista_user);
router.get('/list', calendarioController.eventos_lista);
router.get('/diasFeriasRestantes/:id_user', calendarioController.numero_dias_ferias_restantes);
router.get('/diasFeriasUsados/:id_user', calendarioController.numero_dias_ferias_usados);
*/

module.exports = router;