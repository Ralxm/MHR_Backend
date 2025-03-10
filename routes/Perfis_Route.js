const express = require('express');
const router = express.Router();

const controller = require('../controllers/Perfis_Controller');

router.post('/create', controller.perfisCreate);
router.get('/list', controller.perfisList);
router.get('/get/:id', controller.perfisGet);
router.put('/delete/:id', controller.perfisDelete);
router.put('/update/:id', controller.perfisDelete);

module.exports = router;