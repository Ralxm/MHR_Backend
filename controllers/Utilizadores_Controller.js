var Utilizadores = require('../models/Utilizadores')
const controller = {};

function getDate(){
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    let today = `${yyyy}-${mm}-${dd}`;
    return today;
}

controller.utilizadoresCreate = async function (req, res){
    const { id_tipo, id_perfil, nome_utilizador, pass, estado } = req.body;
    const data = await Utilizadores.create({
        id_tipo: id_tipo,
        id_perfil: id_perfil,
        nome_utilizador: nome_utilizador,
        pass: pass,
        estado: estado,
        created_at: getDate(),
        updated_at: getDate()
    })
    .then(function(data){
        res.status(200).json({
            success: true,
            message: "Utilizador criado",
            data: data
        })
    })
    .catch(error =>
        res.status(500).json({
            success: false,
            message: "Erro a criar o Utilizador",
            error: error.message
        })
    )
}

controller.utilizadoresList = async function (req, res){
    const data = await Utilizadores.findAll({order: ['nome_utilizador']})
    .then(function(data) {
        res.status(200).json({
            success: true,
            data: data
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar os registos",
            error: error.message
        });
    });
}

controller.utilizadoresGet = async function (req, res){
    const { id } = req.params;
    const data = await Utilizadores.findAll({
        where: { id_utilizador: id }
    })
    .then(function(data) {
        res.status(200).json({
            success: true,
            data: data
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a encontrar o auditlog",
            error: error
        });
    })
}

controller.utilizadoresDelete = async function (req, res){
    const { id } = req.params;
    const data = await Utilizadores.destroy({
        where: {id_utilizador: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "AuditLog Apagado"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a apagar o AuditLog",
            error: error.message
        });
    })
}

controller.utilizadoresUpdate = async function (req, res){
    const { id } = req.params;
    const { id_tipo, id_perfil, nome_utilizador, estado } = req.body;
    const data = await Utilizadores.update({
        id_tipo: id_tipo,
        nome_utilizador: nome_utilizador,
        estado: estado,
        updated_at: getDate()
    },{
        where: {id_utilizador: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "AuditLog Apagado"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a apagar o AuditLog",
            error: error.message
        });
    })
}

module.exports = controller;