const Sequelize = require('sequelize');
const SequelizeDB = require('./database');
const Vaga = require('./Vaga');
const Utilizadores = require('./Utilizadores')

const Candidaturas = SequelizeDB.define('candidaturas', {
    id_candidatura: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_vaga: {
        type: Sequelize.INTEGER,
        references: {
            model: Vaga,
            key: 'id_vaga'
        }
    },
    id_utilizador: {
        type: Sequelize.INTEGER,
        references: {
            model: Utilizadores,
            key: 'id_utilizador'
        }
    },
    data_submissao: Sequelize.DATE,
    curriculo: Sequelize.TEXT,
    telemovel: Sequelize.STRING(9),
    email: Sequelize.STRING(256),
    status: Sequelize.CHAR(256), //Aceite, Em análise, Rejeitada
    responsavel: Sequelize.INTEGER,
    resultado: Sequelize.STRING(2000),
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
},
{
    tableName: 'CANDIDATURAS',
    timestamps: false,
    freezeTableName: true
});

Candidaturas.belongsTo(Utilizadores, {
    foreignKey: 'id_utilizador',
    as: "utilizador"
});

module.exports = Candidaturas;