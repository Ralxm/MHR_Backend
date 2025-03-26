const express = require('express');

const router = express.Router();

const controller = require('../controllers/AuditLog_Controller');

router.post('/create', controller.auditlogCreate);
router.get('/list', controller.auditlogList);
router.get('/get/:id', controller.auditlogGet);
router.put('/delete/:id', controller.auditlogDelete);

module.exports = router;