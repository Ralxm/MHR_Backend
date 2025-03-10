const express = require('express');
const router = express.Router();

const controller = require('../controllers/Comentarios_Controller');

router.post('/create', controller.comentarioCreate);
router.get('/list', controller.comentarioList);
router.get('/get/:id', controller.comentarioGet);
router.put('/delete/:id', controller.comentarioDelete);
router.put('/update/:id', controller.comentarioUpdate);

module.exports = router;