var Linha_Temporal = require('../models/Linha_Temporal')
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

controller.linhaTemporalCreate = async function (req, res) {
    const { id_ideia, id_projeto, tipo, descricao, created_by } = req.body;

    try {
        const data = await Linha_Temporal.create({
            id_ideia: id_ideia,
            id_projeto: id_projeto,
            tipo: tipo,
            descricao: descricao,
            created_at: getDate(),
            updated_at: getDate(),
            created_by: created_by
        })

        await AuditLog.create({
            utilizador: created_by,
            data_atividade: getDate(),
            tipo_atividade: "Criação de ponto na LT",
            descricao: "Perfil com ID " + created_by + " criou um ponto na LT do projeto com ID: " + id_projeto
        })

        res.status(200).json({
            success: true,
            message: "Linha Temporal Criada",
            data: data
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro a criar o Linha Temporal",
            error: error.message
        })
    }
}

controller.linhaTemporalList = async function (req, res) {
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
        .then(function (data) {
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

controller.linhaTemporalListProjeto = async function (req, res) {
    const { id } = req.params;
    const data = await Linha_Temporal.findAll({
        order: ['created_at'],
        where: { id_projeto: id },
        include: [
            {
                model: Perfis,
                as: 'perfil',
                required: false
            },
        ],
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
                message: "Erro a listar os registos",
                error: error.message
            });
        });
}

controller.linhaTemporalListIdeia = async function (req, res) {
    const { id } = req.params;
    const data = await Linha_Temporal.findAll({
        order: ['created_at']
    },
        {
            where: { id_ideia: id },
            include: [
                {
                    model: Perfis,
                    as: 'perfil',
                    required: false
                },
            ],
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
                message: "Erro a listar os registos",
                error: error.message
            });
        });
}

controller.linhaTemporalGet = async function (req, res) {
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
        .then(function (data) {
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

controller.linhaTemporalDelete = async function (req, res) {
    const { id } = req.params;

    try {
        const data = await Linha_Temporal.destroy({
            where: { id_registo: id }
        })

        await AuditLog.create({
            data_atividade: getDate(),
            tipo_atividade: "Eliminação de ponto na LT",
            descricao: "Ponto na LT com ID: " + id + " foi apagado"
        })

        res.status(200).json({
            success: true,
            message: "Linha temporal apagada"
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro a apagar a linha temporal",
            error: error.message
        });
    }
}

controller.linhaTemporalUpdate = async function (req, res) {
    const { id } = req.params;
    const { id_ideia, id_projeto, tipo, descricao } = req.body;

    try {
        const data = await Linha_Temporal.destroy({
            id_ideia: id_ideia,
            id_projeto: id_projeto,
            tipo: tipo,
            descricao: descricao,
            updated_at: getDate()
        },
            {
                where: { id_registo: id }
            })

        await AuditLog.create({
            data_atividade: getDate(),
            tipo_atividade: "Edição de ponto na LT",
            descricao: "Ponto na LT com ID: " + id + " no projeto com ID: " + id_projeto + " foi alterado"
        })

        res.status(200).json({
            success: true,
            message: "Linha temporal atualizada"
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro a apagar a linha temporal",
            error: error.message
        });
    }
}

module.exports = controller;