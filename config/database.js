const Sequelize = require('sequelize')

    
module.exports = new Sequelize('seq_std', 'root', 'root', {
    host: 'localhost',
    dialect:'mysql'
  });