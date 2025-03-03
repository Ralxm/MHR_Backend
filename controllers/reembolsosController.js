const Reembolsos = require('../models/Reembolsos');
const User = require('../models/User');
var sequelize = require('../models/database');
const {Op} = require('sequelize');

const controllers = {};

sequelize.sync();

controllers.reembolsos_lista = async (req, res) => {
    try {
        const reembolsos = await Reembolsos.findAll();

        const reembolsosComInfo = await Promise.all(
            reembolsos.map(async (reembolso) => {
                const autor = await User.findOne({ where: { id_user: reembolso.id_user } });

                return {
                    ...reembolso.toJSON(),
                    autor: autor ? autor.nome_utilizador : 'Sem autor'
                };
            })
        );
        res.json({ success: true, reembolsos: reembolsosComInfo });
    } catch (error) {
        console.error('Erro ao procurar reembolsos:', error);
        res.status(500).json({ success: false, message: 'Erro ao procurar reembolsos' });
    }
}

controllers.reembolsos_lista_user = async (req, res) => {
    const { id_user } = req.params;
    try {
        const reembolsosUser = await Reembolsos.findAll({
            where: {
                [Op.or]: [
                    { id_user },
                    { destinatario: id_user }
                ]
            }
        });

        res.json({ success: true, reembolsosUser });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

controllers.reembolsos_adicionar = async (req, res) => {
    const { id_user, descricao, valor, id_projeto, data_despesa,destinatario } = req.body;

    try {

        const reembolso = await Reembolsos.create({
            id_user: id_user,
            descricao: descricao,
            valor: valor,
            id_projeto: id_projeto  || null,
            estado: "Aprovado",
            data_reembolso: new Date(),
            data_despesa: data_despesa,
            destinatario: destinatario
        });
        res.status(201).json({
            success: true,
            message: "Reembolso adicionado com sucesso!",
            reembolso
        });
    } catch (error) {
        console.error("Error adding reembolso:", error);
        res.status(500).json({

            success: false,
            message: "Erro ao adicionar reembolso.",
            error: error.message
        });
    }
}


controllers.reembolsos_apagar = async (req, res) => {
    const { id_reembolso } = req.body;
    const data = await Reembolsos.destroy({ where: { id_reembolso: id_reembolso } })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.status(200).json({
        success: true,
        message: "Reembolso apagada com sucesso!",
        data: data
    });
}

controllers.reembolsos_editar = async (req, res) => {
    const { id_reembolso, data_reembolso, descricao, valor } = req.body;
    const data = await Reembolsos.update({
        data: data_reembolso,
        descricao: descricao,
        valor: valor
    }, {
        where: { id_reembolso: id_reembolso }
    })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.status(200).json({
        success: true,
        message: "Reembolso atualizado com sucesso!",
        data: data
    });
}

controllers.reembolsos_detalhes = async (req, res) => {
    const { id_reembolso } = req.params;

    const data = await Reembolsos.findOne({ where: { id_reembolso: id_reembolso } })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.json({ success: true, data: data });
}

module.exports = controllers;