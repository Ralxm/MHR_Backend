const Sequelize = require('sequelize');
const SequelizeDB = require('./database');
const Utilizadores = require('./Utilizadores');

const Notificacoes = SequelizeDB.define('notificacoes', {
    id_notificacao: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_utilizador: {
        type: Sequelize.INTEGER,
        references: {
            model: Utilizadores,
            key: 'id_utilizador'
        }
    },
    mensagem: Sequelize.TEXT,
    data: Sequelize.DATE,
    estado: Sequelize.STRING(50),
}, 
{
    tableName: 'NOTIFICACOES',
    timestamps: false,
    freezeTableName: true
});

module.exports = Notificacoes;