var Tipo_Utilizador = require('../models/Tipo_Utilizador')
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

controller.tipoUtilizadoresCreate = async function (req, res){
    const { nome } = req.body;
    const data = await Tipo_Utilizador.create({
        nome: nome
    })
    .then(function(data){
        res.status(200).json({
            success: true,
            message: "Tipo de utilizador criado",
            data: data
        })
    })
    .catch(error =>
        res.status(500).json({
            success: false,
            message: "Erro a criar o tipo de utilizador",
            error: error.message
        })
    )
}

controller.tipoUtilizadoresList = async function (req, res){
    const data = await Tipo_Utilizador.findAll({order: ['nome']})
    .then(function(data) {
        res.status(200).json({
            success: true,
            data: data
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar os tipos de utilizador",
            error: error.message
        });
    });
}

controller.tipoUtilizadoresGet = async function (req, res){
    const { id } = req.params;
    const data = await Tipo_Utilizador.findAll({
        where: { id_tipo: id }
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
            message: "Erro a encontrar o tipo de utilizador",
            error: error
        });
    })
}

controller.tipoUtilizadoresDelete = async function (req, res){
    const { id } = req.params;
    const data = await Tipo_Utilizador.destroy({
        where: {id_tipo: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Tipo de utilizador apagado"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a apagar o tipo de utilizador",
            error: error.message
        });
    })
}

controller.tipoUtilizadoresUpdate = async function (req, res){
    const { id } = req.params;
    const { nome } = req.body;
    const data = await Tipo_Utilizador.update({
        nome: nome
    },{
        where: {id_tipo: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Tipo de utilizador Apagado"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a apagar o tipo de utilizador",
            error: error.message
        });
    })
}

module.exports = controller;