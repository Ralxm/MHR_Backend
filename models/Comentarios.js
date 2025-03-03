const Sequelize = require('sequelize');
const SequelizeDB = require('./database');
const Candidaturas = require('./Candidaturas')

const Comentarios = SequelizeDB.define('comentarios', {
    id_comentario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_candidatura: {
        type: Sequelize.INTEGER,
        references: {
            model: Candidaturas,
            key: 'id_candidatura'
        }
    },
    comentario: Sequelize.STRING(2000),
    responsavel: Sequelize.INTEGER,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
},
{
    tableName: 'COMENTARIOS',
    timestamps: false,
    freezeTableName: true
});

module.exports = Comentarios;