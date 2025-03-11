const Empresa = require('../models/Empresa');
var sequelize = require('../models/database');

const controllers = {};

controllers.empresaGet = async (req, res) => {
    const data = await Empresa.findAll({where: {id_empresa: 1}})
    .then(function(data) {
        return data;
    })
    .catch(error => {
        return error;
    });
    res.json({success: true, data: data});
}


controllers.empresaUpdate = async (req, res) => {
    const { nome_empresa, contacto_empresa, email_empresa } = req.body;
    const data = await Empresa.update({
        nome_empresa: nome_empresa,
        contacto_empresa: contacto_empresa,
        email_empresa: email_empresa
    }, {
        where: {
            id_empresa: 1
        }
    })
    .then(function(data) {
        return data;
    })
    .catch(error => {
        return error;
    });
    res.json({success: true, data: data});
}

module.exports = controllers;