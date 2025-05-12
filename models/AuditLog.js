const Sequelize = require('sequelize');
const SequelizeDB = require('./database');

const AuditLog = SequelizeDB.define('auditlog', {
    id_log: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    utilizador: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    data_atividade: Sequelize.DATE,
    tipo_atividade: Sequelize.TEXT,
    descricao: Sequelize.TEXT,
  },
  {
    tableName: 'AUDITLOG',
    timestamps: false,
    freezeTableName: true
  });

module.exports = AuditLog;

//Despesas: Criação de despesa / Edição de despesa / Eliminação de despesa
//Vagas: Criação de vaga / Edição de vaga / Eliminação de vaga
//Candidaturas: Criação de candidatura / Edição de candidatura / Eliminação de candidatura
//Faltas: Criação de falta / Edição de falta / Eliminação de falta
//Férias: Criação de férias / Edição de férias / Eliminação de férias
//Projetos: Criação de projeto / Edição de projeto / Eliminação de projeto
//Ideias: Criação de ideia / Edição de ideia / Eliminação de ideia
//Linha Temporal: Criação de ponto na LT / Edição de ponto na LT / Eliminação de ponto na LT
//Blog: Criação de publicação / Edição de publicação / Eliminação de publicação
//Comentarios: Criação de comentário em candidatura / Eliminação de comentário em candidatura
//Comentarios_Projetos: Criação de comentário em projeto / Eliminação de comentário em projeto
//Departamentos: Criação de departamento / Edição de departamento / Eliminação de departamento
//Empresa: Edição das informações da empresa