const express = require('express');

const router = express.Router();

const controller = require('../controllers/Vaga_Controller');

router.post('/create', controller.vagaCreate);
router.get('/list', controller.vagaList);
router.get('/listDepartamento/:id', controller.vagaList_PorDepartamento);
router.get('/get/:id', controller.vagaGet);
router.put('/delete:id', controller.vagaDelete);
router.post('/update:id', controller.vagaUpdate);

module.exports = router;