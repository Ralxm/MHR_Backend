const Faltas = require('../models/Faltas');
var sequelize = require('../models/database');
const Perfis = require('../models/Perfis');
const Tipo_Faltas = require('../models/Tipo_Faltas');

const controller = {};

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

controller.faltasCreate = async function (req, res){
    const { id_tipofalta, id_perfil, id_calendario, data_falta, comentarios, estado, motivo} = req.body;

    const justificacao = req.file ? req.file.path : null;

    const data = await Faltas.create({
        id_tipofalta: id_tipofalta,
        id_perfil: id_perfil,
        id_calendario: id_calendario,
        data_falta: data_falta,
        motivo: motivo,
        justificacao: justificacao,
        estado: estado,
        comentarios: comentarios,
        created_at: getDate(),
        updated_at: getDate()
    })
    .then(function(data){
        res.status(200).json({
            success: true,
            message: "Falta criada com sucesso",
            data: data
        })
    })
    .catch(error =>{
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Erro a criar a falta",
            error: error.message
        })
    }
    )
}

controller.createManyFaltas = async function (req, res) {
    const faltasArray = req.body;
    
    if (!Array.isArray(faltasArray)) {
        return res.status(400).json({
            success: false,
            message: "O corpo do request deve ser um array de faltas"
        });
    }

    try {
        const faltasWithTimestamps = faltasArray.map(falta => ({
            ...falta,
            created_at: getDate(),
            updated_at: getDate(),
            estado: falta.estado || "Pendente",
            comentarios: falta.comentarios || null,
            motivo: falta.motivo || null,
            id_calendario: falta.id_calendario || null,
            justificacao: null
        }));

        const createdFaltas = await Faltas.bulkCreate(faltasWithTimestamps);

        res.status(200).json({
            success: true,
            message: 'Faltas criadas com sucesso',
            data: createdFaltas
        });
    } catch (error) {
        console.error("Error creating multiple faltas:", error);
        res.status(500).json({
            success: false,
            message: "Erro ao criar múltiplas faltas",
            error: error.message
        });
    }
};

controller.faltasList = async function (req, res){
    try {
        const data = await Faltas.findAll({
            include: [
                {
                    model: Perfis,
                    as: 'perfil',
                    required: false
                },
                {
                    model: Perfis,
                    as: 'validadorPerfil',
                    required: false
                },
                {
                    model: Tipo_Faltas,
                    as: 'tipo_falta',
                    required: false
                },
            ],
            order: ['data_falta']
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            justificacao: item.justificacao ? `${req.protocol}://${req.get('host')}/${item.justificacao}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as faltas",
            error: error.message
        });
    }
}

controller.faltasListUser = async function (req, res){
    const { id } = req.params
    try {
        const data = await Faltas.findAll({
            include: [
                {
                    model: Perfis,
                    as: 'perfil',
                    required: false
                },
                {
                    model: Perfis,
                    as: 'validadorPerfil',
                    required: false
                },
                {
                    model: Tipo_Faltas,
                    as: 'tipo_falta',
                    required: false
                },
            ],
            order: ['data_falta'],
            where: {id_perfil: id}
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            justificacao: item.justificacao ? `${req.protocol}://${req.get('host')}/${item.justificacao}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as faltas",
            error: error.message
        });
    }
}

