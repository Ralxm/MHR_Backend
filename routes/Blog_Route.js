const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const controller = require('../controllers/Blog_Controller');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join('ficheiros/blog/'));
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/create', upload.single('imagem'), controller.blogCreate);
router.get('/list', controller.blogList);
router.get('/listUser/:id', controller.blogListUser); //Lista todos as publicações feitas por um dado utilizador
router.get('/list/validadas', controller.blogListValidadas); //Lista todos as publicações aprovadas
router.get('/list/por_validar', controller.blogListPorValidar); //Lista todos as publicações por validar
router.get('/list/rejeitada', controller.blogListRejeitada); //Lista todos as publicações rejeitadas
router.get('/get/:id', controller.blogGet);
router.put('/delete/:id', controller.blogDelete);
router.post('/update/:id', upload.single('imagem'), controller.blogUpdate);
router.post('/aceitar/:id', controller.blogValidar); //Controller para validar uma publicação
router.post('/rejeitar/:id',  controller.blogRejeitar); //Controller para rejeitar uma publicação
router.put('/view/:id',  controller.blogVer); //Controller para aumentar a view de um blog em um

/*router.get('/listAll', blogController.publicacoes_lista);
router.get('/list/validadas', blogController.publicacoes_lista_validadas);
router.get('/list/por_validar', blogController.publicacoes_lista_por_validar);
router.get('/list/:id_publicacao', blogController.publicacao_detalhes);
router.put('/rejeitar/:id_publicacao', blogController.rejeitar_publicacao);
router.get('/list/minhasPublicacoes/:id_user', blogController.minhas_publicacoes);
router.put('/delete/:id_publicacao', blogController.publicacoes_eliminar);
router.put('/naoPublicar/:id_publicacao', blogController.nao_publicar);
router.put('/Publicar/:id_publicacao', blogController.publicar);*/

module.exports = router;