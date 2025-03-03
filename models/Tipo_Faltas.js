var Sequelize = require('sequelize');
var SequelizeDB = require('./database');

const Tipo_Faltas = SequelizeDB.define('tipo_faltas', {
    id_tipofalta: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tipo: Sequelize.STRING(50),
    descricao: Sequelize.TEXT,
},
{
    tableName: 'TIPO_FALTAS',
    timestamps: false,
    freezeTableName: true
});

module.exports = Tipo_Faltas