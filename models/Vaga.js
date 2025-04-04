const Sequelize = require('sequelize');
const SequelizeDB = require('./database');
const Departamento = require('./Departamento');

const Vaga = SequelizeDB.define('vaga', {
    id_vaga: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_departamento: {
        type: Sequelize.INTEGER,
        references: {
            model: Departamento,
            key: 'id_departamento'
        }
    },
    descricao: Sequelize.TEXT,
    requisitos: Sequelize.TEXT,
    titulo_vaga: Sequelize.STRING(256),
    numero_vagas: Sequelize.INTEGER,
    estado: Sequelize.STRING, //Aberta, Fechada, Ocupada
    data_inicio: Sequelize.DATE,
    data_fecho: Sequelize.DATE,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
    created_by: Sequelize.INTEGER,
},
{
    tableName: 'VAGA',
    timestamps: false,
    freezeTableName: true
});

Departamento.hasMany(Vaga, { foreignKey: 'id_departamento' });
Vaga.belongsTo(Departamento, { foreignKey: 'id_departamento' });


module.exports = Vaga;