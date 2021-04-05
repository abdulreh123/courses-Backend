const Sequelize = require('sequelize')
const connection= require('../config/database')

module.exports = connection.define('user',{
    id:{
        type:Sequelize.STRING(25),
        primaryKey: true
    },
    username:{
        type:Sequelize.STRING(25)
    },
    password:{
        type:Sequelize.STRING(25)
    }
    
},{
    timestamps:false
})
