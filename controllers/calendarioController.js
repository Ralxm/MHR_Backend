const Faltas = require('../models/Faltas');
const Ferias = require('../models/Ferias');
const User = require('../models/User');
const Calendario = require('../models/Calendario');

var sequelize = require('../models/database');

const controllers = {};

sequelize.sync();

controllers.eventos_lista_user = async (req, res) => {
    try {
        const { id_user } = req.params;
        const user = await User.findOne({ where: { id_user } });
        const faltas = await Faltas.findAll({where:{ id_calendario : user.id_calendario}, estado: 'Aprovada' });
        const ferias = await Ferias.findAll({where: {id_calendario : user.id_calendario}, estado: 'Aprovada'});

        
        res.json({ success: true, faltas, ferias });
    } catch (error) {
        console.error("Erro ao buscar dados das tabelas:", error);
        res.status(500).json({ error: "Erro ao buscar dados das tabelas" });
    }
}

controllers.eventos_lista = async (req, res) => {
    try {
        const faltas = await Faltas.findAll({where:{ estado: 'Aprovada' }});
        const ferias = await Ferias.findAll({where:{ estado: 'Aprovada' }});

        const faltasComUsers = await Promise.all(
            faltas.map(async (faltas) => {
                const autor = await User.findOne({ where: { id_calendario: faltas.id_calendario } });
                
                return {
                    ...faltas.toJSON(),
                    autor: autor ? autor.nome_utilizador : 'Sem autor'
                };
            })
        );
        const feriasComUsers = await Promise.all(
            ferias.map(async (ferias) => {
                const autor = await User.findOne({ where: { id_calendario: ferias.id_calendario } });
                
                return {
                    ...ferias.toJSON(),
                    autor: autor ? autor.nome_utilizador : 'Sem autor'
                };
            })
        );
        
        res.json({ success: true, faltasComUsers, feriasComUsers });
    } catch (error) {
        console.error("Erro ao buscar dados das tabelas:", error);
        res.status(500).json({ error: "Erro ao buscar dados das tabelas" });
    }
}


controllers.obterDiasFeriasAnoAnterior = async () => {
    try {
        const calendarioAnoAnterior = await Calendario.findOne({
            order: [['data', 'DESC']] 
        });

        if (calendarioAnoAnterior) {
            return calendarioAnoAnterior.dias_ferias_ano_atual; 
        } else {
            return 0; 
        }
    } catch (error) {
        console.error("Erro ao obter dias de férias do ano anterior:", error);
        throw error;
    }
}

controllers.calendario_criar = async (id_user, transaction) => {
  
    try {
        const dataAtual = new Date();
        dataAtual.setHours(0, 0, 0, 0);

        const diasFeriasAnoAnterior = await controllers.obterDiasFeriasAnoAnterior(id_user);
        const novoCalendario = await Calendario.create({ 
            id_user,
            id_empresa: 1,
            data: dataAtual,
            dias_ferias_ano_atual: 22,
            dias_ferias_ano_anterior: diasFeriasAnoAnterior,
         }, { transaction });
        return novoCalendario;
    } catch (error) {
        console.error("Erro ao criar calendário:", error);
        throw error;
    }
};

controllers.numero_dias_ferias_usados = async (req, res) => {
    try {
        const {id_user} = req.params;

        const user = await User.findOne({ where: { id_user } });
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilizador não encontrado" });
        }

        const feriasUtilizadas = await Ferias.sum('duracao', { where: { id_calendario: user.id_calendario, estado: 'Aprovada' } });

        res.json({ success: true, feriasUtilizadas });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

controllers.numero_dias_ferias_restantes = async (req, res) => {
    try {
        const {id_user} = req.params;

        const user = await User.findOne({ where: { id_user} });
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilizador não encontrado" });
        }

        const calendario = await Calendario.findOne({
            attributes: [
                [
                    sequelize.literal('SUM("dias_ferias_ano_atual" + "dias_ferias_ano_anterior")'),
                    'total_dias_ferias'
                ]
            ],
            where: { id_calendario: user.id_calendario }
        });

        if (!calendario || !calendario.getDataValue('total_dias_ferias')) {
            throw new Error('Dados de calendário não encontrados para o utilizador');
        }

        const total_dias_ferias = calendario.getDataValue('total_dias_ferias');

        const feriasUtilizadas = await Ferias.sum('duracao', {
            where: {
                id_calendario: user.id_calendario,
                estado: 'Aprovada'
            }
        });

        const dias_ferias_restantes = total_dias_ferias - (feriasUtilizadas || 0);

        res.json({ success: true, dias_ferias_restantes });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
module.exports = controllers;