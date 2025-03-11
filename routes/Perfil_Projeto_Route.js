const express = require('express');
const router = express.Router();

const controller = require('../controllers/Perfil_Projeto_Controller');

router.post('/create', controller.perfilProjetoCreate);
router.get('/list', controller.perfilProjetoList);
router.get('/get/:id_projeto/:id_perfil', controller.perfilProjetoGet) //Lista a associação entre um projeto e um user
router.get('/listByUser/:id', controller.perfilProjetoGet_Perfil); //Lista todos os projetos a que um utilizador está associado
router.get('/listByProject/:id', controller.perfilProjetoGet_Projeto) //Lista todos os utilizadores que estão associados a um projeto
router.put('/delete/:id_projeto/:id_perfil', controller.perfilProjetoDelete);

module.exports = router;