var AuditLog = require('../models/AuditLog')
const controller = {};

controller.auditlogCreate = async function (req, res){
    const { utilizador, data_atividade, tipo_atividade, descricao } = req.body;
    const data = await AuditLog.create({
        utilizador: utilizador,
        data_atividade: data_atividade,
        tipo_atividade: tipo_atividade,
        descricao: descricao,
    })
    .then(function(data){
        res.status(200).json({
            success: true,
            message: "Audit Log Criada",
            data: data
        })
    })
    .catch(error =>
        res.status(500).json({
            success: false,
            message: "Erro a criar o Audit Log",
            error: error.message
        })
    )
}

controller.auditlogList = async function (req, res){
    const data = await AuditLog.findAll({order: ['data_atividade']})
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

controller.auditlogGet = async function (req, res){
    const { id } = req.params;
    const data = await AuditLog.findAll({
        where: { id_log: id }
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

controller.auditlogDelete = async function (req, res){
    const { id } = req.params;
    const data = await AuditLog.destroy({
        where: {LOGID: id}
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