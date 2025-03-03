const Despesas = require('../models/Despesas');
const Projetos = require('../models/Projetos');
const User = require('../models/User');
const Reembolsos = require('../models/Reembolsos');
var sequelize = require('../models/database');

const controllers = {};

sequelize.sync();

controllers.despesas_adicionar = async (req, res) => {
    const { id_user, data, descricao, valor, id_projeto } = req.body;

    try {

        const despesa = await Despesas.create({
            id_user: id_user,
            data: data,
            descricao: descricao,
            valor: valor,
            id_projeto: id_projeto || null,
            destinatario: id_user,
            estado: "Pendente",
        });
        res.status(201).json({
            success: true,
            message: "Despesa adicionada com sucesso!",
            despesa
        });
    } catch (error) {
        console.error("Error adding despesa:", error);
        res.status(500).json({

            success: false,
            message: "Erro ao adicionar despesa.",
            error: error.message
        });
    }
}

controllers.despesas_lista_user = async (req, res) => {
    const { id_user } = req.params;
    try {
        const despesas = await Despesas.findAll({where: {id_user}});
        const reembolsos = await Reembolsos.findAll({where: 
            { destinatario: id_user }
        });

        const despesasComReembolsos = await Promise.all(
            despesas.map(async (despesa) => {
                const reembolso = await Reembolsos.findOne({where:{id_despesa: despesa.id_despesa}});
                const projeto = await Projetos.findOne({ where: { id_projeto: despesa.id_projeto } });

                return {
                    ...despesa.toJSON(),
                    data_reembolso: reembolso ? reembolso.data_reembolso : 'Sem data de reembolso',
                    projeto: projeto ? projeto.titulo_projeto : 'Sem projeto associado',
                };
            })
        );

        const reembolsosSemDespesas = await Promise.all(
            reembolsos
                .filter(r => r.id_despesa === null)
                .map(async (reembolso) => {
                    const projeto = await Projetos.findOne({ where: { id_projeto: reembolso.id_projeto } });

                    return {
                        ...reembolso.toJSON(),
                        data_reembolso: reembolso ? reembolso.data_reembolso : 'Sem data de reembolso',
                        projeto: projeto ? projeto.titulo_projeto : 'Sem projeto associado',
                    };
                })
        );

        const despesasComReembolsosUser = despesasComReembolsos.concat(reembolsosSemDespesas);
        res.json({ success: true, despesasComReembolsosUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

controllers.despesas_lista = async (req, res) => {
    try {
        const despesas = await Despesas.findAll();
        const reembolsos = await Reembolsos.findAll();

        const despesasComReembolsos = await Promise.all(
            despesas.map(async (despesa) => {
                const reembolso = await Reembolsos.findOne({where:{id_despesa: despesa.id_despesa}});
                const projeto = await Projetos.findOne({ where: { id_projeto: despesa.id_projeto } });
                const autor = await User.findOne({ where: { id_user: despesa.id_user } });

                let destinatarioNome = 'Próprio';
                if (reembolso && reembolso.destinatario) {
                    const destinatario = await User.findOne({ where: { id_user: reembolso.destinatario } });
                    destinatarioNome = destinatario ? destinatario.nome_utilizador : 'Próprio';
                }

                return {
                    ...despesa.toJSON(),
                    data_reembolso: reembolso ? reembolso.data_reembolso : 'Sem data de reembolso',
                    destinatario: destinatarioNome,
                    projeto: projeto ? projeto.titulo_projeto : 'Sem projeto associado',
                    autor: autor ? autor.nome_utilizador : 'Sem autor'
                };
            })
        );


        const reembolsosSemDespesas = await Promise.all(
            reembolsos
                .filter(r => r.id_despesa === null)
                .map(async (reembolso) => {
                    const destinatario = await User.findOne({ where: { id_user: reembolso.destinatario } });
                    const projeto = await Projetos.findOne({ where: { id_projeto: reembolso.id_projeto } });
                    const destinatarioNome = destinatario ? destinatario.nome_utilizador : 'Desconhecido';
                    const autor = await User.findOne({ where: { id_user: reembolso.id_user } });
                    
                    return {
                        ...reembolso.toJSON(),
                        id_despesa: 'Sem despesa associada',
                        data_reembolso: reembolso ? reembolso.data_reembolso : 'Sem data de reembolso',
                        destinatario: destinatarioNome,
                        projeto: projeto ? projeto.titulo_projeto : 'Sem projeto associado',
                        autor:  autor ? autor.nome_utilizador : 'Sem autor'
                    };
                })
        );

        const todosRembolsosDespesas = despesasComReembolsos.concat(reembolsosSemDespesas);
        res.json({ success: true, todosRembolsosDespesas });
    } catch (error) {
        console.error('Erro ao procurar despesas:', error);
        res.status(500).json({ success: false, message: 'Erro ao procurar despesas' });
    }
};


controllers.despesas_editar = async (req, res) => {
    const {id_despesa} = req.params;
    const { data, descricao, valor, id_projeto } = req.body;
    const despesas = await Despesas.findOne({ where: { id_despesa } });
    if (!despesas) {
        return res.status(404).json({ success: false, message: "Despesa não encontrada." });
    }
    try {
        const despesa = await Despesas.update({
            data: data,
            descricao:descricao,
            valor:valor,
            id_projeto:id_projeto
        }, {
            where: {
                id_despesa
            }
        });
        if (despesa[0] === 0) {
            return res.status(404).json({ success: false, message: "Despesa não encontrada." });
        }
        res.json({ success: true, message: "Despesa atualizada com sucesso." });
    } catch (error) {
        console.error("Error updating despesa:", error);
        res.status(500).json({
            success: false,
            message: "Erro ao atualizar despesa.",
            error: error.message
        });
    }
}

controllers.despesas_apagar = async (req, res) => {
    const { id_despesa } = req.params;

    try {
        const data = await Despesas.destroy({
            where: {
                id_despesa
            }
        });
        if (data === 0) {
            return res.status(404).json({ success: false, message: "Despesa não encontrada." });
        }
        res.json({ success: true, message: "Despesa apagada com sucesso." });
    } catch (error) {
        console.error("Error deleting despesa:", error);
        res.status(500).json({
            success: false,
            message: "Erro ao apagar despesa.",
            error: error.message
        });
    }
}

controllers.despesas_detalhes = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await Despesas.findOne({
            where: {
                id_despesa: id
            }
        });
        if (!data) {
            return res.status(404).json({ success: false, message: "Despesa não encontrada." });
        }
        res.json({ success: true, data });
    } catch (error) {
        console.error("Error fetching despesa details:", error);
        res.status(500).json({
            success: false,
            message: "Erro ao mostrar detalhes da despesa.",
            error: error.message
        });
    }
}

controllers.despesas_aprovar = async (req, res) => {
    const { id_despesa } = req.params;
    const { validador } = req.body;

    try {
        const atualizarDespesa = await Despesas.update({
            estado: "Aprovado",
            validador: validador
        }, {
            where: {
                id_despesa
            }
        });
        if (atualizarDespesa[0] === 0) {
            return res.status(404).json({ success: false, message: "Despesa não encontrada." });
        }
        const despesa = await Despesas.findOne({ where: { id_despesa } });
        if (!despesa) {
            return res.status(404).json({ success: false, message: "Despesa não encontrada após atualização." });
        }
        await Reembolsos.create({
            id_despesa: despesa.id_despesa,
            id_user: despesa.id_user,
            descricao: despesa.descricao,
            valor: despesa.valor,
            data_despesa: despesa.data,
            data_reembolso: new Date(),
            estado: "Aprovada"
        });
        res.json({ success: true, message: "Despesa aprovada com sucesso." });
    } catch (error) {
        console.error("Error approving despesa:", error);
        res.status(500).json({
            success: false,
            message: "Erro ao aprovar despesa.",
            error: error.message
        });
    }
}
controllers.despesas_rejeitar = async (req, res) => {
    const { id_despesa } = req.params;
    const { validador, comentarios } = req.body;

    try {
        const atualizarDespesa = await Despesas.update({
            estado: "Rejeitado",
            validador: validador,
            comentarios: comentarios
        }, {
            where: {
                id_despesa
            }
        });
        if (atualizarDespesa[0] === 0) {
            return res.status(404).json({ success: false, message: "Despesa não encontrada." });
        }

        res.json({ success: true, message: "Despesa rejeitada com sucesso." });
    } catch (error) {
        console.error("Erro ao rejeitar despesa:", error);
        res.status(500).json({
            success: false,
            message: "Erro ao rejeitar despesa.",
            error: error.message
        });
    }
}
module.exports = controllers;
