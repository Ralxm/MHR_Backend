const Sequelize = require('sequelize');
const SequelizeDB = require('./database');
const Tipo_Utilizador = require('./Tipo_Utilizador')
const Perfis = require('./Perfis')

const Utilizadores = SequelizeDB.define('utilizadores', {
    id_utilizador: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_tipo: {
        type: Sequelize.INTEGER,
        references: {
            model: Tipo_Utilizador,
            key: 'id_tipo'
        }
    },
    id_perfil: {
        type: Sequelize.INTEGER,
        references: {
            model: Perfis,
            key: 'id_perfil'
        }
    },
    nome_utilizador: Sequelize.STRING(50),
    pass: Sequelize.STRING(256),
    estado: Sequelize.STRING(50),
    token_resgate: Sequelize.STRING(6),
    validade_token: Sequelize.DATE,
},
{
    tableName: 'UTILIZADORES',
    timestamps: false,
    freezeTableName: true
});

module.exports = Utilizadores;