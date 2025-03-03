const Departamento = require('../models/Departamento');
var sequelize = require('../models/database');

const controllers = {};

sequelize.sync();

controllers.departamento_lista = async (req, res) => {
    const data = await Departamento.findAll()
    .then(function(data) {
        return data;
    })
    .catch(error => {
        return error;
    });
    res.json({success: true, data: data});
}

controllers.departamento_detalhes = async (req, res) => {
    const { id } = req.params;
    const data = await Departamento.findAll({where: { id_departamento: id }})
    .then(function(data) {
        return data;
    })
    .catch(error => {
        return error;
    });
    res.json({success: true, data: data});
}

controllers.departamento_apagar = async (req, res) => {
    const { id_departamento } = req.body;
    const data = await Departamento.destroy({where: { id_departamento: id_departamento }})
    .then(function(data) {
        return data;
    })
    .catch(error => {
        return error;
    });
    res.status(200).json({
        success: true,
        message: "Departamento apagada com sucesso!",
        data: data
    });
}

controllers.departamento_editar = async (req, res) => {
    const { id_departamento, nome_departamento, responsavel_departamento, descricao} = req.body;
    const data = await Departamento.update({
        nome_departamento: nome_departamento,
        descricao : descricao,
        responsavel_departamento: responsavel_departamento
    }, {
        where: { id_departamento: id_departamento }
    })
    .then(function(data) {
        return data;
    })
    .catch(error => {
        return error;
    });
    res.status(200).json({
        success: true,
        message: "Departamento atualizado com sucesso!",
        data: data
    });
}    

controllers.departamento_adicionar = async (req, res) => {
    const { id_departamento, nome_departamento, responsavel_departamento, descricao} = req.body;
    const data = await Departamento.create({
        id_departamento: id_departamento,
        nome_departamento: nome_departamento,
        descricao : descricao,
        responsavel_departamento: responsavel_departamento
    })
    .then(function(data) {
        return data;
    })
    .catch(error => {
        return error;
    });
    res.status(200).json({
        success: true,
        message: "Departamento adicionado com sucesso!",
        data: data
    });
}

module.exports = controllers;