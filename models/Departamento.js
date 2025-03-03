const Sequelize = require('sequelize');
const SequelizeDB = require('./database');

const Departamento = SequelizeDB.define('departamento', {
    id_departamento: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome_departamento: Sequelize.CHAR(256),
    descricao: Sequelize.TEXT,
    responsavel_departamento: Sequelize.CHAR(256),
},
{
    tableName: 'DEPARTAMENTO',
    timestamps: false,
    freezeTableName: true
});

module.exports = Departamento;