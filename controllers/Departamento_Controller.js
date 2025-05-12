const Departamento = require('../models/Departamento');
var sequelize = require('../models/database');
const AuditLog = require('../models/AuditLog')

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

controller.departamentoCreate = async (req, res) => {
    const { nome_departamento, descricao, responsavel_departamento } = req.body;

    try {
        const data = await Departamento.create({
            nome_departamento: nome_departamento,
            descricao: descricao,
            responsavel_departamento: responsavel_departamento
        })

        await AuditLog.create({
            data_atividade: getDate(),
            tipo_atividade: "Criação de departamento",
            descricao: "Foi criado um departamento com nome: " + nome_departamento
        })

        res.status(200).json({
            success: true,
            message: "Departamento Criado",
            data: data
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro a criar o Departamento",
            error: error.message
        })
    }
}

controller.departamentoList = async (req, res) => {
    const data = await Departamento.findAll()
        .then(function (data) {
            res.status(200).json({
                success: true,
                data: data
            });
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                message: "Erro a listar os departamentos",
                error: error.message
            });
        });
}

controller.departamentoGet = async (req, res) => {
    const { id } = req.params;
    const data = await Departamento.findOne({
        where: { id_departamento: id }
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
                message: "Erro a encontrar o departamento",
                error: error
            });
        });
}

controller.departamentoDelete = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await Departamento.destroy({
            where: { id_departamento: id }
        })

        await AuditLog.create({
            data_atividade: getDate(),
            tipo_atividade: "Eliminação de departamento",
            descricao: "Foi elimnado o departamento com ID: " + id
        })

        res.status(200).json({
            success: true,
            message: "Departamento apagado"
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro a apagar o departamento",
            error: error
        });
    }
}

controller.departamentoUpdate = async (req, res) => {
    const { id } = req.params
    const { nome_departamento, descricao, responsavel_departamento } = req.body;

    try {
        const data = await Departamento.update({
            nome_departamento: nome_departamento,
            descricao: descricao,
            responsavel_departamento: responsavel_departamento
        }, {
            where: { id_departamento: id }
        })

        await AuditLog.create({
            data_atividade: getDate(),
            tipo_atividade: "Edição de departamento",
            descricao: "Foi alterado o departamento com ID: " + id
        })

        res.status(200).json({
            success: true,
            message: "Departamento atualizado"
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro a atualizar o departamento",
            error: error
        });
    }
}



module.exports = controller;