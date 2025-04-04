const Vaga = require('../models/Vaga');
var sequelize = require('../models/database');
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

controller.vagaCreate = async function (req, res){
    const { id_departamento, descricao, requisitos, titulo_vaga, numero_vagas, estado, data_inicio, data_fecho, created_by } = req.body;
    const data = await Vaga.create({
        id_departamento: id_departamento,
        descricao: descricao,
        requisitos: requisitos,
        titulo_vaga: titulo_vaga,
        descricao: descricao,
        numero_vagas: numero_vagas,
        estado: estado,
        data_inicio: data_inicio,
        data_fecho: data_fecho,
        created_at: getDate(),
        updated_at: getDate(),
        created_by: created_by
    })
    .then(function(data){
        res.status(200).json({
            success: true,
            message: "Vaga criada",
            data: data
        })
    })
    .catch(error =>
        res.status(500).json({
            success: false,
            message: "Erro a criar a Vaga",
            error: error.message
        })
    )
}

controller.vagaList = async function (req, res){
    const data = await Vaga.findAll({order: ['titulo_vaga']})
    .then(function(data) {
        res.status(200).json({
            success: true,
            data: data
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar as Vagas",
            error: error.message
        });
    });
}

controller.vagaList_PorDepartamento = async function (req, res){
    const { id } = req.params;
    const data = await Vaga.findAll({order: ['titulo_vaga']},
        {
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
            message: "Erro a listar as Vagas",
            error: error.message
        });
    });
}

controller.vagaGet = async function (req, res){
    const { id } = req.params;
    const data = await Vaga.findAll({
        where: { id_vaga: id }
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
            message: "Erro a encontrar a Vaga",
            error: error
        });
    })
}

controller.vagaDelete = async function (req, res){
    const { id } = req.params;
    const data = await Vaga.destroy({
        where: {id_vaga: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Vaga apagada"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a apagar a Vaga",
            error: error.message
        });
    })
}

controller.vagaUpdate = async function (req, res){
    const { id } = req.params;
    const { id_departamento, descricao, requisitos, titulo_vaga, numero_vagas, estado, data_inicio, data_fecho } = req.body;
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    console.log(numero_vagas)
    console.log(id_departamento)
    console.log(descricao)
    const data = await Vaga.update({
        id_departamento: id_departamento,
        descricao: descricao,
        requisitos: requisitos,
        titulo_vaga: titulo_vaga,
        numero_vagas: numero_vagas,
        estado: estado,
        data_inicio: data_inicio,
        data_fecho: data_fecho,
        descricao: descricao,
        updated_at: getDate(),
    },{
        where: {id_vaga: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Vaga atualizada"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a atualizar a Vaga",
            error: error.message
        });
    })
}

module.exports = controller;