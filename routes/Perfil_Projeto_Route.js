const express = require('express');
const router = express.Router();

const controller = require('../controllers/Perfil_Projeto_Controller');

router.post('/create', controller.perfilProjetoCreate);
router.get('/list', controller.perfilProjetoList);
router.get('/get/:id_projeto/:id_perfil', controller.perfilProjetoGet)
router.get('/get/:id', controller.perfilProjetoGet_Perfil);
router.get('/get/:id', controller.perfilProjetoGet_Projeto)
router.put('/delete/:id_projeto/:id_perfil', controller.perfilProjetoDelete);

module.exports = router;