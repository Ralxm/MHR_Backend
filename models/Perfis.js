const Sequelize = require('sequelize');
const SequelizeDB = require('./database');
const Departamento = require('./Departamento')

const Perfis = SequelizeDB.define('perfis', {
    id_perfil: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_departamento: {
        type: Sequelize.INTEGER,
        references:{
            model: Departamento,
            key: 'id_departamento'
        }
    },
    nome: Sequelize.TEXT(256),
    email: Sequelize.TEXT(256),
    morada: Sequelize.TEXT(256),
    telemovel: Sequelize.TEXT(9),
    data_nascimento: Sequelize.DATEONLY,
    distrito: Sequelize.TEXT(256),
},
{
    tableName: 'PERFIS',
    timestamps: false,
    freezeTableName: true
});


module.exports = Perfis;