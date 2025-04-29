const { Sequelize }= require('sequelize');

/*const sequelize = new Sequelize(
  'mhrs_db',
  'mhrs',
  'mhrspwd',
  {
    host: '158.220.95.219',
    dialect: 'postgres',
    port: 5432,
  }
);*/

const sequelize = new Sequelize(
  'MHR',
  'postgres',
  'postgres',
  {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
  }
);

module.exports = sequelize;
