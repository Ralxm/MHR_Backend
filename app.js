const express = require('express');
const app = express();
const sequelize = require('./models/database');
const Sequelize = require('sequelize')
const middleware = require('./middleware')

//IMPORT DAS ROUTES
const faltasRoute = require('./routes/faltasRoute');
const ideiaRoute = require('./routes/ideiaRoute');
const feriasRoute = require('./routes/feriasRoute');
const userRoute = require('./routes/userRoute')
const calendarioRoute = require('./routes/calendarioRoute');
const despesasRoute = require('./routes/despesasRoute');
const blogRoute = require('./routes/blogRoute');
const noticiaRoute = require('./routes/noticiaRoute');
const visitaRoute = require('./routes/visitaRoute');
const candidaturasRoute = require('./routes/candidaturasRoute');
const departamentoRoute = require('./routes/departamentoRoute');
const empresaRoute = require('./routes/empresaRoute');
const notificacoesRoute = require('./routes/notificacoesRoute');
const projetosRoute = require('./routes/projetosRoute');
const reembolsosRoute = require('./routes/reembolsosRoute');
const vagaRoute = require('./routes/vagaRoute');
const userVisitanteRoute = require('./routes/userVisitanteRoute');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('./cronJobs');

//IMPORT DOS MODELOS
const _AuditLog = require('./models/AuditLog')
const _Blog = require('./models/AuditLog')
const _Calendario = require('./models/AuditLog')
const _Candidaturas = require('./models/AuditLog')
const _Comentarios_Projetos = require('./models/AuditLog')
const _Comentarios = require('./models/AuditLog')
const _Departamento = require('./models/AuditLog')
const _Despesas = require('./models/AuditLog')
const _Empresas = require('./models/AuditLog')
const _Faltas = require('./models/AuditLog')
const _Ferias = require('./models/AuditLog')
const _Ideia = require('./models/AuditLog')
const _Linha_Temporal = require('./models/AuditLog')
const _Notificacoes = require('./models/AuditLog')
const _Perfil_Projeto = require('./models/AuditLog')
const _Perfis = require('./models/AuditLog')
const _Projetos = require('./models/AuditLog')
const _Tipo_Faltas = require('./models/AuditLog')
const _Tipo_Utilizador = require('./models/AuditLog')
const _Utilizadores = require('./models/AuditLog')
const _Vaga = require('./models/AuditLog');


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

async function initializeDatabase(){
  //ESTA FUNÇÃO SERVE PARA CRIAR OS ELEMENTOS DEPARTAMENTO, PROJETO, IDEIA INICIAIS PARA QUE ESTES OBTENHAM ID = 1 E SIRVAM COMO BASE AO FUNCIONAMENTO DO PROJETO.
  //SERVE TAMBÉM PARA INICIALIZAR A BASE DE DADOS COM UMA CONTA ADMINISTRADOR E CRIAR OS TIPOS DE FALTAS E UTILIZADORES

  //ESTES ELEMENTOS ID = 1 SERVEM PARA PREENCHER O LUGAR DAS CHAVES ESTRANGEIRAS DE TABELAS QUE TENHAM VÁRIAS FK MAS QUE APENAS NECESSITEM DE UMA

  //EX: TABELA LINHA_TEMPORAL QUE SERVE PARA GUARDAR OBJETIVOS OU BLOQUEIOS DE PROJETOS OU IDEIAS
  //A LINHA_TEMPORAL APENAS PERTENCE A UM PROJETO OU A UMA IDEIA. ASSIM, SE O ID_PROJETO DA LINHA FOR 1, SIGNIFICA QUE A MESMA PERTENCE A UMA IDEIA.
  //O MESMO SE APLICA SE O ID_IDEIA DA LINHA FOR 1 -> PERTENCE A UM PROJETO.

  //PONTOS:
  //LINHA TEMPORAL COM IDEIA OU PROJETO
  //COMENTARIOS_PROJETOS COM IDEIA OU PROJETO
  //DESPESAS COM DEPARTAMENTO OU PROJETO OU PERFIL

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
  if(tipoUtilizadoresCount == 0){
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
  if(utilizadoresCount == 0 && perfilCount == 0){
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

  //CRIA UMA IDEIA INDEFINIDA COMO BASE
  const ideiaCount = await _Ideia.count();
  let ideia;
  if(ideiaCount == 0){
    ideia = await _Ideia.create({
      id_perfil: perfil.id_perfil,
      titulo_ideia: "Indefinido",
      descricao: "Indefinido",
      estado: "Indefinido",
      ficheiro_complementar: "Indefinido",
      validador: 0,
      comentarios: "Indefinido",
      created_at: new Date(),
      updated_at: new Date() 
    })
  }

  // CRIA UM PROJETO INDEFINIDO COMO BASE. TODOS OS PROJETOS TERÃO IDEIA = 1 SE FOREM CRIADOS SEM UMA IDEIA POR TRÁS
  const projetoCount = await _Projetos.count();
  if(projetoCount == 0){
    await _Projetos.create({
      id_ideia: ideia.id_ideia,
      titulo_projeto: "Indefinido",
      estado: "Indefinido",
      data_atribuicao: new Date(),
      descricao: "Indefinido",
      objetivos: "Indefinido",
      data_inicio: new Date(),
      data_final_prevista: new Date(),
      created_at: new Date(),
      updated_at: new Date() 
    })
  }
}

async function criarTipoFaltas(){
  const tipoFaltasCount = await _Tipo_Faltas.count();
  if(tipoFaltasCount == 0){
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


app.use('/faltas', faltasRoute);
app.use('/ideias', ideiaRoute);
app.use('/ferias', feriasRoute);
app.use('/user', userRoute);
app.use('/calendario', calendarioRoute);
app.use('/despesas', despesasRoute);
app.use('/blog', blogRoute);
app.use('/noticia', noticiaRoute);
app.use('/visita', visitaRoute);
app.use('/candidaturas', candidaturasRoute);
app.use('/departamento', departamentoRoute);
app.use('/empresa', empresaRoute);
app.use('/notificacoes', notificacoesRoute);
app.use('/projeto', projetosRoute);
app.use('/reembolsos', reembolsosRoute);
app.use('/vaga', vagaRoute);
app.use('/userVisitante', userVisitanteRoute);


sequelize.sync({ alter: true })
  .then(() => {
    console.log('Modelos sincronizados com o banco de dados.');
  })
  .catch(err => {
    console.error('Erro ao sincronizar modelos com o banco de dados:', err);
  });


app.listen(app.get('port'), () => {
  console.log("Start server on port " + app.get('port'));
})