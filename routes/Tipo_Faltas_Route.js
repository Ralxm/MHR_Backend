const express = require('express');
const router = express.Router();

const controller = require('../controllers/TipoFaltas_Controller');

router.post('/create', controller.tipoFaltasCreate);
router.get('/list', controller.tipoFaltasList);
router.get('/get/:id', controller.tipoFaltasGet);
router.put('/delete/:id', controller.tipoFaltasDelete);
router.put('/update/:id', controller.tipoFaltasUpdate);

module.exports = router;