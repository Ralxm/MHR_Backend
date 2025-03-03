var Sequelize = require('sequelize');
var SequelizeDB = require('./database');

const Empresas = SequelizeDB.define('empresas', {
    id_empresa: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome_empresa: Sequelize.CHAR(256),
    contacto_empresa: Sequelize.INTEGER,
    email_empresa: Sequelize.CHAR(256),
},
{
    tableName: 'EMPRESAS',
    timestamps: false,
    freezeTableName: true
});

module.exports = Empresas;