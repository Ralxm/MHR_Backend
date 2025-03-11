const Blog = require('../models/Blog');
const multer = require('multer');
var sequelize = require('../models/database');

const controller = {};

sequelize.sync();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('imagem');

function getDate(){
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    let today = `${yyyy}-${mm}-${dd}`;
    return today;
}

controller.blogCreate = async function (req, res){
    upload(req, res, async (err) =>{
        if(err){
            return res.status(500).json({
                success: false,
                message: "Erro ao fazer upload da imagem",
                error: err.message
            });
        }

        const { id_perfil, tipo, titulo, texto, data_noticia, local_visita, data_visita, duracao_visita, motivo_visita, estado, validador, data_validacao, imagem } = req.body;

        try{
            const data = await Blog.create({
                id_perfil: id_perfil,
                tipo: tipo,
                titulo: titulo,
                texto: texto,
                data_noticia: data_noticia,
                local_visita: local_visita,
                data_visita: data_visita,
                duracao_visita: duracao_visita,
                motivo_visita: motivo_visita,
                estado: estado,
                validador: validador,
                data_validacao: data_validacao,
                created_at: getDate(),
                updated_at: getDate(),
                imagem:  req.file ? req.file.buffer : null,
                views: 0
            })

            res.status(200).json({
                success: true,
                message: "Publicação criada no blog",
                data: data
            });
        } catch(error){
            res.status(500).json({
                success: false,
                message: "Erro ao criar a publicação no blog",
                error: error,
            });
        }
    })
}

controller.blogList = async function (req, res){
    const data = await Blog.findAll({order: ['titulo_vaga']})
    .then(function(data) {
        const posts = data.map(post => {
            if(post.imagem){
                post.imagem = post.imagaem.toString('base64')
            }
            return post;
        })
        res.status(200).json({
            success: true,
            data: posts
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar as publicações",
            error: error.message
        });
    });
}

controller.blogListUser = async function (req, res){
    const { id } = req.params;
    const data = await Blog.findAll({order: ['titulo_vaga']},{where: {id_perfil: id}})
    .then(function(data) {
        const posts = data.map(post => {
            if(post.imagem){
                post.imagem = post.imagaem.toString('base64')
            }
            return post;
        })
        res.status(200).json({
            success: true,
            data: posts
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar as publicações",
            error: error.message
        });
    });
}

controller.blogListValidadas = async function (req, res){
    const data = await Blog.findAll({order: ['titulo_vaga']},{where: {estado:"Validada"}})
    .then(function(data) {
        const posts = data.map(post => {
            if(post.imagem){
                post.imagem = post.imagaem.toString('base64')
            }
            return post;
        })
        res.status(200).json({
            success: true,
            data: posts
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar as publicações",
            error: error.message
        });
    });
}

controller.blogListPorValidar = async function (req, res){
    const data = await Blog.findAll({order: ['titulo_vaga']},{where: {estado:"Por Validar"}})
    .then(function(data) {
        const posts = data.map(post => {
            if(post.imagem){
                post.imagem = post.imagaem.toString('base64')
            }
            return post;
        })
        res.status(200).json({
            success: true,
            data: posts
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar as publicações",
            error: error.message
        });
    });
}

controller.blogListRejeitada = async function (req, res){
    const data = await Blog.findAll({order: ['titulo_vaga']},{where: {estado:"Rejeitada"}})
    .then(function(data) {
        const posts = data.map(post => {
            if(post.imagem){
                post.imagem = post.imagaem.toString('base64')
            }
            return post;
        })
        res.status(200).json({
            success: true,
            data: posts
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar as publicações",
            error: error.message
        });
    });
}


controller.blogGet = async function (req, res){
    const { id } = req.params;
    const data = await Blog.findAll({
        where: { id_publicacao: id }
    })
    .then(function(data) {
        const posts = data.map(post => {
            if (post.IMAGEM) {
                post.IMAGEM = post.IMAGEM.toString('base64');
            }
            return post;
        });

        res.status(200).json({
            success: true,
            data: posts
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a encontrar a publicação",
            error: error
        });
    })
}

controller.blogDelete = async function (req, res){
    const { id } = req.params;
    const data = await Blog.destroy({
        where: {id_publicacao: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Vaga apagada"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a apagar a publicação",
            error: error.message
        });
    })
}

controller.blogUpdate = async function (req, res) {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Erro ao fazer upload da imagem",
                error: err.message
            });
        }

        const { id } = req.params;
        const { tipo, titulo, texto, data_noticia, local_visita, data_visita, duracao_visita, motivo_visita, estado, validador, data_validacao } = req.body;

        try {
            const blogPost = await Blog.findOne({ where: { id_publicacao: id } });
            if (!blogPost) {
                return res.status(404).json({
                    success: false,
                    message: "Publicação não encontrada"
                });
            }

            let imagem = blogPost.imagem; 
            if (req.file) {
                imagem = req.file.buffer;
            }

            await Blog.update({
                tipo: tipo,
                titulo: titulo,
                texto: texto,
                data_noticia: data_noticia,
                local_visita: local_visita,
                data_visita: data_visita,
                duracao_visita: duracao_visita,
                motivo_visita: motivo_visita,
                estado: estado,
                validador: validador,
                data_validacao: data_validacao,
                updated_at: getDate(),
                imagem: imagem
            }, {
                where: { id_publicacao: id }
            });

            res.status(200).json({
                success: true,
                message: "Publicação atualizada com sucesso"
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Erro ao atualizar a publicação",
                error: error.message
            });
        }
    });
};

controller.blogValidar = async function (req, res) {
    const { id } = req.params;
    const data = await Blog.update({
        estado: "Validada"
    },{
        where: {id_publicacao: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Publicação aprovada com sucesso"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a aprovar a publicação",
            error: error.message
        });
    })
};

controller.blogRejeitar = async function (req, res) {
    const { id } = req.params;
    const data = await Blog.update({
        estado: "Rejeitada"
    },{
        where: {id_publicacao: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Publicação rejeitada com sucesso"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a rejeitar a publicação",
            error: error.message
        });
    })
};


/*controllers.publicacoes_lista = async (req, res) => {
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
    */
module.exports = controllers;