const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const controller = require('../controllers/Comentarios_Projetos_Controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'ficheiros/comentarios_projetos/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/create', upload.single('anexo'), controller.comentarioProjetoCreate);
router.get('/list', controller.comentarioProjetoList);
router.get('/listProjeto/:id', controller.comentarioProjetoListPorProjeto); //Lista todos os comentários em um dado projetos 
router.get('/listIdeia/:id', controller.comentarioProjetoListPorIdeia); //Lista todos os comentários em uma dada ideia
router.get('/listUser/:id', controller.comentarioProjetoListPorUser); //Lista todos os comentários feitos por um utilizador em todos os projetos ou ideias
router.get('/get/:id', controller.comentarioProjetoGet);
router.put('/delete/:id', controller.comentarioProjetoDelete);
router.post('/update/:id', upload.single('anexo'), controller.comentarioProjetoUpdate);

module.exports = router;