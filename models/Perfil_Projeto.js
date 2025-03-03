const Sequelize = require('sequelize');
const SequelizeDB = require('./database');
const Perfis = require('./Perfis');
const Projetos = require('./Projetos');

const Perfil_Projeto = SequelizeDB.define('perfil_projeto', {
    id_perfil: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: Perfis,
            key: 'id_perfil'
        }
    },
    id_projeto: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: Projetos,
            key: 'id_projeto'
        }
    },
}, {
    tableName: 'PERFIL_PROJETO',
    timestamps: false,
    freezeTableName: true
});

module.exports = Perfil_Projeto;