controller.faltasListTipo = async function (req, res){
    const { id } = req.params
    try {
        const data = await Faltas.findAll({
            include: [
                {
                    model: Perfis,
                    as: 'perfil',
                    required: false
                },
                {
                    model: Perfis,
                    as: 'validadorPerfil',
                    required: false
                },
                {
                    model: Tipo_Faltas,
                    as: 'tipo_falta',
                    required: false
                },
            ],
            order: ['data_falta'],
            where: {id_tipofalta: id}
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            justificacao: item.justificacao ? `${req.protocol}://${req.get('host')}/${item.justificacao}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as faltas",
            error: error.message
        });
    }
}

controller.faltasListAprovadasManager = async function (req, res){
    const { id } = req.params
    try {
        const data = await Faltas.findAll({
            include: [
                {
                    model: Perfis,
                    as: 'perfil',
                    required: false
                },
                {
                    model: Perfis,
                    as: 'validadorPerfil',
                    required: false
                },
                {
                    model: Tipo_Faltas,
                    as: 'tipo_falta',
                    required: false
                },
            ],
            order: ['data_falta'],
            where: {validador: id, estado: "Aprovada"}
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            justificacao: item.justificacao ? `${req.protocol}://${req.get('host')}/${item.justificacao}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as faltas",
            error: error.message
        });
    }
}

controller.faltasListRejeitadasManager = async function (req, res){
    const { id } = req.params
    try {
        const data = await Faltas.findAll({
            include: [
                {
                    model: Perfis,
                    as: 'perfil',
                    required: false
                },
                {
                    model: Perfis,
                    as: 'validadorPerfil',
                    required: false
                },
                {
                    model: Tipo_Faltas,
                    as: 'tipo_falta',
                    required: false
                },
            ],
            order: ['data_falta'],
            where: {validador: id, estado: "Rejeitada"}
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            justificacao: item.justificacao ? `${req.protocol}://${req.get('host')}/${item.justificacao}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as faltas",
            error: error.message
        });
    }
}

controller.faltasListAprovadas = async function (req, res){
    try {
        const data = await Faltas.findAll({
            include: [
                {
                    model: Perfis,
                    as: 'perfil',
                    required: false
                },
                {
                    model: Perfis,
                    as: 'validadorPerfil',
                    required: false
                },
                {
                    model: Tipo_Faltas,
                    as: 'tipo_falta',
                    required: false
                },
            ],
            order: ['data_falta'],
            where: {estado: "Aprovadas"}
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            justificacao: item.justificacao ? `${req.protocol}://${req.get('host')}/${item.justificacao}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as faltas",
            error: error.message
        });
    }
}

controller.faltasListRejeitadas = async function (req, res){
    try {
        const data = await Faltas.findAll({
            include: [
                {
                    model: Perfis,
                    as: 'perfil',
                    required: false
                },
                {
                    model: Perfis,
                    as: 'validadorPerfil',
                    required: false
                },
                {
                    model: Tipo_Faltas,
                    as: 'tipo_falta',
                    required: false
                },
            ],
            order: ['data_falta'],
            where: {estado: "Rejeitadas"}
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            justificacao: item.justificacao ? `${req.protocol}://${req.get('host')}/${item.justificacao}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as faltas",
            error: error.message
        });
    }
}

controller.faltasListAnalise = async function (req, res){
    try {
        const data = await Faltas.findAll({
            include: [
                {
                    model: Perfis,
                    as: 'perfil',
                    required: false
                },
                {
                    model: Perfis,
                    as: 'validadorPerfil',
                    required: false
                },
                {
                    model: Tipo_Faltas,
                    as: 'tipo_falta',
                    required: false
                },
            ],
            order: ['data_falta'],
            where: {estado: "Em análise"}
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            justificacao: item.justificacao ? `${req.protocol}://${req.get('host')}/${item.justificacao}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao listar as faltas",
            error: error.message
        });
    }
}

controller.faltasGet = async function (req, res){
    const { id } = req.params;

    try {
        const data = await Faltas.findAll({
            include: [
                {
                    model: Perfis,
                    as: 'perfil',
                    required: false
                },
                {
                    model: Perfis,
                    as: 'validadorPerfil',
                    required: false
                },
                {
                    model: Tipo_Faltas,
                    as: 'tipo_falta',
                    required: false
                },
            ],
            where: { id_falta: id }
        });

        //Esta parte do código altera, na resposta, a variável anexo
        //Em vez de responder com o nome do ficheiro responde com o link onde o ficheiro está disponível no servidor
        const modifiedData = data.map(item => ({
            ...item.toJSON(),
            justificacao: item.justificacao ? `${req.protocol}://${req.get('host')}/${item.justificacao}` : null
        }));

        res.status(200).json({
            success: true,
            data: modifiedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao encontrar as faltas",
            error: error.message
        });
    }
}

