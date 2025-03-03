const Despesas = require('../models/Despesas');
const Ferias = require('../models/Ferias');
const Faltas = require('../models/Faltas');
const Blog = require('../models/Blog');
const Vagas = require('../models/Vaga');
const Ideias = require('../models/Ideia');
var sequelize = require('../models/database');

const controllers = {};

sequelize.sync();

controllers.notificacoes_lista = async (req, res) => {

    try {
        const publicacoesCount = await Blog.count({ where: { estado: 'Em avaliação' } });
        const despesasCount = await Despesas.count({ where: { estado: 'Pendente' } });
        const feriasCount = await Ferias.count({ where: { estado: 'Pendente' } });
        const faltasCount = await Faltas.count({ where: { estado: 'Pendente' } });
        const vagasCount = await Vagas.count({ where: { estado: 'Em análise' } });
        const ideiasCount = await Ideias.count({ where: { estado: 'Em estudo' } });
        
        res.json({
            success: true,
            publicacoes: publicacoesCount,
            despesas: despesasCount,
            ferias: feriasCount,
            faltas: faltasCount,
            vagas: vagasCount,
            ideias: ideiasCount,
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

    


module.exports = controllers;