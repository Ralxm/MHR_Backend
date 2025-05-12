var Comentarios = require('../models/Comentarios')
var Perfis = require('../models/Perfis')
const controller = {};
const AuditLog = require('../models/AuditLog')

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

controller.comentarioCreate = async function (req, res) {
    const { id_candidatura, comentario, responsavel } = req.body;

    try {
        const data = await Comentarios.create({
            id_candidatura: id_candidatura,
            comentario: comentario,
            responsavel: responsavel,
            created_at: getDate(),
            updated_at: getDate()
        })

        await AuditLog.create({
            utilizador: responsavel,
            data_atividade: getDate(),
            tipo_atividade: "Criação de comentário em candidatura",
            descricao: "Perfil com ID " + responsavel + " criou um comentário na candidatura com ID: " + id_candidatura
        })

        res.status(200).json({
            success: true,
            message: "Comentario Criado",
            data: data
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro a criar o Comentario",
            error: error.message
        })
    }
}

controller.comentarioList = async function (req, res) {
    const data = await Comentarios.findAll({
        include: [
            {
                model: Perfis,
                as: 'perfil',
                required: false
            },
        ],
        order: ['created_at']
    })
        .then(function (data) {
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

controller.comentarioListCandidatura = async function (req, res) {
    const { id } = req.params;
    const data = await Comentarios.findAll({
        include: [
            {
                model: Perfis,
                as: 'perfil',
                required: false
            },
        ],
        order: ['created_at'],
        where: { id_candidatura: id }
    })
        .then(function (data) {
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

controller.comentarioGet = async function (req, res) {
    const { id } = req.params;
    const data = await Comentarios.findAll({
        include: [
            {
                model: Perfis,
                as: 'perfil',
                required: false
            },
        ],
        where: { id_comentario: id }
    })
        .then(function (data) {
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

controller.comentarioDelete = async function (req, res) {
    const { id } = req.params;

    try {
        const data = await Comentarios.destroy({
            where: { id_comentario: id }
        })

        await AuditLog.create({
            data_atividade: getDate(),
            tipo_atividade: "Eliminação de comentário em candidatura",
            descricao: "Comentário em candidatura com ID: " + id + " foi apagado"
        })

        res.status(200).json({
            success: true,
            message: "Comentário Apagado"
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro a apagar o comentário",
            error: error.message
        });
    }
}

controller.comentarioUpdate = async function (req, res) {
    const { id } = req.params;
    const { comentario, responsavel } = req.body;
    const data = await Comentarios.update({
        comentario: comentario,
        responsavel: responsavel,
        updated_at: getDate()
    },
        {
            where: { id_comentario: id }
        })
        .then(function () {
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