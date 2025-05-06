const express = require('express');
const router = express.Router();

const controller = require('../controllers/Feriados_Controller');

router.post('/create', controller.feriadoCreate);
router.get('/list', controller.feriadoList);
router.put('/delete/:id', controller.feriadoDelete);
router.post('/update/:id', controller.feriadoUpdate);

module.exports = router;