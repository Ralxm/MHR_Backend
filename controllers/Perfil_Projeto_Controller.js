var Perfil_Projeto = require('../models/Perfil_Projeto')
var Perfis = require('../models/Perfis')
var Projetos = require('../models/Projetos')
const controller = {};

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

controller.perfilProjetoCreate = async function (req, res){
    const { id_perfil, id_projeto } = req.body;
    const data = await Perfil_Projeto.create({
        id_perfil: id_perfil,
        id_projeto: id_projeto,
    })
    .then(function(data){
        res.status(200).json({
            success: true,
            message: "Perfil associado a projeto",
            data: data
        })
    })
    .catch(error =>
        res.status(500).json({
            success: false,
            message: "Erro a criar a associação",
            error: error.message
        })
    )
}

controller.perfilProjetoCreateMany = async function (req, res){
    const { perfis, id_projeto } = req.body;
    
    try {

        const createdAssociations = await Promise.all(
            perfis.map(perfil => 
                Perfil_Projeto.create({
                    id_perfil: perfil.id_perfil,
                    id_projeto: id_projeto
                })
            )
        );

        res.status(200).json({
            success: true,
            message: "Perfis associados ao projeto com sucesso",
            data: createdAssociations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao criar associações",
            error: error.message
        });
    }
}

controller.perfilProjetoList = async function (req, res){
    const data = await Perfil_Projeto.findAll({
        order: ['id_perfil'],
        include: [
            {
                model: Perfis,
                as: 'perfil',
                required: false
            },
            {
                model: Projetos,
                as: 'projeto',
                required: false
            }
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
            message: "Erro a listar as associações entre projetos e perfis",
            error: error.message
        });
    });
}

controller.perfilProjetoGet = async function (req, res){
    const { id_projeto, id_perfil } = req.params;
    const data = await Perfil_Projeto.findAll({
        where: { id_projeto: id_projeto, id_perfil: id_perfil },
        include: [
            {
                model: Perfis,
                as: 'perfil',
                required: false
            },
            {
                model: Projetos,
                as: 'projeto',
                required: false
            }
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
            message: "Erro a encontrar o perfil",
            error: error
        });
    })
}

controller.perfilProjetoGet_Perfil = async function (req, res){
    const { id } = req.params;
    const data = await Perfil_Projeto.findAll({
        where: { id_perfil: id },
        include: [
            {
                model: Perfis,
                as: 'perfil',
                required: false
            },
            {
                model: Projetos,
                as: 'projeto',
                required: false
            }
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
            message: "Erro a encontrar o perfil",
            error: error
        });
    })
}

controller.perfilProjetoGet_Projeto = async function (req, res){
    const { id } = req.params;
    const data = await Perfil_Projeto.findAll({
        where: { id_projeto: id },
        include: [
            {
                model: Perfis,
                as: 'perfil',
                required: false
            },
            {
                model: Projetos,
                as: 'projeto',
                required: false
            }
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
            message: "Erro a encontrar o perfil",
            error: error
        });
    })
}

controller.perfilProjetoDelete = async function (req, res){
    const { id_projeto, id_perfil } = req.params;
    const data = await Perfil_Projeto.destroy({
        where: { id_projeto: id_projeto, id_perfil: id_perfil }
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

controller.perfilProjetoUpdateMany = async function (req, res) {
    const { originalProfiles, updatedProfiles, id_projeto } = req.body;
    
    try {
        const originalIds = new Set(originalProfiles.map(p => p.id_perfil));
        const updatedIds = new Set(updatedProfiles.map(p => p.id_perfil));

        const profilesToAdd = updatedProfiles.filter(
            p => !originalIds.has(p.id_perfil)
        );

        const profilesToRemove = originalProfiles.filter(
            p => !updatedIds.has(p.id_perfil)
        );

        const createdAssociations = await Promise.all(
            profilesToAdd.map(perfil => 
                Perfil_Projeto.create({
                    id_perfil: perfil.id_perfil,
                    id_projeto: id_projeto
                })
            )
        );

        const removedAssociations = await Promise.all(
            profilesToRemove.map(perfil =>
                Perfil_Projeto.destroy({
                    where: {
                        id_perfil: perfil.id_perfil,
                        id_projeto: id_projeto
                    }
                })
            )
        );

        res.status(200).json({
            success: true,
            message: "Perfis do projeto atualizados com sucesso",
            data: {
                added: createdAssociations,
                removed: removedAssociations
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao atualizar associações de perfis",
            error: error.message
        });
    }
}

module.exports = controller;