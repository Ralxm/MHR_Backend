const express = require('express');
const router = express.Router();

const controller = require('../controllers/TipoUtilizadores_Controller');

router.post('/create', controller.tipoUtilizadoresCreate);
router.get('/list', controller.tipoUtilizadoresList);
router.get('/get/:id', controller.tipoUtilizadoresGet);
router.put('/delete/:id', controller.tipoUtilizadoresDelete);
router.put('/update/:id', controller.tipoUtilizadoresDelete);

module.exports = router;