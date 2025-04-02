const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const controller = require('../controllers/Despesas_Controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'ficheiros/despesas/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/create', upload.array('anexos'), controller.despesasCreate);
router.get('/list', controller.despesasList);
router.get('/listGestao', controller.despesasListGestao); //Lista 
router.get('/listHistorico', controller.despesasListHistorico); //Lista 
router.get('/listUser/:id', controller.despesasListPorUser); //Lista todas as despesas registadas por utilizadores
router.get('/listAprovadasPor/:id', controller.despesasListAprovadasPorUser); //Lista todas as despesas que foram aprovadas por um dado manager
router.get('/listAprovadasPor/:id', controller.despesasListRejeitadasPorUser); //Lista todas as despesas que foram rejeitadas por um dado manager
router.get('/listAprovadas', controller.despesasListAprovadas); //Lista todas as despesas que foram aprovadas
router.get('/listRejeitadas', controller.despesasListRejeitadas); //Lista todas as despesas que foram rejeitadas
router.get('/listPorAprovar', controller.despesasListPorAprovar); //Lista todas as despesas que estão por aprovar
router.get('/get/:id', controller.despesasGet);
router.put('/delete/:id', controller.despesasDelete);
router.post('/update/:id',upload.array('anexos'), controller.despesasUpdate);

/*router.get('/list/:id_user', despesasController.despesas_lista_user);
router.post('/create', upload.none(),  despesasController.despesas_adicionar);
router.put('/delete/:id_despesa', despesasController.despesas_apagar);
router.get('/list/:id_despesa', despesasController.despesas_detalhes);
router.get('/list', despesasController.despesas_lista);
router.put('/update/aprovar/:id_despesa', despesasController.despesas_aprovar);
router.put('/update/rejeitar/:id_despesa', despesasController.despesas_rejeitar);
router.put('/update/:id_despesa', despesasController.despesas_editar);
*/

module.exports = router;