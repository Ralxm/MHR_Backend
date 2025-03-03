const User = require('../models/User');
const Vagas = require('../models/Vaga');
const Candidaturas = require('../models/Candidaturas');
const userVisitante = require('../models/Perfil_visitante');

var sequelize = require('../models/database');
const { Op } = require('sequelize');

const controllers = {};

sequelize.sync();

controllers.vaga_lista = async (req, res) => {
    const data = await Vagas.findAll()
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.json({ success: true, data: data });
}

controllers.vagas_adicionar = async (req, res) => {
    const { descricao, titulo_vaga, requisitos, data_encerramento } = req.body;
    let imagem = req.file ? req.file.filename : 'public/img/vagas.jpg';
    try {
        const requisitosArray = Array.isArray(requisitos) ? objetivos : JSON.parse(requisitos || '[]');

        const vaga = await Vagas.create({
            imagem: imagem,
            titulo_vaga: titulo_vaga,
            descricao: descricao,
            requisitos: requisitosArray,
            estado: "Em aberto",
            data_criacao: new Date(),
            data_encerramento: data_encerramento,
        });

        res.status(200).json({
            success: true,
            message: "Vaga adicionado com sucesso!",
            vaga,
        });

    } catch (error) {
        console.error('Erro ao adicionar vaga:', error);
        res.status(500).json({
            success: false,
            message: "Erro ao adicionar vaga",
            error: error.message,
        });
    }
};

controllers.vagas_em_aberto = async (req, res) => {
    const data = await Vagas.findAll({ where: { estado: "Em aberto" } })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.json({ success: true, data: data });
}



controllers.vaga_apagar = async (req, res) => {
    const { id_vaga } = req.body;
    const data = await Vagas.destroy({ where: { id_vaga: id_vaga } })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.status(200).json({
        success: true,
        message: "Vaga apagada com sucesso!",
        data: data
    });
}

controllers.vaga_atualizar = async (req, res) => {
    const { id_vaga, descricao, titulo_vaga, requisitos } = req.body;
    const data = await Vagas.update({
        descricao: descricao,
        titulo_vaga: titulo_vaga,
        requisitos: requisitos
    }, {
        where: { id_vaga: id_vaga }
    })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.status(200).json({
        success: true,
        message: "Vaga atualizada com sucesso!",
        data: data
    });
}

controllers.vaga_detalhes = async (req, res) => {
    const { id_vaga } = req.params;

    try {
        const data = await Vagas.findOne({ where: { id_vaga: id_vaga } });
        res.json({ success: true, data: data });
    } catch (error) {
        console.error('Erro ao procurar vaga:', error);
        res.status(500).json({
            success: false,
            message: "Erro ao procurar vaga",
            error: error.message,
        });
    }
}

controllers.vaga_atribuir = async (req, res) => {
    try {
        const { id_candidatura } = req.params;
        const { id_vaga } = req.body;

        const candidatura = await Candidaturas.findOne({ where: { id_candidatura } });

        const vaga = await Vagas.findOne({ where: { id_vaga: candidatura.id_vaga } });

        if (!vaga) {
            return res.status(404).json({ success: false, message: 'Vaga não encontrada.' });
        }

        const user = await User.findOne({ where: { email: candidatura.informacoes_contacto } });

        const userVisita = await userVisitante.findOne({ where: { email: candidatura.informacoes_contacto } });

        if (!user && !userVisita) {
            return res.status(404).json({ success: false, message: 'Candidato não encontrado.' });
        }

        const nomeCandidato = user ? user.nome_utilizador : userVisita ? userVisita.nome_utilizador : null;

        await Vagas.update(
            {
                data_atribuicao: new Date(),
                contacto_candidato_escolhido: candidatura.informacoes_contacto,
                candidato_escolhido: nomeCandidato,
                estado: 'Atribuída'
            },
            {
                where: { id_vaga: candidatura.id_vaga }
            }
        );

        await Candidaturas.update(
            {
                status: 'Análise Concluída',
                resultado: 'Não Atribuída',
                data_resultado: new Date()
            },
            {
                where: {
                    id_vaga: candidatura.id_vaga,
                    informacoes_contacto: {
                        [Op.ne]: candidatura.informacoes_contacto
                    }
                }
            }
        );

        await Candidaturas.update(
            { status: 'Análise Concluída',
                resultado: 'Atribuída',
                data_resultado: new Date()},
            {
                where: { id_candidatura }
            }
        );


        return res.status(200).json({ success: true, message: 'Vaga atribuída e candidatos rejeitados com sucesso.' });
    } catch (error) {
        console.error('Erro ao atribuir vaga:', error);
        return res.status(500).json({ success: false, message: 'Erro ao atribuir a vaga.' });
    }
};


const atualizarEstadoVagas = async () => {
    try {
        const hoje = new Date().toISOString();
        console.log('Data atual:', hoje);

        const result = await Vagas.update(
            { estado: 'Em análise' },
            {
                where: {
                    data_encerramento: {
                        [Op.lte]: hoje
                    }
                }
            }
        );

        console.log(`Vagas atualizadas: ${result[0]}`);
    } catch (error) {
        console.error('Erro ao atualizar o estado das vagas:', error);
    }
};

module.exports = { controllers, atualizarEstadoVagas };