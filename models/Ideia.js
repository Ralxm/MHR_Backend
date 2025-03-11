const Sequelize = require('sequelize');
const SequelizeDB = require('./database');
const Perfis = require('./Perfis');

const Ideia = SequelizeDB.define('ideia', {
    id_ideia: {
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
    titulo_ideia: Sequelize.CHAR(256),
    descricao: Sequelize.TEXT,
    estado: Sequelize.STRING(50),
    ficheiro_complementar: Sequelize.TEXT,
    validador: Sequelize.INTEGER,
    comentarios: Sequelize.STRING(2000),
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
},
{
    tableName: 'IDEIA',
    timestamps: false,
    freezeTableName: true
});

Ideia.afterCreate((ideia, options) => {
    return AuditLog.create({
        utilizador: ideia.id_perfil,
        data_atividade: getDate(),
        tipo_atividade: "Criação Férias",
        descricao: "Utilizador com ID Perfil " + ideia.id_perfil + " fez registo de uma ideia com ID " + ideia.id_ideia + ".",
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



module.exports = Ideia;