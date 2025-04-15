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
    estado: Sequelize.STRING(50), //Aprovada, Em análise, Rejeitada 
    validador: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    comentarios:{
        type: Sequelize.STRING(2000),
        allowNull: true
    },
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

Ferias.belongsTo(Perfis, {
    foreignKey: 'id_perfil',
    as: "perfil"
});

Ferias.afterCreate((ferias, options) => {
    /*return AuditLog.create({
        utilizador: ferias.id_perfil,
        data_atividade: getDate(),
        tipo_atividade: "Criação Férias",
        descricao: "Utilizador com ID Perfil " + ferias.id_perfil + " fez registo de férias com ID " + ferias.id_solicitacao + ".",
    })*/
})

function getDate(){
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    let today = `${yyyy}-${mm}-${dd}`;
    return today;
}

module.exports = Ferias;