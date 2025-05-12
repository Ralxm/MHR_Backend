const Comentarios_Projetos = require('../models/Comentarios_Projetos');
const Perfis = require('../models/Perfis');
const fs = require('fs');
const path = require('path');
var sequelize = require('../models/database');
const controller = {};
const AuditLog = require('../models/AuditLog')

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

controller.comentarioProjetoCreate = async function (req, res) {
    const { id_projeto, id_ideia, autor, comentario } = req.body;
    const anexo = req.file ? req.file.path : null;

    const toNullIfStringNull = (value) => (value === "null" || value === "undefined") ? null : value;

    try {
        const data = await Comentarios_Projetos.create({
            id_projeto: toNullIfStringNull(id_projeto),
            id_ideia: toNullIfStringNull(id_ideia),
            autor: autor,
            comentario: comentario,
            anexo: anexo,
            created_at: getDate(),
            updated_at: getDate()
        })

        await AuditLog.create({
            utilizador: autor,
            data_atividade: getDate(),
            tipo_atividade: "Criação de comentário em projeto",
            descricao: "Perfil com ID " + autor + " criou um comentário no projeto com ID: " + id_projeto
        })

        res.status(200).json({
            success: true,
            message: "Comentario criado com sucesso no projeto",
            data: data
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro a criar o Projeto",
            error: error.message
        })
    }
}

controller.comentarioProjetoList = async function (req, res) {
    try {
        const data = await Comentarios_Projetos.findAll({
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: Perfis,
                    as: 'perfil',
                    required: false
                },
            ],
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            anexo: item.anexo ? `${req.protocol}://${req.get('host')}/${item.anexo}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar os Projetos",
            error: error.message
        });
    }
}

controller.comentarioProjetoListPorProjeto = async function (req, res) {
    const { id } = req.params;
    try {
        const data = await Comentarios_Projetos.findAll({
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: Perfis,
                    as: 'perfil',
                    required: false
                },
            ],
            where: { id_projeto: id }
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            anexo: item.anexo ? `${req.protocol}://${req.get('host')}/${item.anexo}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar os Projetos",
            error: error.message
        });
    }
}

controller.comentarioProjetoListPorIdeia = async function (req, res) {
    const { id } = req.params;
    try {
        const data = await Comentarios_Projetos.findAll({
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: Perfis,
                    as: 'perfil',
                    required: false
                },
            ],
            where: { id_ideia: id }
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            anexo: item.anexo ? `${req.protocol}://${req.get('host')}/${item.anexo}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar os Projetos",
            error: error.message
        });
    }
}

controller.comentarioProjetoListPorUser = async function (req, res) {
    const { id } = req.params;
    try {
        const data = await Comentarios_Projetos.findAll({
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: Perfis,
                    as: 'perfil',
                    required: false
                },
            ],
            where: { id_comentario_projeto: id }
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            anexo: item.anexo ? `${req.protocol}://${req.get('host')}/${item.anexo}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar os Projetos",
            error: error.message
        });
    }
}

controller.comentarioProjetoGet = async function (req, res) {
    const { id } = req.params;

    try {
        const data = await Comentarios_Projetos.findAll({
            where: { id_comentario_projeto: id },
            include: [
                {
                    model: Perfis,
                    as: 'perfil',
                    required: false
                },
            ],
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            anexo: item.anexo ? `${req.protocol}://${req.get('host')}/${item.anexo}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao encontrar o Projeto",
            error: error.message
        });
    }
}

controller.comentarioProjetoDelete = async function (req, res) {
    const { id } = req.params;

    try {
        const data = await Comentarios_Projetos.destroy({
            where: { id_comentario_projeto: id }
        })

        await AuditLog.create({
            data_atividade: getDate(),
            tipo_atividade: "Eliminação de comentário em projeto",
            descricao: "Comentário em projeto com ID " + id + " foi apagado"
        })

        res.status(200).json({
            success: true,
            message: "Comentário em projeto apagado"
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro a apagar o comentário",
            error: error.message
        });
    }
}

controller.comentarioProjetoUpdate = async function (req, res) {
    const { id } = req.params;
    const { comentario } = req.body;

    try {
        //Encontra o comentário que vamos atualizar
        const comentarioProjeto = await Comentarios_Projetos.findOne({ where: { id_comentario_projeto: id } });

        //Se não encontrar o comentário responde com um erro
        if (!comentarioProjeto) {
            return res.status(404).json({
                success: false,
                message: "Comentário não encontrado"
            });
        }

        //Esta parte do código verifica se o comentario já tem um ficheiro. Se sim, apaga-o e troca-o por um novo.
        //Se não for inserido nenhum ficheiro diferente/novo na atualização então o ficheiro anterior mantém-se
        let anexo = comentarioProjeto.anexo;
        if (req.file) {
            if (anexo) {
                fs.unlinkSync(path.resolve(anexo));
            }
            anexo = req.file.path;
        }

        await Comentarios_Projetos.update({
            id_projeto,
            id_ideia,
            autor,
            comentario,
            anexo,
            updated_at: getDate()
        }, {
            where: { id_utilizador: id }
        });

        res.status(200).json({
            success: true,
            message: "Comentário atualizado com sucesso"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao atualizar o comentário",
            error: error.message
        });
    }
};



module.exports = controller;