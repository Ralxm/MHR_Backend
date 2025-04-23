const Sequelize = require('sequelize');
const SequelizeDB = require('./database');
const Departamento = require('./Departamento')
const Utilizadores = require('./Utilizadores')
const AuditLog = require('./AuditLog')

const Perfis = SequelizeDB.define('perfis', {
    id_perfil: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_departamento: {
        type: Sequelize.INTEGER,
        references:{
            model: Departamento,
            key: 'id_departamento'
        },
        allowNull: true
    },
    id_utilizador: {
        type: Sequelize.INTEGER,
        references:{
            model: Utilizadores,
            key: 'id_utilizador'
        }
    },
    nome: Sequelize.TEXT(256),
    email: Sequelize.TEXT(256),
    numero_mecanografico: Sequelize.TEXT(256),
    morada: Sequelize.TEXT(256),
    telemovel: Sequelize.TEXT(9),
    data_nascimento: Sequelize.DATEONLY,
    distrito: Sequelize.TEXT(256),
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE
},
{
    tableName: 'PERFIS',
    timestamps: false,
    freezeTableName: true
});

Perfis.afterCreate((utilizador, options) => {
    return AuditLog.create({
        utilizador: utilizador.id_perfil,
        data_atividade: getDate(),
        tipo_atividade: "Registo",
        descricao: "Utilizador com ID " + utilizador.id_utilizador + " e com ID de perfil " + utilizador.id_perfil + " fez registo."
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


module.exports = Perfis;