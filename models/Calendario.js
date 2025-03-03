const Sequelize = require('sequelize');
const SequelizeDB = require('./database');
const Perfis = require('./Perfis')

const Calendario = SequelizeDB.define('calendario', {
    id_calendario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_perfil: {
        type: Sequelize.INTEGER,
        references: {
            model: Perfis,
            key: 'id_perfil'
        }
    },
    data: Sequelize.DATE,
    descricao: Sequelize.TEXT,
    dias_ferias_ano_atual: Sequelize.INTEGER,
    dias_ferias_ano_anterior: Sequelize.INTEGER,
}, 
{
    tableName: 'CALENDARIO',
    timestamps: false,
    freezeTableName: true
});

module.exports = Calendario;