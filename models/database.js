const { Sequelize }= require('sequelize');

/*const sequelize = new Sequelize(
  'mhrs',
  'mhrsweb',
  'E3%f9+8yLv_3',
  {
    host: '207.180.232.121',
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