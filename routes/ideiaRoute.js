const express = require('express');

const router = express.Router();

const ideiasController = require('../controllers/ideiasController');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join('uploads/files/'));
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/create', upload.single('ficheiroComplementar'), ideiasController.adicionar_ideia);
router.get('/uploads/files/:ficheiro_complementar', ideiasController.download_file);

router.get('/listEmEstudo', ideiasController.ideias_lista_em_estudo);
router.get('/listAll', ideiasController.ideias_lista);  
router.put('/aprovar/:id_ideia', ideiasController.aprovar_ideia);
router.put('/rejeitar/:id_ideia', ideiasController.rejeitar_ideia);
router.get('/list/:id_user', ideiasController.ideias_lista_user);
router.put('/reformular/:id_ideia', upload.single('ficheiro_complementar'), ideiasController.ideias_reformular);
router.get('/list/:id_ideia', ideiasController.ideias_detalhes);
router.put('/update/:id_ideia',upload.single('ficheiro_complementar'), ideiasController.ideias_atualizar);

module.exports = router;