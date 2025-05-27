const Sequelize = require('sequelize');
const SequelizeDB = require('./database');
const Tipo_Utilizador = require('./Tipo_Utilizador')
const bcrypt = require('bcrypt')

const Utilizadores = SequelizeDB.define('utilizadores', {
    id_utilizador: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_tipo: {
        type: Sequelize.INTEGER,
        references: {
            model: Tipo_Utilizador,
            key: 'id_tipo'
        }
    },
    nome_utilizador: {
        type: Sequelize.STRING(50),
        unique: true,
    },
    pass: Sequelize.STRING(256),
    estado: Sequelize.STRING(50), //Ativa, Desativada, Pendente
    token_resgate: Sequelize.STRING(6),
    validade_token: Sequelize.DATE,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE
},
{
    tableName: 'UTILIZADORES',
    timestamps: false,
    freezeTableName: true
});

Utilizadores.beforeCreate((utilizador, options) => {
    return bcrypt.hash(utilizador.pass, 10)
    .then(hash =>{
        utilizador.pass = hash;
    })
    .catch(err =>{
        throw new Error();
    })
})

module.exports = Utilizadores;