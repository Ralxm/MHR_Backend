const express = require('express');

const router = express.Router();

const controller = require('../controllers/Projetos_Controller');


router.post('/create', controller.projetoCreate);
router.get('/list', controller.projetoList);
router.get('/listDesenvolvimento', controller.projetoList_EmDesenvolvimento);
router.get('/listConcluidos', controller.projetoList_Concluidos);
router.get('/get/:id', controller.projetoGet);
router.put('/delete:id', controller.projetoDelete);
router.post('/update:id', controller.projetoUpdate);


/*router.get('/listAll', projetosController.projetos_lista);
router.get('/listEmDesenvolvimento', projetosController.projetos_lista_em_desenvolvimento);
router.get('/listDesenvolvidos', projetosController.projetos_lista_desenvolvidos);
router.get('/list/:id_projeto', projetosController.projetos_detalhes);
router.put('/update/desenvolvedores/:id_projeto', projetosController.projetos_adicionar_desenvolvedor);
router.post('/create', upload.none(), projetosController.projetos_adicionar);
router.put('/update/:id_projeto', projetosController.projetos_editar);
router.put('/delete', projetosController.projetos_apagar);
router.get('/list/:id_user', projetosController.projetos_lista_user);
router.get('/listProjetosAtuais/:id_user', projetosController.projetos_lista_user_projetos_atuais);
router.get('/listProjetosConcluidos/:id_user', projetosController.projetos_lista_user_projetos_concluidos);
router.post('/create/comentarios/:id_projeto', projetosController.projetos_comentarios);
router.post('/create/pontosBloqueio/:id_projeto', projetosController.projetos_pontosBloqueio);
router.put('/update/concluirObjetivos/:id_projeto', projetosController.projetos_concluirObjetivos);
router.put('/update/concluirProjeto/:id_projeto', projetosController.projetos_concluirProjeto);
router.put('/update/concluirPontosBloqueio/:id_projeto', projetosController.projetos_concluirPontosBloqueio);*/

module.exports = router;