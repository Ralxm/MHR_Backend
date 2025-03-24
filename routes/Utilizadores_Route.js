const express = require('express');
const router = express.Router();
const middleware = require('../middleware')

const controller = require('../controllers/Utilizadores_Controller');

router.post('/login', controller.utilizadoresLogin);
router.post('/create', controller.utilizadoresCreate);
router.get('/list', middleware.checkToken, controller.utilizadoresList);
router.get('/listTipo/:id', middleware.checkToken, controller.utilizadoresListTipo); //Lista todos os utilizadores de um determinado tipo (Admin, Manager, Interno, Externo, Visitante)
router.get('/listEstado/:est', middleware.checkToken, controller.utilizadoresListEstado); //Lista todos os utilizadores que estão num determinado estado (Conta ativa, desativada)
router.get('/get/:id', middleware.checkToken, controller.utilizadoresGet);
router.put('/delete/:id', middleware.checkToken, controller.utilizadoresDelete);
router.post('/update/:id', middleware.checkToken, controller.utilizadoresDelete);
router.post('/ativar/:id', middleware.checkToken, controller.utilizadoresAtivarConta);
router.post('/desativar/:id', middleware.checkToken, controller.utilizadoresDesativarConta);

router.post('/resgatepassword', controller.ResgatePassword);
router.post('/resetpassword', controller.ResetPassword);

module.exports = router;