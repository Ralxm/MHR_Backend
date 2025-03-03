var Sequelize = require('sequelize');
var SequelizeDB = require('./database');
var Ideia = require('./Ideia');

const Projetos = SequelizeDB.define('projetos', {
    id_projeto: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_ideia: {
        type: Sequelize.INTEGER,
        references: {
            model: Ideia,
            key: 'id_ideia'
        }
    },
    titulo_projeto: Sequelize.CHAR(256),
    estado: Sequelize.STRING(50),
    data_atribuicao: Sequelize.DATE,
    descricao: Sequelize.TEXT,
    objetivos: Sequelize.TEXT,
    data_inicio: Sequelize.DATE,
    data_final_prevista: Sequelize.DATE,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
},
{
    tableName: 'PROJETOS',
    timestamps: false,
    freezeTableName: true
});

module.exports = Projetos;