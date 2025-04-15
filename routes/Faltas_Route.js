const express = require('express');
const router = express.Router();
const controller = require('../controllers/Faltas_Controller');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join('ficheiros/faltas/'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/create', upload.single('justificacao'), controller.faltasCreate);
router.get('/list', controller.faltasList);
router.get('/listUser/:id', controller.faltasListUser); //Lista todas as faltas dadas por um utilizador
router.get('/listTipo/:id', controller.faltasListTipo); //Lista todas as faltas dadas com um certo tipo de falta atribuido
router.get('/listAprovadasValidador/:id', controller.faltasListAprovadasManager); //Lista todas as faltas aprovadas por um dado manager
router.get('/listRejeitadasValidador/:id', controller.faltasListRejeitadasManager); //Lista todas as faltas aprovadas por um dado manager
router.get('/listAprovadas/:id', controller.faltasListAprovadas); //Lista todas as faltas aprovadas
router.get('/listRejeitadas/:id', controller.faltasListRejeitadas); //Lista todas as faltas rejeitadas
router.get('/listAnalise/:id', controller.faltasListAnalise); //Lista todas as faltas em análise
router.get('/get/:id', controller.faltasGet);
router.put('/delete/:id', controller.faltasDelete);
router.post('/update/:id', upload.single('justificacao'), controller.faltasUpdate);
router.post('/justificar/:id', upload.single('justificacao'), controller.faltasJustificar);
/*

router.get('/uploads/files/:justificacao', faltasController.download_file);

router.get('/list/:id_user', faltasController.falta_lista_user);
router.get('/list', faltasController.faltas_lista);
router.get('/list/:id', faltasController.falta_detalhes);
router.post('/upload',  upload.single('justificacao'), faltasController.falta_adicionar);
router.put('/adicionarJustificacao/:id_falta', upload.single('justificacao'), faltasController.falta_adicionar_justificacao);
router.post('/update', faltasController.falta_atualizar);
router.put('/delete', faltasController.falta_apagar);
router.put('/aprovar/:id_falta', faltasController.faltas_aprovar);
router.put('/rejeitar/:id_falta', faltasController.faltas_rejeitar);
*/

module.exports = router;