const express = require('express');
const app = express();
const sequelize = require('./models/database');
const Sequelize = require('sequelize')
const middleware = require('./middleware')
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('./cronJobs');

//IMPORT DAS ROUTES
const AuditLog = require('./routes/AuditLog_Route')
const Blog = require('./routes/Blog_Route')
const Calendario = require('./routes/Calendario_Route')
const Candidaturas = require('./routes/Candidaturas_Route')
const Comentarios_Projetos = require('./routes/Comentarios_Projetos_Route')
const Comentarios = require('./routes/Comentarios_Route')
const Departamento = require('./routes/Departamento_Route')
const Despesas = require('./routes/Despesas_Route')
const Empresa = require('./routes/Empresa_Route')
const Faltas = require('./routes/Faltas_Route')
const Ferias = require('./routes/Ferias_Route')
const Ideia = require('./routes/Ideia_Route')
const Linha_Temporal = require('./routes/Linha_Temporal_Route')
const Notificacoes = require('./routes/Notificacoes_Route')
const Perfil_Projeto = require('./routes/Perfil_Projeto_Route')
const Perfis = require('./routes/Perfis_Route')
const Projetos = require('./routes/Projetos_Route')
const Tipo_Faltas = require('./routes/Tipo_Faltas_Route')
const Tipo_Utilizadores = require('./routes/Tipo_Utilizadores_Route')
const Utilizadores = require('./routes/Utilizadores_Route')
const Vaga = require('./routes/Vaga_Route')

//IMPORT DOS MODELOS
const _AuditLog = require('./models/AuditLog')
const _Blog = require('./models/Blog')
const _Calendario = require('./models/Calendario')
const _Candidaturas = require('./models/Candidaturas')
const _Comentarios_Projetos = require('./models/Comentarios_Projetos')
const _Comentarios = require('./models/Comentarios')
const _Departamento = require('./models/Departamento')
const _Despesas = require('./models/Despesas')
const _Empresas = require('./models/Empresa')
const _Faltas = require('./models/Faltas')
const _Ferias = require('./models/Ferias')
const _Ideia = require('./models/Ideia')
const _Linha_Temporal = require('./models/Linha_Temporal')
const _Notificacoes = require('./models/Notificacoes')
const _Perfil_Projeto = require('./models/Perfil_Projeto')
const _Perfis = require('./models/Perfis')
const _Projetos = require('./models/Projetos')
const _Tipo_Faltas = require('./models/Tipo_Faltas')
const _Tipo_Utilizador = require('./models/Tipo_Utilizador')
const _Utilizadores = require('./models/Utilizadores')
const _Vaga = require('./models/Vaga');


//DEFINIR OPÇÕES
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.set('port', process.env.PORT || 8080);
app.use(cors(corsOptions));

app.use('/ficheiros', express.static(path.join(__dirname, 'ficheiros')));
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

//FUNÇÃO PARA DAR SYNC NA SEQUÊNCIA CORRETA DE CRIAÇÃO DA BASE DE DADOS
async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com sucesso');

    await _AuditLog.sync();
    await _Tipo_Utilizador.sync();
    await _Departamento.sync();
    await _Perfis.sync();
    await _Utilizadores.sync();
    await _Calendario.sync();
    await _Blog.sync();
    await _Vaga.sync();
    await _Candidaturas.sync();
    await _Comentarios.sync();
    await _Ideia.sync();
    await _Projetos.sync();
    await _Comentarios_Projetos.sync();
    await _Despesas.sync();
    await _Empresas.sync();
    await _Tipo_Faltas.sync();
    await _Faltas.sync();
    await _Ferias.sync();
    await _Linha_Temporal.sync();
    await _Notificacoes.sync();
    await _Perfil_Projeto.sync();

    initializeDatabase();

    console.log("Criação e inicialização da base de dados concluída")
  } catch (error) {
    console.log("Erro a criar e inicializar a base de dados: " + error)
  }
}

async function initializeDatabase() {
  //ESTA FUNÇÃO SERVE PARA INICIALIZAR A BASE DE DADOS COM UMA CONTA ADMINISTRADOR E CRIAR OS TIPOS DE FALTAS E UTILIZADORES

  //CRIA O TIPO DE FALTAS
  criarTipoFaltas();

  //CRIA O DEPARTAMENTO INICIAL
  let departamento;
  const departamentoCount = await _Departamento.count();
  if(departamentoCount == 0){
    departamento = await _Departamento.create({
      nome_departamento: 'Sem Nome',
      descricao: 'Departamento Inicial',
      responsavel_departamento: 0
    })
  }

  //CRIA O TIPO DE UTILIZADORES
  const tipoUtilizadoresCount = await _Tipo_Utilizador.count();
  let admin;
  if (tipoUtilizadoresCount == 0) {
    admin = await _Tipo_Utilizador.create({
      nome: 'Administrador'
    })
    await _Tipo_Utilizador.create({
      nome: 'Manager'
    })
    await _Tipo_Utilizador.create({
      nome: 'Colaborador Interno'
    })
    await _Tipo_Utilizador.create({
      nome: 'Colaborador Externo'
    })
    await _Tipo_Utilizador.create({
      nome: 'Visitante'
    })
  }

  //CRIA A CONTA ADMINISTRADOR INICIAL
  const utilizadoresCount = await _Utilizadores.count();
  const perfilCount = await _Perfis.count();
  let perfil;
  if (utilizadoresCount == 0 && perfilCount == 0) {
    perfil = await _Perfis.create({
      id_departamento: departamento.id_departamento,
      nome: "Administrador",
      email: "admin@email.com",
      morada: "Indefinida",
      telemovel: "912345678",
      data_nascimento: new Date(),
      distrito: "Viseu"
    })

    await _Utilizadores.create({
      id_tipo: admin.id_tipo,
      id_perfil: perfil.id_perfil,
      nome_utilizador: "Administrador",
      pass: "Administrador123!",
      estado: "Ativo",
      token_resgate: "",
      validade_token: ""
    })
  }
}

