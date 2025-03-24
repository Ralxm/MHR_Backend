const Sequelize = require('sequelize');
const SequelizeDB = require('./database');

const AuditLog = SequelizeDB.define('auditlog', {
    id_log: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    utilizador: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    data_atividade: Sequelize.DATE,
    tipo_atividade: Sequelize.TEXT,
    descricao: Sequelize.TEXT,
  },
  {
    tableName: 'AUDITLOG',
    timestamps: false,
    freezeTableName: true
  });

module.exports = AuditLog;