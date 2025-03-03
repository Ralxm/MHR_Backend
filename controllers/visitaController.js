const Blog = require('../models/Blog');
const Visita = require('../models/Visita');
var sequelize = require('../models/database');
const controllers = {};
const path = require('path');
const fs = require('fs');


sequelize.sync();

controllers.visitas_adicionar = async (req, res) => {
    try {
        const { local_visita, data_visita, duracao_visita, motivo_visita, descricao, id_user } = req.body;
        let imagem = req.file ? req.file.filename : 'public/img/Logo.png';
        const novaPublicacao = await Blog.create({
            titulo_publicacao: "Visita",
            tipo_publicacao: "Visita",
            estado: "Em avaliação",
        });

        const novaVisita = await Visita.create({
            tipo_publicacao: novaPublicacao.tipo_publicacao,
            id_publicacao: novaPublicacao.id_publicacao,
            estado: novaPublicacao.estado,
            descricao: descricao,
            imagem: imagem,
            titulo_publicacao: "Visita",
            local_visita: local_visita,
            data_visita: data_visita,
            duracao_visita: duracao_visita,
            motivo_visita: motivo_visita,
            id_user: id_user,
        });
        res.status(200).json({
            success: true,
            message: "Visita adicionada com sucesso!",
            data: novaVisita
        });
    } catch (error) {
        console.error('Erro ao adicionar visita:', error);
        res.status(500).json({

            success: false,
            message: "Erro ao adicionar visita",
            error: error.message
        });
    }
};

controllers.visitas_detalhes = async (req, res) => {
    try {
        const { id_visita } = req.params;
        const visita = await Visita.findOne({
            where: { id_visita }
        });

        if (visita) {
            res.json({ success: true, data: visita });
        } else {
            res.status(404).json({ success: false, message: "Visita não encontrada" });
        }
    } catch (error) {
        console.error("Erro ao buscar detalhes da visita:", error);
        res.status(500).json({ success: false, message: "Erro ao buscar detalhes da visita", error });
    }
};


controllers.visitas_aprovar = async (req, res) => {
    try {
        const { id_publicacao } = req.params;
        const { validador, titulo_publicacao, descricao, data_visita, local_visita, motivo_visita, duracao_visita } = req.body;
        const imagem = req.file ? req.file.path : 'public/img/Logo.png';

        const visita = await Visita.findOne({ where: { id_publicacao } });

        if (visita.imagem) {
            const oldFilePath = path.join(__dirname, '..', 'uploads', 'img', visita.imagem);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        const publicacao = await Blog.update(
            {
                titulo_publicacao: titulo_publicacao,
                validador: validador,
                data_validacao: new Date(),
                estado: "Publicada"
            }, {
            where: { id_publicacao: id_publicacao }
        });

        if (!publicacao[0]) {
            return res.status(400).json({ success: false, message: 'Falha ao atualizar a publicação' });
        }
        
        await Visita.update(
            {
                imagem: imagem ? imagem : visita.imagem,
                data_visita: data_visita,
                descricao: descricao,
                titulo_publicacao: titulo_publicacao,
                motivo_visita: motivo_visita,
                local_visita: local_visita,
                duracao_visita: duracao_visita,
                validador: validador,
                data_validacao: new Date(),
                estado: "Publicada"
            },
            { where: { id_publicacao: id_publicacao } }
        );

        res.json({ success: true, message: 'Publicação aprovar com sucesso', data: publicacao });
    } catch (error) {
        console.error('Erro ao aprovar publicação:', error);
        res.status(500).json({ success: false, message: 'Erro ao aprovar publicação', error });
    }
}

controllers.visitas_eliminar = async (req, res) => {
    const { id_visita } = req.body;
    const data = await Visita.destroy({
        where: {
            id_visita: id_visita
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


controllers.visitas_editar = async (req, res) => {
    try {
        const { id_publicacao } = req.params;
        const { titulo_publicacao, descricao, data_visita, local_visita, motivo_visita, duracao_visita } = req.body;
        const imagem = req.file ? req.file.path : 'public/img/Logo.png';

        const visita = await Visita.findOne({ where: { id_publicacao } });

        if (visita.imagem) {
            const oldFilePath = path.join(__dirname, '..', 'uploads', 'img', visita.imagem);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        const publicacao = await Blog.update(
            {
                titulo_publicacao: titulo_publicacao,
            }, {
            where: { id_publicacao: id_publicacao }
        });

        if (!publicacao[0]) {
            return res.status(400).json({ success: false, message: 'Falha ao atualizar a publicação' });
        }
        
        await Visita.update(
            {
                imagem: imagem ? imagem : visita.imagem,
                data_visita: data_visita,
                descricao: descricao,
                titulo_publicacao: titulo_publicacao,
                motivo_visita: motivo_visita,
                local_visita: local_visita,
                duracao_visita: duracao_visita,
            },
            { where: { id_publicacao: id_publicacao } }
        );

        res.json({ success: true, message: 'Publicação editada com sucesso', data: publicacao });
    } catch (error) {
        console.error('Erro ao editada publicação:', error);
        res.status(500).json({ success: false, message: 'Erro ao editada publicação', error });
    }
}

controllers.visitas_reenviar = async (req, res) => {
    try {
        const { id_publicacao } = req.params;
        const { titulo_publicacao, descricao, data_visita, local_visita, motivo_visita, duracao_visita } = req.body;
        const imagem = req.file ? req.file.path : 'public/img/Logo.png';

        const visita = await Visita.findOne({ where: { id_publicacao } });

        if (visita.imagem) {
            const oldFilePath = path.join(__dirname, '..', 'uploads', 'img', visita.imagem);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        const publicacao = await Blog.update(
            {
                titulo_publicacao: titulo_publicacao,
                estado: "Em avaliação"
            }, {
            where: { id_publicacao: id_publicacao }
        });

        if (!publicacao[0]) {
            return res.status(400).json({ success: false, message: 'Falha ao atualizar a publicação' });
        }
        
        await Visita.update(
            {
                imagem: imagem ? imagem : visita.imagem,
                data_visita: data_visita,
                descricao: descricao,
                titulo_publicacao: titulo_publicacao,
                motivo_visita: motivo_visita,
                local_visita: local_visita,
                duracao_visita: duracao_visita,
                estado: "Em avaliação"
            },
            { where: { id_publicacao: id_publicacao } }
        );

        res.json({ success: true, message: 'Publicação reenviada com sucesso', data: publicacao });
    } catch (error) {
        console.error('Erro ao reenviae publicação:', error);
        res.status(500).json({ success: false, message: 'Erro ao reenviae publicação', error });
    }
};

controllers.visitas_lista = async (req, res) => {
    const data = await Visita.findAll()
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.json({ success: true, data: data });
}

module.exports = controllers;
