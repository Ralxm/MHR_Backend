const express = require('express');

const router = express.Router();

const userVisitanteController = require('../controllers/userVisitanteController');

router.get('/login', userVisitanteController.login_visitante);
router.get('/registo', userVisitanteController.registo_visitante);
router.get('/perfil', userVisitanteController.perfil_visitante);
router.post('/editar_perfil', userVisitanteController.editar_perfil_visitante);
router.put('/eliminar_perfil', userVisitanteController.apagar_perfil_visitante);
router.get('/listar', userVisitanteController.listar_visitantes);

module.exports = router;