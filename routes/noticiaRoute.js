const express = require('express');

const router = express.Router();

const noticiaController = require('../controllers/noticiaController');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join('uploads/img/'));
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get('/list', noticiaController.noticias_lista);
router.post('/create', upload.single('imagem'), noticiaController.noticias_adicionar);
router.put('/update/:id_publicacao', upload.single('imagem'), noticiaController.noticias_editar);
router.put('/reenviar/:id_publicacao', upload.single('imagem'), noticiaController.noticias_reenviar);
router.put('/aprovar/:id_publicacao', upload.single('imagem'), noticiaController.noticias_aprovar);
router.get('/list/:id_noticia', noticiaController.noticias_detalhes);


module.exports = router;