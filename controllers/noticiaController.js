const Noticia = require('../models/Noticia');
var sequelize = require('../models/database');
const Blog = require('../models/Blog');
const path = require('path');
const fs = require('fs');
const controllers = {};

sequelize.sync();

controllers.noticias_adicionar = async (req, res) => {
    try {
        const { id_user, titulo_publicacao, descricao, data_noticia } = req.body;
        const imagem = req.file ? req.file.path : null;

        const imagemAtualizada = imagem ? imagem : 'public/img/Logo.png';

        const novaPublicacao = await Blog.create({
            titulo_publicacao: titulo_publicacao,
            tipo_publicacao: "Notícia",
            estado: "Em avaliação",
        });

        const dataFormatada = new Date(data_noticia).toISOString().split('T')[0];

        const noticiaNova = await Noticia.create({
            id_user: id_user,
            id_publicacao: novaPublicacao.id_publicacao,
            estado: novaPublicacao.estado,
            tipo_publicacao: novaPublicacao.tipo_publicacao,
            titulo_publicacao: titulo_publicacao,
            descricao: descricao,
            data_noticia: dataFormatada,
            imagem: imagemAtualizada,
        });

        res.status(200).json({
            success: true,
            message: "Noticia adicionada com sucesso!",
            data: noticiaNova
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao adicionar noticia",
            error: error.message
        });
    }
};
controllers.noticias_detalhes = async (req, res) => {
    try {
        const { id_noticia } = req.params;
        const noticia = await Noticia.findOne({
            where: { id_noticia }
        });

        if (noticia) {
            res.json({ success: true, data: noticia });
        } else {
            res.status(404).json({ success: false, message: "Notícia não encontrada" });
        }
    } catch (error) {
        console.error("Erro ao buscar detalhes da notícia:", error);
        res.status(500).json({ success: false, message: "Erro ao buscar detalhes da notícia", error });
    }
};

controllers.noticias_editar = async (req, res) => {
    try {
        const { id_publicacao } = req.params;
        const { validador, titulo_publicacao, descricao, data_noticia } = req.body;
        const imagem = req.file ? req.file.path : 'public/img/Logo.png';

        const noticia = await Noticia.findOne({ where: { id_publicacao } });

        if (noticia.imagem) {
            const oldFilePath = path.join(__dirname, '..', 'uploads', 'img', noticia.imagem);
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

        await Noticia.update(
            {
                imagem: imagem ? imagem : noticia.imagem,
                data_noticia: data_noticia,
                descricao: descricao,
                titulo_publicacao: titulo_publicacao,
            },
            { where: { id_publicacao: id_publicacao } }
        );
        res.json({ success: true, message: 'Publicação editada com sucesso', data: publicacao });
    } catch (error) {
        console.error('Erro ao editada publicação:', error);
        res.status(500).json({ success: false, message: 'Erro ao editada publicação', error });
    }
};

controllers.noticias_aprovar = async (req, res) => {
    try {
        const { id_publicacao } = req.params;
        const {  titulo_publicacao, descricao, data_noticia, validador} = req.body;
       

        const noticia = await Noticia.findOne({ where: { id_publicacao } });
        const imagem = req.file ? req.file.filename : noticia.imagem;
        if (noticia.imagem) {
            const oldFilePath = path.join(__dirname, '..', 'uploads', 'img', noticia.imagem);
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

        await Noticia.update(
            {
                imagem: imagem ? imagem : noticia.imagem,
                data_noticia: data_noticia,
                descricao: descricao,
                titulo_publicacao: titulo_publicacao,
                validador: validador,
                data_validacao: new Date(),
                estado: "Publicada"
            },
            { where: { id_publicacao: id_publicacao } }
        );
        res.json({ success: true, message: 'Publicação aprovada com sucesso', data: publicacao });
    } catch (error) {
        console.error('Erro ao aprovar publicação:', error);
        res.status(500).json({ success: false, message: 'Erro ao aprovar publicação', error });
    }
}

controllers.noticias_reenviar = async (req, res) => {
    try {
        const { id_publicacao } = req.params;
        const {  titulo_publicacao, descricao, data_noticia } = req.body;
        const imagem = req.file ? req.file.path : 'public/img/Logo.png';

        const noticia = await Noticia.findOne({ where: { id_publicacao } });

        if (noticia.imagem) {
            const oldFilePath = path.join(__dirname, '..', 'uploads', 'img', noticia.imagem);
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

        await Noticia.update(
            {
                imagem: imagem ? imagem : noticia.imagem,
                data_noticia: data_noticia,
                descricao: descricao,
                titulo_publicacao: titulo_publicacao,
                estado: "Em avaliação"
            },
            { where: { id_publicacao: id_publicacao } }
        );
        res.json({ success: true, message: 'Publicação reenviada com sucesso', data: publicacao });
    } catch (error) {
        console.error('Erro ao reenviar publicação:', error);
        res.status(500).json({ success: false, message: 'Erro ao reenviar publicação', error });
    }
}


controllers.noticias_lista = async (req, res) => {
    try {
        const data = await Noticia.findAll();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar noticias",
            error
        });
    }
};

module.exports = controllers;