async function criarTipoFaltas() {
  const tipoFaltasCount = await _Tipo_Faltas.count();
  if (tipoFaltasCount == 0) {
    await _Tipo_Faltas.create({
      tipo: 'F015',
      descricao: 'Baixa Médica'
    })
    await _Tipo_Faltas.create({
      tipo: 'F013',
      descricao: 'Baixa Seguro'
    })
    await _Tipo_Faltas.create({
      tipo: 'F001',
      descricao: 'Gozo de Férias'
    })
    await _Tipo_Faltas.create({
      tipo: 'F004',
      descricao: 'Falta injustificada'
    })
    await _Tipo_Faltas.create({
      tipo: 'F003',
      descricao: 'Falta Justificada'
    })
    await _Tipo_Faltas.create({
      tipo: 'F002',
      descricao: 'Falta Just.Rem.'
    })
    await _Tipo_Faltas.create({
      tipo: 'F012',
      descricao: 'Faltas de Greve'
    })
    await _Tipo_Faltas.create({
      tipo: 'F005',
      descricao: 'Suspensão por castigo'
    })
    await _Tipo_Faltas.create({
      tipo: 'F017',
      descricao: 'Assistência a familiares'
    })
    await _Tipo_Faltas.create({
      tipo: 'F031',
      descricao: 'Licença de maternidade'
    })
    await _Tipo_Faltas.create({
      tipo: 'F023',
      descricao: 'Casamento'
    })
    await _Tipo_Faltas.create({
      tipo: 'F032',
      descricao: 'Licença Parental'
    })
    await _Tipo_Faltas.create({
      tipo: 'F006',
      descricao: 'Luto'
    })
    await _Tipo_Faltas.create({
      tipo: 'TS104',
      descricao: 'Hora extra 50%'
    })
    await _Tipo_Faltas.create({
      tipo: 'TS108',
      descricao: 'Hora extra 100%'
    })
    await _Tipo_Faltas.create({
      tipo: 'F007',
      descricao: 'Tribunal'
    })
    await _Tipo_Faltas.create({
      tipo: 'F033',
      descricao: 'Licença Parental Partilhada (Pai) - Dias'
    })
    await _Tipo_Faltas.create({
      tipo: 'F014',
      descricao: 'Baixa por Doença Profissional'
    })
    await _Tipo_Faltas.create({
      tipo: 'F025',
      descricao: 'Banco Horas trabalhadas'
    })
    await _Tipo_Faltas.create({
      tipo: 'F057',
      descricao: 'Dispensa diária para amamentação'
    })
    await _Tipo_Faltas.create({
      tipo: 'TS109',
      descricao: 'Horas Formação'
    })
    await _Tipo_Faltas.create({
      tipo: 'F029',
      descricao: 'Baixa por Doença Direta'
    })
    await _Tipo_Faltas.create({
      tipo: 'F026',
      descricao: 'Licença de Trabalhador-Estudante (Dias)'
    })
    await _Tipo_Faltas.create({
      tipo: 'F037',
      descricao: 'Baixa Gravidez Risco'
    })
  }
}

app.use('/auditlog', AuditLog)
app.use('/blog', Blog)
app.use('/calendario', Calendario)
app.use('/candidaturas', Candidaturas)
app.use('/comentarios_projetos', Comentarios_Projetos)
app.use('/comentarios', Comentarios)
app.use('/departamento', Departamento)
app.use('/despesas', Despesas)
app.use('/empresa', Empresa)
app.use('/faltas', Faltas)
app.use('/ferias', Ferias)
app.use('/ideia', Ideia)
app.use('/linha_temporal', Linha_Temporal)
app.use('/notificacoes', Notificacoes)
app.use('/perfil_projeto', Perfil_Projeto)
app.use('/perfis', Perfis)
app.use('/projetos', Projetos)
app.use('/tipo_faltas', Tipo_Faltas)
app.use('/tipo_utilizadores', Tipo_Utilizadores)
app.use('/utilizadores', Utilizadores)
app.use('/vaga', Vaga)

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Modelos sincronizados com o banco de dados.');
  })
  .catch(err => {
    console.error('Erro ao sincronizar modelos com o banco de dados:', err);
  });

syncDatabase();

app.listen(app.get('port'), () => {
  console.log("Start server on port " + app.get('port'));
})