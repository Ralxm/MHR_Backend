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

User.hasMany(Ideia, { foreignKey: 'id_user' });
Ideia.belongsTo(User, { foreignKey: 'id_user' });

Projetos.hasMany(Ideia, { foreignKey: 'id_projeto' });
Ideia.belongsTo(Projetos, { foreignKey: 'id_projeto' });



module.exports = Ideia;