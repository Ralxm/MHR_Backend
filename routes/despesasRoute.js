const express = require('express');

const router = express.Router();

const despesasController = require('../controllers/despesasController');
const multer = require('multer');
const upload = multer();

router.get('/list/:id_user', despesasController.despesas_lista_user);
router.post('/create', upload.none(),  despesasController.despesas_adicionar);
router.put('/delete/:id_despesa', despesasController.despesas_apagar);
router.get('/list/:id_despesa', despesasController.despesas_detalhes);
router.get('/list', despesasController.despesas_lista);
router.put('/update/aprovar/:id_despesa', despesasController.despesas_aprovar);
router.put('/update/rejeitar/:id_despesa', despesasController.despesas_rejeitar);
router.put('/update/:id_despesa', despesasController.despesas_editar);
module.exports = router;