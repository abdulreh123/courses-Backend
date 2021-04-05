const Sequelize = require('sequelize')
const connection= require('../config/database')

module.exports = connection.define('courses',{
    id:{
        type:Sequelize.STRING(60),
        primaryKey: true
    },
    name:{
        type:Sequelize.STRING(25)
    },
    code:{
        type:Sequelize.STRING(25)
    }
    
},{
    timestamps:false
})

