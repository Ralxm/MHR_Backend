const express = require('express');
const router = express.Router();

const controller = require('../controllers/Utilizadores_Controller');

router.post('/create', controller.utilizadoresCreate);
router.get('/list', controller.utilizadoresList);
router.get('/listTipo/:id', controller.utilizadoresListTipo); //Lista todos os utilizadores de um determinado tipo (Admin, Manager, Interno, Externo, Visitante)
router.get('/listEstado/:est', controller.utilizadoresListEstado); //Lista todos os utilizadores que estão num determinado estado (Conta ativa, desativada)
router.get('/get/:id', controller.utilizadoresGet);
router.put('/delete/:id', controller.utilizadoresDelete);
router.post('/update/:id', controller.utilizadoresDelete);
router.post('/ativar/:id', controller.utilizadoresAtivarConta);
router.post('/desativar/:id', controller.utilizadoresDesativarConta);

module.exports = router;