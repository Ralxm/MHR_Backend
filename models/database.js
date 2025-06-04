const { Sequelize }= require('sequelize');

const sequelize = new Sequelize(
  'mhr',
  'mhr',
  'hMiY0tKO3SJWW2k5vSZ1mGDngZcN0Yu6',
  {
    host: 'dpg-d102sammcj7s7385buf0-a.frankfurt-postgres.render.com/mhr',
    dialect: 'postgres',
    port: 5432,
  }
);

/*const sequelize = new Sequelize(
  'MHR',
  'postgres',
  'postgres',
  {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
  }
);*/

module.exports = sequelize;
