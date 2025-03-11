const express = require('express');
const router = express.Router();

const controller = require('../controllers/Perfis_Controller');

router.post('/create', controller.perfisCreate);
router.get('/list', controller.perfisList);
router.get('/listDepartamento/:id', controller.perfisListDepartamento); //Lista todos os utilizadores que pertencem a um departamento
router.get('/listDistrito/:distrito', controller.perfisListDistrito); //Lista todos os utilizadores que pertencem a um distrito
router.get('/get/:id', controller.perfisGet); //Lista um utilizador por ID Perfil
router.get('/getUtilizador/:id', controller.perfisGetUtilizador); //Lista um utilizador por ID Utilizador
router.get('/getTelemovel/:tlm', controller.perfisGetTelemovel); //Lista um utilizador por Telemovel
router.get('/getEmail/:email', controller.perfisGetEmail); //Lista um utilizador por Email
router.put('/delete/:id', controller.perfisDelete);
router.put('/update/:id', controller.perfisDelete);

module.exports = router;