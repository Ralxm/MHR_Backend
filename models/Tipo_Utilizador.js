const Sequelize = require('sequelize');
const SequelizeDB = require('./database');

const Tipo_Utilizador = SequelizeDB.define('tipo_utilizador', {
    id_tipo: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: Sequelize.STRING(256),
  }, {
    tableName: 'TIPO_UTILIZADOR',
    timestamps: false,
    freezeTableName: true
  });

module.exports = Tipo_Utilizador;