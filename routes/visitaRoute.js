const express = require('express');

const router = express.Router();

const visitaController = require('../controllers/visitaController');


const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join('uploads/img/'));
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get('/list', visitaController.visitas_lista);
router.get('/list/:id', visitaController.visitas_detalhes);
router.post('/create', upload.single('imagem'), visitaController.visitas_adicionar);
router.put('/update/:id_publicacao', upload.single('imagem'), visitaController.visitas_editar);
router.put('/reenviar/:id_publicacao', upload.single('imagem'), visitaController.visitas_reenviar);
router.put('/delete', visitaController.visitas_eliminar);
router.put('/aprovar/:id_publicacao', upload.single('imagem'), visitaController.visitas_aprovar);

module.exports = router;