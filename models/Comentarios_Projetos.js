var Sequelize = require('sequelize');
var SequelizeDB = require('./database');
var Ideia = require('./Ideia');

const Comentarios_Projetos = SequelizeDB.define('comentarios_projetos', {
    id_comentario_projeto: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_projeto: {
        type: Sequelize.INTEGER,
        references: {
            model: Projetos,
            key: 'id_projeto'
        }
    },
    id_ideia: {
        type: Sequelize.INTEGER,
        references: {
            model: Ideia,
            key: 'id_ideia'
        }
    },
    autor: Sequelize.INTEGER,
    comentario: Sequelize.STRING(2000),
    anexo: Sequelize.TEXT,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
},
{
    tableName: 'COMENTARIOS_PROJETOS',
    timestamps: false,
    freezeTableName: true
});

module.exports = Comentarios_Projetos;