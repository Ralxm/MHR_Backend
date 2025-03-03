const UserVisitante = require('../models/Perfil_visitante');
var sequelize = require('../models/database');

const controllers = {};

sequelize.sync();

controllers.login_visitante = async(req, res) => {
  const { nome_utilizador, pass} = req.body;
  const data = await UserVisitante.findOne({
    where: {
    nome_utilizador : nome_utilizador,
    pass : pass,
} 
  })
  .then(function(data) {
      return data
  })
  .catch(error => {
      return error;
  })

  res.status(200).json({
      success: true,
      message: "Login efetuado com sucesso!",
      data: data
  });
}

controllers.registo_visitante = async(req, res) => {
  const { nome_utilizador, pass, email } = req.body;
  const data = await UserVisitante.create({
      nome_utilizador: nome_utilizador,
      pass: pass,
      email: email,
  })
  .then(function(data) {
      return data
  })
  .catch(error => {
      return error;
  })

  res.status(200).json({
      success: true,
      message: "Registo efetuado com sucesso!",
      data: data
  });
}

controllers.perfil_visitante = async (req, res) => {
  const { id_user_visitante } = req.body;
  const data = await UserVisitante.findOne({
      where: {
          id_user_visitante: id_user_visitante
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

controllers.editar_perfil_visitante = async (req, res) => {
  const { id_user_visitante, nome_utilizador, pass, email } = req.body;
  const data = await UserVisitante.update({
      nome_utilizador: nome_utilizador,
      pass: pass,
      email: email,
  }, {
      where: {
          id_user_visitante: id_user_visitante
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

controllers.apagar_perfil_visitante = async (req, res) => {
  const { id_user_visitante } = req.body;
  const data = await UserVisitante.destroy({
      where: {
          id_user_visitante: id_user_visitante
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

controllers.listar_visitantes = async (req, res) => {
  const data = await UserVisitante.findAll()
  .then(function(data) {
      return data;
  })
  .catch(error => {
      return error;
  });
  res.json({success: true, data: data});
}


module.exports = controllers;