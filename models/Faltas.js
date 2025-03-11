const Sequelize = require('sequelize');
const SequelizeDB = require('./database');
const Calendario = require('./Calendario');
const Perfis = require('./Perfis');
const Tipo_Faltas = require('./Tipo_Faltas');

const Faltas = SequelizeDB.define('faltas', {
    id_falta: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_tipofalta: {
        type: Sequelize.INTEGER,
        references: {
            model: Tipo_Faltas,
            key: 'id_tipofalta'
        }
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
    data_falta: Sequelize.DATE,
    justificacao: Sequelize.TEXT,
    motivo: Sequelize.TEXT,
    tipo: Sequelize.STRING(50),
    estado: Sequelize.STRING(50), //Aprovada, Em análise, Rejeitada,
    validador: Sequelize.INTEGER,
    comentarios: Sequelize.STRING(2000),
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
}, {
    tableName: 'FALTAS',
    timestamps: false,
    freezeTableName: true
});

Calendario.hasMany(Faltas, { foreignKey: 'id_calendario' });
Faltas.belongsTo(Calendario, { foreignKey: 'id_calendario' });

Faltas.afterCreate((faltas, options) => {
    return AuditLog.create({
        utilizador: faltas.id_perfil,
        data_atividade: getDate(),
        tipo_atividade: "Criação Férias",
        descricao: "Utilizador com ID Perfil " + faltas.id_perfil + " fez registo de falta com ID " + faltas.id_solicitacao + ".",
    })
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

module.exports = Faltas;