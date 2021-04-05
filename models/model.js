const Sequelize = require('sequelize')
const connection= require('../config/database')

module.exports = connection.define('student',{
    id:{
        type:Sequelize.STRING(60),
        primaryKey: true
    },
    s_name:{
        type:Sequelize.STRING(23)
    },
    lastName:{
        type:Sequelize.STRING(25)
    },
    dob:{
        type:Sequelize.DATE
    },
    registeration:{
        type:Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },

},{
    timestamps:false
})

