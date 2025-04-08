const express = require('express');

const router = express.Router();

const controller = require('../controllers/Candidaturas_Controller');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join('ficheiros/candidaturas/'));
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/create', upload.single('curriculo'), controller.candidaturasCreate);
router.get('/list', controller.candidaturasList);
router.get('/listVaga/:id', controller.candidaturasListPorVaga); //Lista todas as candidaturas pertencentes a uma dada vaga
router.get('/listUser/:id', controller.candidaturasListPorUser); //Lista todas as candidaturas realizadas por um dado utilizador
router.get('/listAceites', controller.candidaturasListAceites); //Lista todas as candidaturas aceites
router.get('/listEmAnalise', controller.candidaturasListAnalise); //Lista todas as candidaturas em análise
router.get('/listRejeitadas', controller.candidaturasListRejeitadas); //Lista todas as candidaturas rejeitadas
router.get('/get/:id', controller.candidaturasGet);
router.put('/delete/:id', controller.candidaturasDelete);
router.post('/update/:id', upload.single('curriculo'), controller.candidaturasUpdate);
router.post('/aceitar/:id', controller.candidaturasAceitar); //Aceita uma candidatura
router.post('/rejeitar/:id', controller.candidaturasRejeitar); //Rejeita uma candidatura
router.post('/analisar/:id', controller.candidaturasAnalisar); //Aceita uma candidatura
router.post('/updatePorUser/:id', upload.single('curriculo'), controller.candidaturasUpdatePorUser); //Permite ao utilizador atualizar a sua candidatura a uma vaga

/*
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
*/

module.exports = router;