const Feriados = require('../models/Feriados');
var sequelize = require('../models/database');
var Sequelize = require('sequelize')

const controller = {};

function getDate() {
    let now = new Date();
    
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();

    let hh = now.getHours();
    let min = now.getMinutes();
    let ss = now.getSeconds();
    
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    if (hh < 10) hh = '0' + hh;
    if (min < 10) min = '0' + min;
    if (ss < 10) ss = '0' + ss;

    let datetime = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    return datetime;
}

controller.feriadoCreate = async (req, res) => {
    const { nome, data_feriado, } = req.body;
    const data = await Feriados.create({
        nome: nome,
        data_feriado : data_feriado,
    })
    .then(function(data) {
        res.status(200).json({
            success: true,
            message: "Feriado criado com sucesso",
            data: data
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Erro a criar o feriado",
            error: error.message
        })
    });
}

controller.feriadoList = async (req, res) => {
    const data = await Feriados.findAll({
        order: [
            [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM data_feriado')), 'ASC'],
            [Sequelize.fn('EXTRACT', Sequelize.literal('DAY FROM data_feriado')), 'ASC']
        ]
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
            message: "Erro a listar os feriados",
            error: error.message
        });
    });
}

controller.feriadoDelete = async (req, res) => {
    const { id } = req.params;
    const data = await Feriados.destroy({
        where: { id_feriado: id }
    })
    .then(function(data) {
        res.status(200).json({
            success: true,
            message: "Feriado apagado com sucesso"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a apagar o feriado",
            error: error
        });
    });
}

controller.feriadoUpdate = async (req, res) => {
    const { id } = req.params
    const { nome, data_feriado, tipo } = req.body;
    const data = await Feriados.update({
        nome: nome,
        data_feriado : data_feriado,
        tipo: tipo
    }, {
        where: { id_feriado: id }
    })
    .then(function(data) {
        res.status(200).json({
            success: true,
            message: "Feriado atualizado com sucesso"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a atualizar o feriado",
            error: error
        });
    });
}    



module.exports = controller;