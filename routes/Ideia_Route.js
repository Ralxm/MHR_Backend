const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const controller = require('../controllers/Ideia_Controller');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join('ficheiros/ideias/'));
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/create', upload.single('ficheiro_complementar'), controller.ideiaCreate);
router.get('/list', controller.ideiaList);
router.get('/listAnalise', controller.ideiaList_EmAnalise); //Lista todas as ideias em análise
router.get('/listAprovada', controller.ideiaList_Aprovada); //Lista todas as ideias aprovadas
router.get('/listRejeitada', controller.ideiaList_Rejeitada); //Lista todas as ideias rejeitadas
router.get('/listUser/:id', controller.ideiaListUser); //Lista todas as ideias sugeridas por um dado utilizador
router.get('/get/:id', controller.ideiaGet);
router.put('/delete/:id', controller.ideiaDelete);
router.post('/update/:id', upload.single('ficheiro_complementar'), controller.ideiaUpdate);
router.post('/aceitar/:id', controller.aceitarIdeia);
router.post('/rejeitar/:id', controller.rejeitarIdeia);

/*router.post('/create', upload.single('ficheiroComplementar'), ideiasController.adicionar_ideia);
router.get('/uploads/files/:ficheiro_complementar', ideiasController.downlad_file);

router.get('/listEmEstudo', ideiasController.ideias_lista_em_estudo);
router.get('/listAll', ideiasController.ideias_lista);  
router.put('/aprovar/:id_ideia', ideiasController.aprovar_ideia);
router.put('/rejeitar/:id_ideia', ideiasController.rejeitar_ideia);
router.get('/list/:id_user', ideiasController.ideias_lista_user);
router.put('/reformular/:id_ideia', upload.single('ficheiro_complementar'), ideiasController.ideias_reformular);
router.get('/list/:id_ideia', ideiasController.ideias_detalhes);
router.put('/update/:id_ideia',upload.single('ficheiro_complementar'), ideiasController.ideias_atualizar);
*/

module.exports = router;