const Blog = require('../models/Blog');
var sequelize = require('../models/database');
const Noticia = require('../models/Noticia');
const Visita = require('../models/Visita');
const User = require('../models/User');

const controllers = {};

sequelize.sync();

controllers.publicacoes_lista = async (req, res) => {
    try {
        const noticia = await Noticia.findAll();
        const visita = await Visita.findAll();
        const publicacoes = noticia.concat(visita);

        const PublicacoesComAutores = await Promise.all(
            publicacoes.map(async (publicacao) => {
                const user = await User.findOne({ where: { id_user: publicacao.id_user } });
                return {
                    ...publicacao.toJSON(),
                    autor: user ? user.nome_utilizador : 'Desconhecido'
                };
            })
        );
        res.json({ success: true,  PublicacoesComAutores });
    } catch (error) {
        console.error('Erro ao procurar publicações:', error);
        res.status(500).json({ success: false, message: 'Erro ao procurar publicações' });
    }
};


controllers.publicacoes_lista_validadas = async (req, res) => {

    try {
        

        const noticia = await Noticia.findAll({where: {estado: "Publicada"}});
        const visita = await Visita.findAll({where: {estado: "Publicada"}});

        const publicacoes = noticia.concat(visita);

        res.json({ success: true, publicacoes});
    }
    catch (error) {
        console.error('Erro ao procurar publicações:', error);
        res.status(500).json({ success: false, message: 'Erro ao procurar publicações' });
    }
}



controllers.publicacoes_eliminar = async (req, res) => {
    try {
        const { id_publicacao } = req.params;

        let publicacao = await Noticia.findOne({ where: { id_publicacao } });
        if (publicacao) {
            await Noticia.destroy({ where: { id_publicacao } });
            await Blog.destroy({ where: { id_publicacao } });
            return res.json({
                success: true,
                publicacao,
                tipo_publicacao: 'Notícia',
            });
        }

        publicacao = await Visita.findOne({ where: { id_publicacao } });
        if (publicacao) {
            await Visita.destroy({ where: { id_publicacao } });
            await Blog.destroy({ where: { id_publicacao } });
            return res.json({
                success: true,
                publicacao,
                tipo_publicacao: 'Visita',
            });
        }

        res.status(404).json({ success: false, message: "Publicação não encontrada" });
    } catch (error) {
        console.error('Erro ao eliminar publicação:', error);
        res.status(500).json({ success: false, message: 'Erro ao eliminar publicação', error });
    }
};

controllers.publicacoes_lista_por_validar = async (req, res) => {
    try {

        const noticia = await Noticia.findAll({where: {estado: "Em avaliação"}});
        const visita = await Visita.findAll({where: {estado: "Em avaliação"}});
        const publicacoes = noticia.concat(visita);
        res.json({ success: true, publicacoes });

    } catch (error) {
        console.error('Erro ao procurar publicações não validadas:', error);
        res.status(500).json({ success: false, message: 'Erro ao procurar publicações não validadas' });
    }
}

controllers.publicacao_detalhes = async (req, res) => {
    try {
        const { id_publicacao } = req.params;

       let publicacao = await Noticia.findOne({ where: { id_publicacao } });
        if (publicacao) {
            const user = await User.findOne({ where: { id_user: publicacao.id_user } });
            return res.json({
                success: true,
                publicacao,
                tipo_publicacao: 'Notícia',
                user: user ? { id_user: user.id_user, nome_utilizador: user.nome_utilizador } : null
            });
        }

        publicacao = await Visita.findOne({ where: { id_publicacao } });
        if (publicacao) {
            const user = await User.findOne({ where: { id_user: publicacao.id_user } });
            return res.json({
                success: true,
                publicacao,
                tipo_publicacao: 'Visita',
                user: user ? { id_user: user.id_user, nome_utilizador: user.nome_utilizador } : null
            });
        }

        res.status(404).json({ success: false, message: "Publicação não encontrada" });
    } catch (error) {
        console.error('Erro ao procurar detalhes da publicação:', error);
        res.status(500).json({ success: false, message: 'Erro ao procurar detalhes da publicação', error });
    }
}


controllers.rejeitar_publicacao = async (req, res) => {
    try {
        const { id_publicacao } = req.params;
        const { comentarios, validador, data_validacao } = req.body;

        const publicacao = await Blog.update(
            {
                validador: validador,
                data_validacao: data_validacao,
                comentarios: comentarios,
                estado: "Rejeitada"
            }, 
            { where: { id_publicacao: id_publicacao } }
        );

        if (publicacao[0] === 0) {
            return res.status(404).json({ success: false, message: 'Publicação não encontrada' });
        }

        await Noticia.update(
            {
                validador: validador,
                data_validacao: data_validacao,
                comentarios: comentarios,
                estado: "Rejeitada"
            }, 
            { where: { id_publicacao: id_publicacao } }
        );

        await Visita.update(
            {
                validador: validador,
                data_validacao: data_validacao,
                comentarios: comentarios,
                estado: "Rejeitada"
            }, 
            { where: { id_publicacao: id_publicacao } }
        );

        res.json({ success: true, message: 'Publicação rejeitada com sucesso', data: publicacao });
    } catch (error) {
        console.error('Erro ao rejeitar publicação:', error);
        res.status(500).json({ success: false, message: 'Erro ao rejeitar publicação', error });
    }
};

controllers.nao_publicar = async (req, res) => {
    try {
        const { id_publicacao } = req.params;

        const publicacao = await Blog.update(
            {
                estado: "Não Publicada"
            }, 
            { where: { id_publicacao: id_publicacao } }
        );

        if (publicacao[0] === 0) {
            return res.status(404).json({ success: false, message: 'Publicação não encontrada' });
        }

        await Noticia.update(
            {
                estado: "Não Publicada"
            }, 
            { where: { id_publicacao: id_publicacao } }
        );

        await Visita.update(
            {
                estado: "Não Publicada"
            }, 
            { where: { id_publicacao: id_publicacao } }
        );

        res.json({ success: true, message: 'Publicação não publicada com sucesso', publicacao });
    } catch (error) {
        console.error('Erro ao não publicar publicação:', error);
        res.status(500).json({ success: false, message: 'Erro ao não publicar publicação', error });
    }
}

controllers.publicar = async (req, res) => {
    try {
        const { id_publicacao } = req.params;

        const publicacao = await Blog.update(
            {
                estado: "Publicada"
            }, 
            { where: { id_publicacao: id_publicacao } }
        );

        if (publicacao[0] === 0) {
            return res.status(404).json({ success: false, message: 'Publicação não encontrada' });
        }

        await Noticia.update(
            {
                estado: "Publicada"
            }, 
            { where: { id_publicacao: id_publicacao } }
        );

        await Visita.update(
            {
                estado: "Não Publicada"
            }, 
            { where: { id_publicacao: id_publicacao } }
        );

        res.json({ success: true, message: 'Publicação não publicada com sucesso', publicacao });
    } catch (error) {
        console.error('Erro ao não publicar publicação:', error);
        res.status(500).json({ success: false, message: 'Erro ao não publicar publicação', error });
    }
}

controllers.minhas_publicacoes = async (req, res) => {
    try {
        const { id_user } = req.params;
        const noticia = await Noticia.findAll({ where: { id_user } });
        const visita = await Visita.findAll({ where: { id_user } });

        const publicacoes = noticia.concat(visita);
        
        res.json({ success: true, publicacoes });
    } catch (error) {
        console.error('Erro ao procurar publicações:', error);
        res.status(500).json({ success: false, message: 'Erro ao procurar publicações' });
    }
}
module.exports = controllers;