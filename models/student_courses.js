const Sequelize = require('sequelize')
const connection= require('../config/database')
const courses=require('./courses_model')
const students=require('./model')

module.exports = connection.define('student_courses', {}, { timestamps: false });
students.belongsToMany(courses, { through: 'student_courses' });
courses.belongsToMany(students, { through: 'student_courses' });
