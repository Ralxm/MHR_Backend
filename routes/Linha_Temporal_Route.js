const express = require('express');
const router = express.Router();

const controller = require('../controllers/Linha_Temporal_Controller');

router.post('/create', controller.linhaTemporalCreate);
router.get('/list', controller.linhaTemporalList);
router.get('/get/:id', controller.linhaTemporalGet);
router.put('/delete/:id', controller.linhaTemporalDelete);
router.put('/update/:id', controller.linhaTemporalUpdate);

module.exports = router;