const Sequelize = require('sequelize');
const SequelizeDB = require('./database');
const Perfis = require('./Perfis');
const Projetos = require('./Projetos');
const Departamento = require('./Departamento')

const Despesas = SequelizeDB.define('despesas', {
    id_despesa: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_departamento: {
        type: Sequelize.INTEGER,
        references: {
            model: Departamento,
            key: 'id_departamento'
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
    id_perfil: {
        type: Sequelize.INTEGER,
        references: {
            model: Perfis,
            key: 'id_perfil'
        },
        allowNull: true
    },
    data: Sequelize.DATE,
    descricao: Sequelize.TEXT,
    valor: Sequelize.DECIMAL(10, 2),
    anexo: Sequelize.TEXT,
    validador: Sequelize.INTEGER,
    estado: Sequelize.STRING(50),
    reembolsado_por: Sequelize.INTEGER,
    comentarios: Sequelize.STRING(2000),
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
},
{
    tableName: 'DESPESAS',
    timestamps: false,
    freezeTableName: true
});

User.hasMany(Despesas, { foreignKey: 'id_user' });
Despesas.belongsTo(User, { foreignKey: 'id_user' });
Projetos.hasMany(Despesas, { foreignKey: 'id_projeto' });
Despesas.belongsTo(Projetos, { foreignKey: 'id_projeto' });


module.exports = Despesas;