controller.faltasDelete = async function (req, res){
    const { id } = req.params;
    const data = await Faltas.destroy({
        where: {id_falta: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Falta apagado"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a apagar a falta",
            error: error.message
        });
    })
}

controller.faltasUpdate = async function (req, res) {
    const { id } = req.params;
    const { id_calendario, id_perfil, id_tipofalta, comentarios, motivo, validador, data_falta, estado} = req.body;
 
    try {
        //Encontra o comentário que vamos atualizar
        const falta = await Faltas.findAll({ where: { id_falta: id } });

        //Se não encontrar o comentário responde com um erro
        if (!falta) {
            return res.status(404).json({
                success: false,
                message: "Falta não encontrado"
            });
        }

        //Esta parte do código verifica se o comentario já tem um ficheiro. Se sim, apaga-o e troca-o por um novo.
        //Se não for inserido nenhum ficheiro diferente/novo na atualização então o ficheiro anterior mantém-se
        let justificacao = falta.justificacao;
        if (req.file) {
            if (justificacao) {
                fs.unlinkSync(path.resolve(justificacao));
            }
            justificacao = req.file.path;
        }

        await Faltas.update({
            id_tipofalta: id_tipofalta,
            data_falta: data_falta,
            justificacao: justificacao,
            estado: estado,
            validador: validador === 'null' ? null : validador,
            comentarios: comentarios,
            motivo: motivo,
            updated_at: getDate()
        }, {
            where: { id_falta: id }
        });

        res.status(200).json({
            success: true,
            message: "Falta atualizada com sucesso"
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Erro ao atualizar a falta",
            error: error.message
        });
    }
};

controller.faltasJustificar = async function (req, res) {
    const { id } = req.params;
    const { motivo } = req.body;

    try {
        //Encontra o comentário que vamos atualizar
        const falta = await Faltas.findOne({ where: { id_falta: id } });

        //Se não encontrar o comentário responde com um erro
        if (!falta) {
            return res.status(404).json({
                success: false,
                message: "Falta não encontrado"
            });
        }

        //Esta parte do código verifica se o comentario já tem um ficheiro. Se sim, apaga-o e troca-o por um novo.
        //Se não for inserido nenhum ficheiro diferente/novo na atualização então o ficheiro anterior mantém-se
        let justificacao = falta.justificacao;
        if (req.file) {
            if (justificacao) {
                fs.unlinkSync(path.resolve(justificacao));
            }
            justificacao = req.file.path;
        }

        await Faltas.update({
            motivo:motivo, 
            updated_at: getDate()
        }, {
            where: { id_falta: id }
        });

        res.status(200).json({
            success: true,
            message: "Falta atualizada com sucesso"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao atualizar a falta",
            error: error.message
        });
    }
};

