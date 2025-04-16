const Ferias = require('../models/Ferias');
var sequelize = require('../models/database');
const Perfis = require('../models/Perfis');

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

controller.feriasCreate = async function (req, res){
    const { id_perfil, id_calendario, data_inicio, data_conclusao, duracao } = req.body;
    const data = await Ferias.create({
        id_perfil: id_perfil,
        id_calendario: id_calendario,
        data_inicio: data_inicio,
        data_conclusao: data_conclusao,
        data_pedido: getDate(),
        duracao: duracao,
        estado: "Pendente",
        created_at: getDate(),
        updated_at: getDate()
    })
    .then(function(data){
        res.status(200).json({
            success: true,
            message: "Férias criadas com sucesso",
            data: data
        })
    })
    .catch(error =>{
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Erro a criar as férias",
            error: error.message
        })
    }
    )
}

controller.feriasList = async function (req, res){
    const data = await Ferias.findAll({
        order: ['data_inicio'],
        include: [
            {
                model: Perfis,
                as: 'perfil',
                required: false
            },
        ],
    })
    .then(function(data) {
        res.status(200).json({
            success: true,
            data: data
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar as férias",
            error: error.message
        });
    });
}

controller.feriasListEmAnalise = async function (req, res){
    const data = await Ferias.findAll({
        order: ['data_inicio'],
        where: {estado: "Em análise"},
        include: [
            {
                model: Perfis,
                as: 'perfil',
                required: false
            },
        ],
    })
    .then(function(data) {
        res.status(200).json({
            success: true,
            data: data
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar as férias",
            error: error.message
        });
    });
}

controller.feriasListAprovadas = async function (req, res){
    const data = await Ferias.findAll({
        order: ['data_inicio'],
        where: {estado: "Aprovada"},
        include: [
            {
                model: Perfis,
                as: 'perfil',
                required: false
            },
        ],
    })
    .then(function(data) {
        res.status(200).json({
            success: true,
            data: data
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar as férias",
            error: error.message
        });
    });
}

controller.feriasListAprovadas = async function (req, res){
    const { id } = req.params
    const data = await Ferias.findAll({
        order: ['data_inicio'], 
        where: {id_perfil: id},
        include: [
            {
                model: Perfis,
                as: 'perfil',
                required: false
            },
        ],
    })
    .then(function(data) {
        res.status(200).json({
            success: true,
            data: data
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar as férias",
            error: error.message
        });
    });
}

controller.feriasListRejeitadas = async function (req, res){
    const data = await Ferias.findAll({
        order: ['data_inicio'],
        where: {estado: "Rejeitada"},
        include: [
            {
                model: Perfis,
                as: 'perfil',
                required: false
            },
        ],
    })
    .then(function(data) {
        res.status(200).json({
            success: true,
            data: data
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar as férias",
            error: error.message
        });
    });
}

controller.feriasListUser = async function (req, res){
    const { id } = req.params
    const data = await Ferias.findAll({
        order: ['data_inicio'],
        where: {id_perfil: id},
        include: [
            {
                model: Perfis,
                as: 'perfil',
                required: false
            },
        ],
    })
    .then(function(data) {
        res.status(200).json({
            success: true,
            data: data
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar as férias",
            error: error.message
        });
    });
}

controller.feriasGet = async function (req, res){
    const { id } = req.params;
    const data = await Ferias.findAll({
        where: { id_solicitacao: id },
        include: [
            {
                model: Perfis,
                as: 'perfil',
                required: false
            },
        ],
    })
    .then(function(data) {
        res.status(200).json({
            success: true,
            data: data
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a encontrar as ferias",
            error: error
        });
    })
}

controller.feriasDelete = async function (req, res){
    const { id } = req.params;
    const data = await Ferias.destroy({
        where: {id_solicitacao: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Férias apagado"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a apagar as férias",
            error: error.message
        });
    })
}

controller.feriasUpdate = async function (req, res){
    const { id } = req.params;
    const { data_inicio, data_conclusao, duracao, estado, validador, comentarios } = req.body;
    console.log(data_inicio)
    console.log(data_conclusao)
    console.log(duracao)
    console.log(estado)
    console.log(validador)
    console.log(comentarios)
    const data = await Ferias.update({
        data_inicio: data_inicio,
        data_conclusao: data_conclusao,
        duracao: duracao,
        estado: estado,
        validador: validador == "null" ? null : validador,
        comentarios: comentarios,
        updated_at: getDate()
    },{
        where: {id_solicitacao: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Férias alteradas com sucesso"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a apagar as férias",
            error: error.message
        });
    })
}

