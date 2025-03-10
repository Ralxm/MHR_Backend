const Sequelize = require('sequelize');
const SequelizeDB = require('./database');
const Ideia = require('./Ideia')
const Projetos = require('./Projetos')

const Linha_Temporal = SequelizeDB.define('linha_temporal', {
    id_registo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_ideia: {
        type: Sequelize.INTEGER,
        references: {
            model: Ideia,
            key: 'id_ideia'
        },
        allowNull: true
    },
    id_projeto: {
        type: Sequelize.INTEGER,
        references: {
            model: Projetos,
            key: 'id_projeto'
        },
        allowNull: true
    },
    tipo: Sequelize.STRING(50),
    descricao: Sequelize.TEXT,
    created_at: Sequelize.DATE,
    created_by: Sequelize.INTEGER,
    updated_at: Sequelize.DATE,
},
{
    tableName: 'LINHA_TEMPORAL',
    timestamps: false,
    freezeTableName: true
});

module.exports = Linha_Temporal;