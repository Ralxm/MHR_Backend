const Sequelize = require('sequelize');
const SequelizeDB = require('./database');
const Perfis = require('./Perfis')

const Blog = SequelizeDB.define('blog', {
    id_publicacao: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_perfil: {
        type: Sequelize.INTEGER,
        references:{
            model: Perfis,
            key: 'id_perfil'
        }
    },
    tipo: Sequelize.TEXT(50),
    titulo: Sequelize.TEXT(256),
    texto: Sequelize.TEXT(5000),
    data_noticia: Sequelize.DATEONLY,
    local_visita: Sequelize.TEXT(256),
    data_visita: Sequelize.DATEONLY,
    duracao_visita: Sequelize.INTEGER,
    motivo_visita: Sequelize.TEXT(256),
    estado: Sequelize.TEXT(50),
    validador: Sequelize.INTEGER,
    data_validacao: Sequelize.DATEONLY,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
    imagem: Sequelize.BLOB,
    views: Sequelize.INTEGER
},
{
    tableName: 'BLOG',
    timestamps: false,
    freezeTableName: true
});


module.exports = Blog;