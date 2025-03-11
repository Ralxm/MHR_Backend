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
    estado: Sequelize.TEXT(50), //Validada, Por Validar, Rejeitada
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

Blog.afterCreate((blog, options) => {
    return AuditLog.create({
        utilizador: blog.id_perfil,
        data: getDate(),
        tipo_atividade: "Criação Blog",
        descricao: "Utilizador com ID Perfil " + blog.id_perfil + " criou uma publicação no blog com ID " + blog.id_publicacao + ".",
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

module.exports = Blog;