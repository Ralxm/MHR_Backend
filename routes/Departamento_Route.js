const express = require('express');

const router = express.Router();

const controller = require('../controllers/Departamento_Controller');

router.post('/create', controller.departamentoCreate);
router.get('/list', controller.departamentoList);
router.get('/get/:id', controller.departamentoGet);
router.put('/delete/:id', controller.departamentoDelete);
router.post('/update/:id', controller.departamentoUpdate);


module.exports = router;