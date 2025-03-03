const Ideias = require('../models/Ideia');
const User = require('../models/User');
const Projetos = require('../models/Projetos');
var sequelize = require('../models/database');
const path = require('path');
const fs = require('fs');

const controllers = {};

sequelize.sync();

controllers.adicionar_ideia = async (req, res) => {

    const { id_user, titulo_ideia, descricao } = req.body;
    const ficheiro_complementar = req.file ? req.file.path : null;

    try {
        const ideias = await Ideias.create({
            id_user: id_user,
            titulo_ideia: titulo_ideia,
            descricao: descricao,
            ficheiro_complementar: ficheiro_complementar,
            data_criacao: new Date(),
            estado: 'Em estudo'
        });

        res.json({ success: true, ideias });
    } catch (error) {
        console.log(error);
    }
};

controllers.download_file = async (req, res) => {
    const { ficheiro_complementar } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', 'files', ficheiro_complementar);

    res.download(filePath, (err) => {
        if (err) {
            res.status(500).json({ message: 'Erro ao transferir ficheiro', error: err });
        }
    });
}

controllers.ideias_lista = async (req, res) => {
    try {
        const ideias = await Ideias.findAll({ where: { estado: ['Aprovada', 'Rejeitada'] } });
        const ideiasComAutores = await Promise.all(
            ideias.map(async (ideia) => {
                const user = await User.findOne({ where: { id_user: ideia.id_user } });
                return {
                    ...ideia.toJSON(),
                    autor: user ? user.nome_utilizador : 'Desconhecido'
                };
            })
        );

        res.json({
            success: true,
            ideias: ideiasComAutores,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

controllers.ideias_lista_em_estudo = async (req, res) => {
    try {
        const ideias = await Ideias.findAll({ where: { estado: 'Em estudo' } });
        const ideiasComAutores = await Promise.all(
            ideias.map(async (ideia) => {
                const user = await User.findOne({ where: { id_user: ideia.id_user } });
                return {
                    ...ideia.toJSON(),
                    autor: user ? user.nome_utilizador : 'Desconhecido'
                };
            })
        );

        res.json({
            success: true,
            ideias: ideiasComAutores,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

controllers.ideias_lista_user = async (req, res) => {
    const { id_user } = req.params;

    try {
        const ideias = await Ideias.findAll({ where: { id_user } });

        res.json({ success: true, ideias });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

controllers.ideias_reformular = async (req, res) => {
    const { id_ideia } = req.params;
    const {id_user, titulo_ideia, descricao } = req.body;
    const ficheiro_complementar = req.file ? req.file.path : null;

    try {
        const ideia = await Ideias.findOne({ where: { id_ideia } });

        if (!ideia) {
            return res.status(404).json({
                success: false,
                message: "Ideia não encontrada"
            });
        }

        if (ideia.ficheiro_complementar) {
            const oldFilePath = path.join(__dirname, '..', 'uploads', 'files', ideia.ficheiro_complementar);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        await Ideias.update({
            titulo_ideia: titulo_ideia,
            descricao: descricao,
            ficheiro_complementar: ficheiro_complementar || ideia.ficheiro_complementar,
            estado: 'Em estudo',
            id_user: id_user
        }, {
            where: { id_ideia }
        });

        const updatedIdeia = await Ideias.findOne({ where: { id_ideia } });

        res.status(200).json({
            success: true,
            message: "Ideia atualizada com sucesso!",
            updatedIdeia
        });
    } catch (error) {
        console.error('Erro ao atualizar ideia:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar ideia',
            error: error.message 
        });
    }
}

controllers.ideias_detalhes = async (req, res) => {
    const { id_ideia } = req.params;
    const data = await Ideias.findAll({
        where: {
            id_ideia: id_ideia
        }
    })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.json({ success: true, data: data });
}

controllers.ideias_atualizar = async (req, res) => {
    const { id_ideia } = req.params;
    const { titulo_ideia, descricao } = req.body;
    const ficheiro_complementar = req.file ? req.file.path : null;

    try {
        const ideia = await Ideias.findOne({ where: { id_ideia } });

        if (!ideia) {
            return res.status(404).json({
                success: false,
                message: "Ideia não encontrada"
            });
        }

        if (ideia.ficheiro_complementar) {
            const oldFilePath = path.join(__dirname, '..', 'uploads', 'files', ideia.ficheiro_complementar);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        await Ideias.update({
            titulo_ideia: titulo_ideia,
            descricao: descricao,
            ficheiro_complementar: ficheiro_complementar || ideia.ficheiro_complementar
        }, {
            where: { id_ideia }
        });

        const updatedIdeia = await Ideias.findOne({ where: { id_ideia } });

        res.status(200).json({
            success: true,
            message: "Ideia atualizada com sucesso!",
            updatedIdeia
        });
    } catch (error) {
        console.error('Erro ao atualizar ideia:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar ideia',
            error: error.message 
        });
    }
}

controllers.aprovar_ideia = async (req, res) => {
    try {
        const { id_ideia } = req.params;
        const { validador, data_conclusao, data_inicio} = req.body;
        let imagem = req.file ? req.file.filename : 'public/img/background.jpg';
        const atualizarIdeia = await Ideias.update(
            {
                validador: validador,
                estado: "Aprovada"
            }, {
            where: { id_ideia }
        });
        if (atualizarIdeia[0] === 0) {
            return res.status(404).json({ success: false, message: "Ideia não encontrada." });
        }

        const ideia = await Ideias.findOne({ where: { id_ideia } });

        if (!ideia) {
            return res.status(404).json({ success: false, message: "Ideia não encontrada." });
        }

        const projetoCriado = await Projetos.create(
            {
                titulo_projeto: ideia.titulo_ideia,
                descricao: ideia.descricao,
                estado: "Em desenvolvimento",
                imagem: imagem,
                data_criacao: new Date(),
                data_atribuicao: new Date(),
                data_final_prevista: data_conclusao,
                data_inicio:data_inicio,
            }
        );
        const users = await User.findAll();

        const userAleatorio = users[Math.floor(Math.random() * users.length)];

        if (!userAleatorio) {
            return res.status(400).json({
                success: false,
                message: "Nenhum utilizador disponível para atribuição",
            });
        }

        await Projetos.update({ responsavel: userAleatorio.nome_utilizador }, { where: { id_projeto: projetoCriado.id_projeto } });




        await Ideias.update(
            {
                id_projeto: projetoCriado.id_projeto
            }, {
            where: { id_ideia }
        });

        res.status(200).json({
            success: true,
            message: "Projeto adicionado com sucesso!",
            projetoCriado,
        });
    } catch (error) {
        console.error('Erro ao aprovar ideia:', error);
        res.status(500).json({ success: false, message: 'Erro ao aprovar ideia', error });
    }
};


controllers.rejeitar_ideia = async (req, res) => {
    const { id_ideia } = req.params;
    const { comentarios, validador } = req.body;

    const data = await Ideias.update({
        estado: 'Rejeitada',
        validador: validador,
        comentarios: comentarios
    }, {
        where: {
            id_ideia: id_ideia
        }
    })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.json({ success: true, data: data });
}

module.exports = controllers;