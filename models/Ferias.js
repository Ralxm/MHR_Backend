const Sequelize = require('sequelize');
const SequelizeDB = require('./database');
const Calendario = require('./Calendario');
const Perfis = require('./Perfis')

const Ferias = SequelizeDB.define('ferias', {
    id_solicitacao: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_perfil: {
        type: Sequelize.INTEGER,
        references: {
            model: Perfis,
            key: 'id_perfil'
        }
    },
    id_calendario: {
        type: Sequelize.INTEGER,
        references: {
            model: Calendario,
            key: 'id_calendario'
        }
    },
    data_inicio: Sequelize.DATE,
    data_conclusao: Sequelize.DATE,
    data_pedido: Sequelize.DATE,
    duracao: Sequelize.INTEGER,
    estado: Sequelize.STRING(50),
    validador: Sequelize.INTEGER,
    comentarios: Sequelize.STRING(2000),
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
},
{
    tableName: 'FERIAS',
    timestamps: false,
    freezeTableName: true
});

Calendario.hasMany(Ferias, { foreignKey: 'id_calendario' });
Ferias.belongsTo(Calendario, { foreignKey: 'id_calendario' });

module.exports = Ferias;