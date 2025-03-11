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
        cb(null, path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/create', upload.single('anexo'), controller.comentarioProjetoCreate);
router.get('/list', controller.comentarioProjetoList);
router.get('/listProjeto/:id', controller.comentarioProjetoListPorProjeto);
router.get('/listIdeia/:id', controller.comentarioProjetoListPorIdeia);
router.get('/listUser/:id', controller.comentarioProjetoListPorUser);
router.get('/get/:id', controller.comentarioProjetoGet);
router.put('/delete:id', controller.comentarioProjetoDelete);
router.post('/update:id',upload.single('anexo'), controller.comentarioProjetoUpdate);

module.exports = router;