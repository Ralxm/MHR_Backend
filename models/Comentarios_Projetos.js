var Sequelize = require('sequelize');
var SequelizeDB = require('./database');
var Projetos = require('./Projetos')
var Ideia = require('./Ideia');
var Perfis = require('./Perfis');

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
        },
        allowNull: true
    },
    id_ideia: {
        type: Sequelize.INTEGER,
        references: {
            model: Ideia,
            key: 'id_ideia'
        },
        allowNull: true
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

Comentarios_Projetos.belongsTo(Perfis, {
    foreignKey: 'autor',
    as: "perfil"
});

module.exports = Comentarios_Projetos;