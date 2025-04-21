var Linha_Temporal = require('../models/Linha_Temporal')
var Perfis = require('../models/Perfis')
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

controller.linhaTemporalCreate = async function (req, res){
    const { id_ideia, id_projeto, tipo, descricao, created_by } = req.body;
    const data = await Linha_Temporal.create({
        id_ideia: id_ideia,
        id_projeto: id_projeto,
        tipo: tipo,
        descricao: descricao,
        created_at: getDate(),
        updated_at: getDate(),
        created_by: created_by
    })
    .then(function(data){
        res.status(200).json({
            success: true,
            message: "Linha Temporal Criada",
            data: data
        })
    })
    .catch(error =>
        res.status(500).json({
            success: false,
            message: "Erro a criar o Linha Temporal",
            error: error.message
        })
    )
}

controller.linhaTemporalList = async function (req, res){
    const data = await Linha_Temporal.findAll({
        order: ['created_at'],
        include: [
            {
                model: Perfis,
                as: 'perfil',
                required: false
            },
        ],
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
            message: "Erro a listar os registos",
            error: error.message
        });
    });
}

controller.linhaTemporalListProjeto = async function (req, res){
    const { id } = req.params;
    const data = await Linha_Temporal.findAll({
        order: ['created_at'],
        where: {id_projeto: id},
        include: [
            {
                model: Perfis,
                as: 'perfil',
                required: false
            },
        ],
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
            message: "Erro a listar os registos",
            error: error.message
        });
    });
}

controller.linhaTemporalListIdeia = async function (req, res){
    const { id } = req.params;
    const data = await Linha_Temporal.findAll({
        order: ['created_at']},
        {where: {id_ideia: id},
        include: [
            {
                model: Perfis,
                as: 'perfil',
                required: false
            },
        ],
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
            message: "Erro a listar os registos",
            error: error.message
        });
    });
}

controller.linhaTemporalGet = async function (req, res){
    const { id } = req.params;
    const data = await Linha_Temporal.findAll({
        where: { id_registo: id },
        include: [
            {
                model: Perfis,
                as: 'perfil',
                required: false
            },
        ],
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
            message: "Erro a encontrar a linha temporal",
            error: error
        });
    })
}

controller.linhaTemporalDelete = async function (req, res){
    const { id } = req.params;
    const data = await Linha_Temporal.destroy({
        where: {id_registo: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Linha temporal apagada"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a apagar a linha temporal",
            error: error.message
        });
    })
}

controller.linhaTemporalUpdate = async function (req, res){
    const { id } = req.params;
    const { id_ideia, id_projeto, tipo, descricao } = req.body;
    const data = await Linha_Temporal.destroy({
        id_ideia: id_ideia,
        id_projeto: id_projeto,
        tipo: tipo,
        descricao: descricao,
        updated_at: getDate()
    },
    {
        where: {id_registo: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Linha temporal atualizada"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a apagar a linha temporal",
            error: error.message
        });
    })
}

module.exports = controller;