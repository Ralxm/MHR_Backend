var Comentarios = require('../models/Comentarios')
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

controller.comentarioCreate = async function (req, res){
    const { id_candidatura, comentario, responsavel } = req.body;
    const data = await Comentarios.create({
        id_candidatura: id_candidatura,
        comentario: comentario,
        responsavel: responsavel,
        created_at: getDate(),
        updated_at: getDate()
    })
    .then(function(data){
        res.status(200).json({
            success: true,
            message: "Comentario Criado",
            data: data
        })
    })
    .catch(error =>
        res.status(500).json({
            success: false,
            message: "Erro a criar o Comentario",
            error: error.message
        })
    )
}

controller.comentarioList = async function (req, res){
    const data = await Comentarios.findAll({order: ['created_at']})
    .then(function(data) {
        res.status(200).json({
            success: true,
            data: data
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar os comentários",
            error: error.message
        });
    });
}

controller.comentarioListCandidatura = async function (req, res){
    const { id } = req.params;
    const data = await Comentarios.findAll({order: ['created_at']}, {where: {id_candidatura: id}})
    .then(function(data) {
        res.status(200).json({
            success: true,
            data: data
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar os comentários",
            error: error.message
        });
    });
}

controller.comentarioGet = async function (req, res){
    const { id } = req.params;
    const data = await Comentarios.findAll({
        where: { id_comentario: id }
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
            message: "Erro a encontrar o comentário",
            error: error
        });
    })
}

controller.comentarioDelete = async function (req, res){
    const { id } = req.params;
    const data = await Comentarios.destroy({
        where: {id_comentario: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Comentário Apagado"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a apagar o comentário",
            error: error.message
        });
    })
}

controller.comentarioUpdate = async function (req, res){
    const { id } = req.params;
    const { comentario, responsavel } = req.body;
    const data = await Comentarios.update({
        comentario: comentario,
        responsavel: responsavel,
        updated_at: getDate()
    },
    {
        where: {id_comentario: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Comentário atualizado"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a apagar o comentário",
            error: error.message
        });
    })
}

module.exports = controller;