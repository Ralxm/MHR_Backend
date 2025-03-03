const express = require('express');

const router = express.Router();

const candidaturasController = require('../controllers/candidaturasController');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join('uploads/cv/'));
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('cv'), candidaturasController.upload_file);
router.get('/uploads/files/:ficheiro_complementar', candidaturasController.download_file);
router.get('/count/:id_vaga', candidaturasController.numero_candidaturas_vaga);
router.put('/update/:id', candidaturasController.candidatura_atualizar);
router.delete('/delete', candidaturasController.candidatura_apagar);
router.get('/list/vaga/:id_vaga', candidaturasController.candidatura_detalhes);
router.get('/listAll/:id_vaga', candidaturasController.candidaturas_lista);
router.get('/list/:id_user', candidaturasController.candidaturas_lista_user);
router.get('/listVisitante/:id_user_visitante', candidaturasController.candidaturas_lista_user_visitante);
router.post('/create/userVisitante',upload.single('cv'), candidaturasController.candidatura_criar_userVisitante);

module.exports = router;