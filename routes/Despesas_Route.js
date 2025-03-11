const express = require('express');
const multer = require('multer');
const router = express.Router();

const controller = require('../controllers/Despesas_Controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'ficheiros/despesas/');
    },
    filename: function (req, file, cb) {
        cb(null, path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/create', upload.single('anexo'), controller.despesasCreate);
router.get('/list', controller.despesasList);
router.get('/get/:id', controller.despesasGet);
router.put('/delete:id', controller.despesasDelete);
router.post('/update:id',upload.single('anexo'), controller.despesasUpdate);

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