/*
controllers.falta_lista_user = async (req, res) => {
    try {
        const { id_user } = req.params;

        const user = await User.findOne({ where: { id_user } });
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilizador não encontrado" });
        }

        const faltas = await Faltas.findAll({ where: { id_calendario: user.id_calendario } });

        const faltasComUsers = await Promise.all(
            faltas.map(async (faltas) => {
                const autor = await User.findOne({ where: { id_calendario: faltas.id_calendario } });

                return {
                    ...faltas.toJSON(),
                    autor: autor ? autor.nome_utilizador : 'Sem autor'
                };
            })
        );
        res.json({ success: true, faltasComUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao listar férias", error });
    }
}

controllers.download_file = async (req, res) => {
    const { justificacao } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', 'files', justificacao);

    res.download(filePath, (err) => {
        if (err) {
            res.status(500).json({ message: 'Erro ao transferir ficheiro', error: err });
        }
    });
}



controllers.falta_adicionar = async (req, res) => {
    const { id_user, data_falta, estado, tipo } = req.body;
    const justificacao = req.file ? req.file.path : null;

    try {
        const user = await User.findOne({ where: { id_user } });

        if (!user) {
            return res.status(404).json({ success: false, message: "Utilizador não encontrado" });
        }

        const data = await Faltas.create({
            id_user: user.id_user,
            id_calendario: user.id_calendario,
            justificacao: justificacao,
            data_falta: data_falta,
            estado: estado,
            tipo: tipo,
        })
            .then(function (data) {
                return data;
            })
            .catch(error => {
                return error;
            });
        res.json({ success: true, data: data });
    } catch (error) {
        console.log(error);
    }
};

controllers.faltas_lista = async (req, res) => {
    try {
        const faltas = await Faltas.findAll();
        const faltasComUsers = await Promise.all(
            faltas.map(async (faltas) => {
                const autor = await User.findOne({ where: { id_calendario: faltas.id_calendario } });

                return {
                    ...faltas.toJSON(),
                    autor: autor ? autor.nome_utilizador : 'Sem autor'
                };
            })
        );
        res.json({ success: true, faltasComUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao listar faltas", error });
    }
}

controllers.faltas_aprovar = async (req, res) => {
    try {
        const { id_falta } = req.params;
        const { validador, tipo } = req.body;

        const faltas = await Faltas.update({ estado: 'Aprovada', validador: validador, tipo: tipo }, { where: { id_falta } });
        res.json({ success: true, faltas });
    } catch (error) {
        console.error("Erro ao aprovar solicitação de faltas:", error);
        res.status(500).json({ success: false, message: "Erro interno ao aprovar solicitação de faltas." });
    }
};

controllers.faltas_rejeitar = async (req, res) => {
    try {
        const { id_falta } = req.params;
        const { validador, comentarios } = req.body;
        const faltas = await Faltas.update({ estado: 'Rejeitada', validador: validador, comentarios: comentarios }, { where: { id_falta } });
        res.json({ success: true, faltas });
    } catch (error) {
        console.error("Erro ao aprovar solicitação de faltas:", error);
        res.status(500).json({ success: false, message: "Erro interno ao aprovar solicitação de faltas." });
    }
};
controllers.falta_apagar = async (req, res) => {
    const { id_falta } = req.body;
    const data = await Faltas.destroy({ where: { id_falta: id_falta } })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.status(200).json({
        success: true,
        message: "Falta apagada com sucesso!",
        data: data
    });
}

controllers.falta_atualizar = async (req, res) => {
    const { id_falta, id_user, data_falta, motivo } = req.body;
    const data = await Faltas.update({
        id_user: id_user,
        data_falta: data_falta,
        motivo: motivo
    }, { where: { id_falta: id_falta } })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.status(200).json({
        success: true,
        message: "Falta atualizada com sucesso!",
        data: data
    });
}

controllers.falta_detalhes = async (req, res) => {
    const { id_falta } = req.params;
    const data = await Faltas.findAll({ where: { id_falta: id_falta } })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.json({ success: true, data: data });
}

controllers.falta_adicionar_justificacao = async (req, res) => {
    const { id_falta } = req.params;
    const justificacao = req.file ? req.file.path : null;

    try {
        const data = await Faltas.update({ justificacao: justificacao, tipo: 'Justificada' }, { where: { id_falta } });
        res.json({ success: true, data: data });
    }
    catch (error) {
        console.error("Erro ao adicionar justificação de falta:", error);
        res.status(500).json({ success: false, message: "Erro interno ao adicionar justificação de falta." });
    }
}
    */

module.exports = controller;