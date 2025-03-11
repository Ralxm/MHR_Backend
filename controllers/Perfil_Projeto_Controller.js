var Perfil_Projeto = require('../models/Perfil_Projeto')
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

controller.perfilProjetoCreate = async function (req, res){
    const { id_perfil, id_projeto } = req.body;
    const data = await Perfil_Projeto.create({
        id_perfil: id_perfil,
        id_projeto: id_projeto,
    })
    .then(function(data){
        res.status(200).json({
            success: true,
            message: "Perfil associado a projeto",
            data: data
        })
    })
    .catch(error =>
        res.status(500).json({
            success: false,
            message: "Erro a criar a associação",
            error: error.message
        })
    )
}

controller.perfilProjetoList = async function (req, res){
    const data = await Perfil_Projeto.findAll({order: ['id_perfil']})
    .then(function(data) {
        res.status(200).json({
            success: true,
            data: data
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar as associações entre projetos e perfis",
            error: error.message
        });
    });
}

controller.perfilProjetoGet = async function (req, res){
    const { id_projeto, id_perfil } = req.params;
    const data = await Perfil_Projeto.findAll({
        where: { id_projeto: id_projeto, id_perfil: id_perfil }
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
            message: "Erro a encontrar o perfil",
            error: error
        });
    })
}

controller.perfilProjetoGet_Perfil = async function (req, res){
    const { id } = req.params;
    const data = await Perfil_Projeto.findAll({
        where: { id_perfil: id }
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
            message: "Erro a encontrar o perfil",
            error: error
        });
    })
}

controller.perfilProjetoGet_Projeto = async function (req, res){
    const { id } = req.params;
    const data = await Perfil_Projeto.findAll({
        where: { id_projeto: id }
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
            message: "Erro a encontrar o perfil",
            error: error
        });
    })
}

controller.perfilProjetoDelete = async function (req, res){
    const { id_projeto, id_perfil } = req.params;
    const data = await Perfil_Projeto.destroy({
        where: { id_projeto: id_projeto, id_perfil: id_perfil }
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Perfil apagado"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a apagar o Perfil",
            error: error.message
        });
    })
}

module.exports = controller;