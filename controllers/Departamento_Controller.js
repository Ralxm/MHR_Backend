const Departamento = require('../models/Departamento');
var sequelize = require('../models/database');

const controller = {};

controller.departamentoCreate = async (req, res) => {
    const { nome_departamento, descricao, responsavel_departamento } = req.body;
    const data = await Departamento.create({
        nome_departamento: nome_departamento,
        descricao : descricao,
        responsavel_departamento: responsavel_departamento
    })
    .then(function(data) {
        res.status(200).json({
            success: true,
            message: "Departamento Criado",
            data: data
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Erro a criar o Departamento",
            error: error.message
        })
    });
}

controller.departamentoList = async (req, res) => {
    const data = await Departamento.findAll()
    .then(function(data) {
        res.status(200).json({
            success: true,
            data: data
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar os departamentos",
            error: error.message
        });
    });
}

controller.departamentoGet = async (req, res) => {
    const { id } = req.params;
    const data = await Departamento.findOne({
        where: { id_departamento: id }
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
            message: "Erro a encontrar o departamento",
            error: error
        });
    });
}

controller.departamentoDelete = async (req, res) => {
    const { id } = req.params;
    const data = await Departamento.destroy({
        where: { id_departamento: id }
    })
    .then(function(data) {
        res.status(200).json({
            success: true,
            message: "Departamento apagado"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a apagar o departamento",
            error: error
        });
    });
}

controller.departamentoUpdate = async (req, res) => {
    const { id } = req.params
    const { nome_departamento, descricao, responsavel_departamento } = req.body;
    const data = await Departamento.update({
        nome_departamento: nome_departamento,
        descricao : descricao,
        responsavel_departamento: responsavel_departamento
    }, {
        where: { id_departamento: id }
    })
    .then(function(data) {
        res.status(200).json({
            success: true,
            message: "Departamento atualizado"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a atualizar o departamento",
            error: error
        });
    });
}    



module.exports = controller;