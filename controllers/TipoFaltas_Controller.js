var Tipo_Faltas = require('../models/Tipo_Faltas')
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