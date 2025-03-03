const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const middleware = require('../middleware');
const multer = require('multer');
const upload = multer();

router.post('/login', userController.login_colaborador);
router.post('/registo', userController.registo_colaborador);
router.get('/perfil/:id_user', userController.perfil_colaborador);
router.put('/alterarPass/:id_user', userController.alterar_palavra_passe);
router.get('/list', userController.listar_colaboradores);
router.post('/loginUserVisitante', userController.login_visitante);

module.exports = router;