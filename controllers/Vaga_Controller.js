const Vaga = require('../models/Vaga');
const AuditLog = require('../models/AuditLog')
const Departamento = require('../models/Departamento')
var sequelize = require('../models/database');
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

controller.vagaCreate = async function (req, res) {
    const { id_departamento, descricao, requisitos, oferecemos, titulo_vaga, numero_vagas, estado, tipo, local, data_inicio, data_fecho, created_by } = req.body;

    try {
        const data = await Vaga.create({
            id_departamento: id_departamento,
            descricao: descricao,
            requisitos: requisitos,
            oferecemos: oferecemos,
            titulo_vaga: titulo_vaga,
            descricao: descricao,
            numero_vagas: numero_vagas,
            numero_vagas_restantes: numero_vagas,
            estado: estado,
            tipo: tipo,
            local: local,
            data_inicio: data_inicio,
            data_fecho: data_fecho,
            created_at: getDate(),
            updated_at: getDate(),
            created_by: created_by
        })

        const departamento = await Departamento.findOne({ where: { id_departamento: id_departamento } })

        await AuditLog.create({
            utilizador: created_by,
            data_atividade: getDate(),
            tipo_atividade: "Criação de vaga",
            descricao: "Perfil com ID " + created_by + " criou uma vaga no departamento: " + departamento.nome_departamento
        })

        res.status(200).json({
            success: true,
            message: "Vaga criada",
            data: data
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro a criar a Vaga",
            error: error.message
        })
    }
}

controller.vagaList = async function (req, res) {
    const data = await Vaga.findAll({ order: ['titulo_vaga'] })
        .then(function (data) {
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

controller.vagaList_PorDepartamento = async function (req, res) {
    const { id } = req.params;
    const data = await Vaga.findAll({ order: ['titulo_vaga'] },
        {
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
                message: "Erro a listar as Vagas",
                error: error.message
            });
        });
}

controller.vagaGet = async function (req, res) {
    const { id } = req.params;
    const data = await Vaga.findAll({
        where: { id_vaga: id }
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
                message: "Erro a encontrar a Vaga",
                error: error
            });
        })
}

controller.vagaDelete = async function (req, res) {
    const { id } = req.params;

    try {
        const data = await Vaga.destroy({
            where: { id_vaga: id }
        })

        await AuditLog.create({
            data_atividade: getDate(),
            tipo_atividade: "Eliminação de vaga",
            descricao: "Vaga com o ID: " + id + " foi apagada"
        })

        res.status(200).json({
            success: true,
            message: "Vaga apagada"
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro a apagar a Vaga",
            error: error.message
        });
    }
}

controller.vagaUpdate = async function (req, res) {
    const { id } = req.params;
    const { id_departamento, descricao, requisitos, oferecemos, titulo_vaga, numero_vagas, estado, tipo, local, data_inicio, data_fecho } = req.body;

    try {
        const data = await Vaga.update({
            id_departamento: id_departamento,
            descricao: descricao,
            requisitos: requisitos,
            oferecemos: oferecemos,
            titulo_vaga: titulo_vaga,
            numero_vagas: numero_vagas,
            numero_vagas_restantes: numero_vagas,
            estado: estado,
            tipo: tipo,
            local: local,
            data_inicio: data_inicio,
            data_fecho: data_fecho,
            updated_at: getDate(),
        }, {
            where: { id_vaga: id }
        })

        await AuditLog.create({
            data_atividade: getDate(),
            tipo_atividade: "Edição de vaga",
            descricao: "Vaga com o ID: " + id + " e título: " + titulo_vaga + " foi editada"
        })

        res.status(200).json({
            success: true,
            message: "Vaga atualizada"
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro a atualizar a Vaga",
            error: error.message
        });
    }
}

module.exports = controller;