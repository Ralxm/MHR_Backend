const express = require('express');

const router = express.Router();

const controller = require('../controllers/Empresa_Controller');

router.get('/get', controller.empresaGet);
router.post('/update', controller.empresa_editar);

module.exports = router;