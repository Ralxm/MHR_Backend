const express = require('express');

const router = express.Router();

const faltasController = require('../controllers/faltasController');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join('uploads/justificacoes/'));
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});


const upload = multer({ storage: storage });
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

module.exports = router;