var Perfis = require('../models/Perfis')
var Calendario = require('../models/Calendario')
var Utilizadores = require('../models/Utilizadores')
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

controller.perfisCreate = async function (req, res) {
    const { id_departamento, id_utilizador, nome, email, morada, telemovel, data_nascimento, distrito, numero_mecanografico } = req.body;
    
    try {
        // Create Perfil
        const perfil = await Perfis.create({
            id_departamento: id_departamento,
            id_utilizador: id_utilizador,
            nome: nome,
            email: email,
            morada: morada,
            telemovel: telemovel,
            data_nascimento: data_nascimento,
            distrito: distrito,
            numero_mecanografico: numero_mecanografico,
            created_at: getDate(),
            updated_at: getDate(),
        });

        await Utilizadores.update({
            id_tipo: 3
        },{
            where: { id_utilizador: id_utilizador}
        })

        const calendario = await Calendario.create({
            id_perfil: perfil.id_perfil,
            data: getDate(),
            descricao: `Calendário do perfil: ${perfil.nome}`,
            dias_ferias_ano_atual: 22,
            dias_ferias_ano_anterior: 0
        });

        res.status(200).json({
            success: true,
            message: "Perfil e Calendário criados com sucesso",
            data: {
                perfil: perfil,
                calendario: calendario
            }
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Erro ao criar o Perfil ou Calendário",
            error: error.message
        });
    }
};

controller.perfisList = async function (req, res){
    const data = await Perfis.findAll({order: ['nome']})
    .then(function(data) {
        res.status(200).json({
            success: true,
            data: data
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar os perfis",
            error: error.message
        });
    });
}

controller.perfisListDepartamento = async function (req, res){
    const { id } = req.params
    const data = await Perfis.findAll({order: ['nome']}, {where: {id_departamento: id}})
    .then(function(data) {
        res.status(200).json({
            success: true,
            data: data
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar os perfis",
            error: error.message
        });
    });
}

controller.perfisListDistrito = async function (req, res){
    const { distrito } = req.params
    const data = await Perfis.findAll({order: ['nome']}, {where: {distrito: distrito}})
    .then(function(data) {
        res.status(200).json({
            success: true,
            data: data
        });
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a listar os perfis",
            error: error.message
        });
    });
}

controller.perfisGet = async function (req, res){
    const { id } = req.params;
    const data = await Perfis.findAll({
        where: { id_perfil: id }
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
            message: "Erro a encontrar o perfil",
            error: error
        });
    })
}

controller.perfisGetUtilizador = async function (req, res){
    const { id } = req.params;
    const data = await Perfis.findAll({
        where: { id_utilizador: id }
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
            message: "Erro a encontrar o perfil",
            error: error
        });
    })
}

controller.perfisGetTelemovel = async function (req, res){
    const { tlm } = req.params;
    const data = await Perfis.findAll({
        where: { telemovel: tlm }
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
            message: "Erro a encontrar o perfil",
            error: error
        });
    })
}

controller.perfisGetEmail = async function (req, res){
    const { email } = req.params;
    const data = await Perfis.findAll({
        where: { email: email }
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
            message: "Erro a encontrar o perfil",
            error: error
        });
    })
}

controller.perfisDelete = async function (req, res){
    const { id } = req.params;
    const data = await Perfis.destroy({
        where: {id_perfil: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Perfil apagado"
        })
    })
    .catch(error => {
        res.status(500).json({
            success: false,
            message: "Erro a apagar o Perfil",
            error: error.message
        });
    })
}

controller.perfisUpdate = async function (req, res){
    const { id } = req.params;
    const { id_departamento, nome, email, morada, telemovel, data_nascimento, distrito, numero_mecanografico } = req.body;
    const data = await Perfis.update({
        id_departamento: id_departamento,
        nome: nome,
        email: email,
        morada: morada,
        telemovel: telemovel,
        data_nascimento: data_nascimento,
        distrito: distrito,
        numero_mecanografico: numero_mecanografico,
        updated_at: getDate()
    },{
        where: {id_perfil: id}
    })
    .then(function() {
        res.status(200).json({
            success: true,
            message: "Perfil atualizado com sucesso"
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Erro a atualizar o perfil",
            error: error.message
        });
    })
}

module.exports = controller;