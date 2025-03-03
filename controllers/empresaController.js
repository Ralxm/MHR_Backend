const Empresa = require('../models/Empresa');
var sequelize = require('../models/database');

const controllers = {};

sequelize.sync();

controllers.empresa_adicionar = async(req, res) => {
  const { nome_empresa, contacto_empresa, email_empresa } = req.body;
  const data = await Empresa.create({
      nome_empresa: nome_empresa,
      contacto_empresa: contacto_empresa,
      email_empresa: email_empresa
  })
  .then(function(data) {
      return data
  })
  .catch(error => {
      return error;
  })

  res.status(200).json({
      success: true,
      message: "Empresa adicionada com sucesso!",
      data: data
  });
}

controllers.empresa_lista = async (req, res) => {
    const data = await Empresa.findAll()
    .then(function(data) {
        return data;
    })
    .catch(error => {
        return error;
    });
    res.json({success: true, data: data});
}

controllers.empresa_apagar = async (req, res) => {
    const { id_empresa } = req.body;
    const data = await Empresa.destroy({
        where: {
            id_empresa: id_empresa
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

controllers.empresa_editar = async (req, res) => {
    const { id_empresa, nome_empresa, contacto_empresa, email_empresa } = req.body;
    const data = await Empresa.update({
        nome_empresa: nome_empresa,
        contacto_empresa: contacto_empresa,
        email_empresa: email_empresa
    }, {
        where: {
            id_empresa: id_empresa
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

controllers.empresa_detalhes = async (req, res) => {
    const { id } = req.params;
    const data = await Empresa.findAll({
        where: {
            id_empresa: id
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