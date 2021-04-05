const bcrypt = require('bcryptjs')
const localStrategy = require('passport-local').Strategy
const { where } = require('sequelize')

module.exports = function(passport,getUser,getId) {
    passport.use(
        new localStrategy((username,password,done)=>{
            const user =getUser(usetname)
            user.findOne({username:username},(err,user)=>{
                if (err) throw err
                if (!user) return done(null,false)
               bcrypt.compare(password,user.password,(err,result)=>{
                    if (err) throw err
                    if (result==true){
                        return done(null,user)
                   
                    } else{
                        return done(null,false)
                    }
                })
            })
        })
    )
    passport.serializeUser((user,cb)=>{
        cb(null,user.id)
    })
    passport.deserializeUser((id,cb)=>{

            cb(err,getId(id))

    })
}