/*controllers.ferias_lista_  = async (req, res) => {
    try {
        const { id_user } = req.params;

        const user = await User.findOne({ where: { id_user } });
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilizador não encontrado" });
        }

        const ferias = await Ferias.findAll({ where: { id_calendario: user.id_calendario } });

        
const feriasComUsers = await Promise.all(
            ferias.map(async (ferias) => {
                const autor = await User.findOne({ where: { id_calendario: ferias.id_calendario } });

                return {
                    ...ferias.toJSON(),
                    autor: autor ? autor.nome_utilizador : 'Sem autor'
                };
            })
        );
        res.json({ success: true, feriasComUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao listar férias", error });
    }
}

controllers.ferias_lista = async (req, res) => {
    try {
        const ferias = await Ferias.findAll();
        const feriasComUsers = await Promise.all(
            ferias.map(async (ferias) => {
                const autor = await User.findOne({ where: { id_calendario: ferias.id_calendario } });

                return {
                    ...ferias.toJSON(),
                    autor: autor ? autor.nome_utilizador : 'Sem autor'
                };
            })
        );
        res.json({ success: true, feriasComUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao listar férias", error });
    }
}

controllers.ferias_lista_aprovadas_user = async (req, res) => {
    try {
        const { id_user } = req.params;

        const user = await User.findOne({ where: { id_user } });
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilizador não encontrado" });
        }

        const ferias = await Ferias.findAll({ where: { id_calendario: user.id_calendario, estado: 'Aprovada' } });

        res.json({ success: true, ferias });

    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao listar férias", error });
    }
}


controllers.ferias_adicionar = async (req, res) => {
    const { id_user, data_inicio, data_conclusao, estado} = req.body;

    try {

        const user = await User.findOne({ where: { id_user } });

        if (!user) {
            return res.status(404).json({ success: false, message: "Utilizador não encontrado" });
        }
        const duracao = Math.ceil((new Date(data_conclusao) - new Date(data_inicio)) / (1000 * 60 * 60 * 24));
        const novaFerias = await Ferias.create({
            id_user: user.id_user,
            id_calendario: user.id_calendario,
            data_inicio: data_inicio,
            data_conclusao: data_conclusao,
            duracao: duracao,
            estado: estado
        });

        res.json({ success: true, data: novaFerias });
    } catch (error) {
        console.error("Erro ao adicionar solicitação de férias:", error);
        res.status(500).json({ success: false, message: "Erro interno ao adicionar solicitação de férias." });
    }
};

controllers.ferias_aprovar = async (req, res) => {
    try {
        const { id_solicitacao } = req.params;
        const { validador } = req.body;
        const ferias = await Ferias.update({ estado: 'Aprovada', validador: validador }, { where: { id_solicitacao } });
        res.json({ success: true, ferias });
    } catch (error) {
        console.error("Erro ao aprovar solicitação de férias:", error);
        res.status(500).json({ success: false, message: "Erro interno ao aprovar solicitação de férias." });
    }
};

controllers.ferias_rejeitar = async (req, res) => {
    try {
        const { id_solicitacao } = req.params;
        const { validador, comentarios } = req.body;
        const ferias = await Ferias.update({ estado: 'Rejeitada', validador: validador, comentarios:comentarios }, { where: { id_solicitacao } });
        res.json({ success: true, ferias });
    } catch (error) {
        console.error("Erro ao aprovar solicitação de férias:", error);
        res.status(500).json({ success: false, message: "Erro interno ao aprovar solicitação de férias." });
    }
};



controllers.ferias_apagar = async (req, res) => {
    const { id_solicitacao } = req.params;
    try{ 
        const ferias = await Ferias.destroy({
            where: { id_solicitacao }
        })
        res.json({ success: true, ferias, message: "Férias eliminadas com sucesso!" });
    }
    catch (error) {
        console.error("Erro ao apagar solicitação de férias:", error);
        res.status(500).json({ success: false, message: "Erro interno ao apagar solicitação de férias." });
    }
}

controllers.ferias_atualizar = async (req, res) => {
    const { id_ferias, id_user, data_inicio, data_conclusao } = req.body;
    const data = await Ferias.update({
        id_user: id_user,
        data_inicio: data_inicio,
        data_conclusao: data_conclusao
    }, {
        where: { id_ferias: id_ferias }
    })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.status(200).json({
        success: true,
        message: "Pedido de férias atualizado com sucesso!",
        data: data
    });
}

controllers.ferias_detalhes = async (req, res) => {
    const { id_ferias } = req.params;
    const data = await Ferias.findAll({ where: { id_ferias: id_ferias } })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            return error;
        });
    res.json({ success: true, data: data });
}
*/

module.exports = controller;