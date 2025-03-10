const express = require('express');

const router = express.Router();

const controller = require('../controllers/Blog_Controller');

router.post('/create', controller.blogCreate);
router.get('/list', controller.blogList);
router.get('/get/:id', controller.blogGet);
router.put('/delete:id', controller.blogDelete);
router.post('/update:id', controller.blogUpdate);

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