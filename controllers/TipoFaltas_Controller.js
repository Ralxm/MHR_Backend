var Tipo_Faltas = require('../models/Tipo_Faltas')
const controller = {};

controller.tipoFaltasCreate = async function (req, res){
    const { tipo, descricao } = req.body;
    const data = await Tipo_Faltas.create({
        tipo: tipo,
        descricao: descricao
    })
    .then(function(data){
        res.status(200).json({
            success: true,
            message: "Tipo de falta criado",
            data: data
        })
    })
    .catch(error =>
        res.status(500).json({
            success: false,
            message: "Erro a criar o tipo de falta",
            error: error.message
        })
    )
}

controller.tipoFaltasList = async function (req, res){
    const data = await Tipo_Faltas.findAll({order: ['tipo']})
    .then(function(data) {
        res.status(200).json({
            success: true,
            data: data
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar os tipos de falta",
            error: error.message
        });
    });
}

controller.tipoFaltasGet = async function (req, res){
    const { id } = req.params;
    const data = await Tipo_Faltas.findAll({
        where: { id_tipofalta: id }
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
            message: "Erro a encontrar o tipo de falta",
            error: error
        });
    })
}

controller.tipoFaltasDelete = async function (req, res){
    const { id } = req.params;
    const data = await Tipo_Faltas.destroy({
        where: {id_tipofalta: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Tipo de falta apagado"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a apagar o tipo de falta",
            error: error.message
        });
    })
}

controller.tipoFaltasUpdate = async function (req, res){
    const { id } = req.params;
    const { tipo, descricao } = req.body;
    const data = await Tipo_Faltas.update({
        tipo: tipo,
        descricao: descricao
    },{
        where: {id_tipofalta: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Tipo de falta atualizado"
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Erro a atualizar o tipo de falta",
            error: error.message
        });
    })
}

module.exports = controller;