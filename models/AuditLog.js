const Sequelize = require('sequelize');
const SequelizeDB = require('./database');

const AuditLog = SequelizeDB.define('auditlog', {
    id_log: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    utilizador: Sequelize.INTEGER,
    data: Sequelize.DATE,
    descricao: Sequelize.TEXT,
  },
  {
    tableName: 'AUDITLOG',
    timestamps: false,
    freezeTableName: true
  });

module.exports = AuditLog;