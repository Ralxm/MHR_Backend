const express = require('express');
const router = express.Router();

const controller = require('../controllers/Utilizadores_Controller');

router.post('/create', controller.utilizadoresCreate);
router.get('/list', controller.utilizadoresList);
router.get('/get/:id', controller.utilizadoresGet);
router.put('/delete/:id', controller.utilizadoresDelete);
router.put('/update/:id', controller.utilizadoresDelete);

module.exports = router;