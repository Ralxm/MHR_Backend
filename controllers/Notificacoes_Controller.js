const Despesas = require('../models/Despesas');
const Ferias = require('../models/Ferias');
const Faltas = require('../models/Faltas');
const Blog = require('../models/Blog');
const Vagas = require('../models/Vaga');
const Ideias = require('../models/Ideia');
var sequelize = require('../models/database');

const controllers = {};

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

controllers.notificacoesListManager = async (req, res) => {
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

controllers.notificacoesListUser = async (req, res) => {
    const { id } = req.params
    try {
        const publicacoesCount = await Blog.count({ where: { estado: 'Em avaliação', id_perfil: id} });
        const despesasCount = await Despesas.count({ where: { estado: 'Pendente', id_perfil: id } });
        const feriasCount = await Ferias.count({ where: { estado: 'Pendente', id_perfil: id } });
        const faltasCount = await Faltas.count({ where: { estado: 'Pendente', id_perfil: id } });
        const ideiasCount = await Ideias.count({ where: { estado: 'Em análise', id_perfil: id } });
        
        res.json({
            success: true,
            publicacoes: publicacoesCount,
            despesas: despesasCount,
            ferias: feriasCount,
            faltas: faltasCount,
            ideias: ideiasCount,
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

    


module.exports = controllers;