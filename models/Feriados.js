const Sequelize = require('sequelize');
const SequelizeDB = require('./database');

const Feriados = SequelizeDB.define('feriados', {
    id_feriado: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: Sequelize.CHAR(256),
    data_feriado: Sequelize.DATEONLY,
},
{
    tableName: 'FERIADOS',
    timestamps: false,
    freezeTableName: true
});

module.exports = Feriados;