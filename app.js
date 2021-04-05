const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const Sequelize = require('sequelize')
const connection = require('./config/database')
const student = require('./models/model')
const courses = require('./models/courses_model')
const user = require('./models/user')
const student_courses = require('./models/student_courses')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { isForOfStatement } = require('typescript')
const jwt = require('jsonwebtoken')
const { response } = require('express')
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express()
const port = 7000

app.use(
    session({
        secret: 'secretkey',
        resave: true,
        saveUninitialized: true
    })
)
app.use(cookieParser("secretcode"))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



app.listen(port, () => console.log('listen on port 7000'))


app.get('/student', (req, re) => {
    student.findAll().then(table => {
        re.json(table)
    })
})
app.get('/student/:id', (req, re) => {
    const id = req.params.id
    student.findOne({where:{
        id:id
    }}).then(table => {
        re.json(table)
    })
})
//styduden/courses
app.get('/', (req, re) => {
    student.findAll({
        include: courses
    }).then(table => {
        re.json(table)
    })
})
app.get('/stdcourse/:id', (req, re) => {
    const id = req.params.id
    student.findByPk(id, {
        include: courses
    }).then(table => {
        re.json(table)
    })
})


app.get('/courses', (req, re) => {
    courses.findAll().then(table => {
        re.json(table)
    })
})
app.get('/coursests', (req, re) => {
    courses.findAll({
        include: student
    }).then(table => {
        re.json(table)
    })
})
app.get('/coursests/:id', (req, re) => {
    const id = req.params.id
    courses.findByPk(id, {
        include: student
    }).then(table => {
        re.json(table)
    })
})

app.post('/student', (req, re) => {
    student.create({
        id: req.body.id,
        s_name: req.body.s_name,
        lastName: req.body.lastName,
        dob: req.body.dob,
    }).then(() => {
        re.send(`${req.body.s_name} added`)

    }).catch((err) => { console.log(err) })
})
app.post('/courses', (req, re) => {
    courses.create({
        id: req.body.id,
        name: req.body.name,
        code: req.body.code
    }).then(() => {
        courses.findAll().then(table => {
            re.json(table)
        })
    })
})
app.post('/users', async(req, re) => {
try{ const username = req.body.username
  const password = req.body.password
 await user.findAll({
      where:{
          username:username,
      }
  }).then(async user=>{
      const x= user[0]._previousDataValues.password
      console.log(x)
      if (user){
    const validpass= await bcrypt.compare(password,x)
    console.log(validpass)
    if (validpass){
        re.send('user is valid')
    }else{
       re.send('wrong password')
    }
}else{
    re.send('no user found')
}})
 


} catch(e){
    console.log(e)
    re.send('some thing broke')
}

}
)
app.post('/user', async (req, re) => {
    const password = await bcrypt.hash(req.body.password, 10)

    await user.create({

        username: req.body.username,
        password: password

    }).then(table => { re.send(table) })


})
app.post('/stdrs', (req, re) => {
    student_courses.create({
        studentId: req.body.studentId,
        courseId: req.body.courseId
    }).then(() => {
        student.findAll({
            include: courses
        }).then(table => {
            re.json(table)
        }).catch((err) => { console.log(err) })
    }).catch((err) => { console.log(err) })
})
app.post('/crst', (req, re) => {
    student_courses.create({
        studentId: req.body.studentId,
        courseId: req.body.courseId
    }).then(() => {
        courses.findAll({
            include: student
        }).then(table => {
            re.json(table)
        })
    })
})
app.delete('/student/:id', (req, re) => {
    student.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        re.send(`${req.params.id} deleted`)
    })
})
app.delete('/course/:id', (req, re) => {
    courses.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        courses.findAll().then(table => {
            re.json(table)
        })
    })
})
app.delete('/stdrs/:sid/:cid', (req, re) => {
    student_courses.destroy({
        where: {
            studentId: req.params.sid,
            courseId: req.params.cid
        }
    }).then(() => {
        student.findAll({
            include: courses
        }).then(table => {
            re.json(table)
        })
    })
})
app.delete('/cstd/:sid/:cid', (req, re) => {
    student_courses.destroy({
        where: {
            studentId: req.params.sid,
            courseId: req.params.cid
        }
    }).then(() => {
        courses.findAll({
            include: student
        }).then(table => {
            re.json(table)
        })
    })
})
app.put('/student/:id', (req, re) => {
    student.update({
        s_name: req.body.s_name,
        lastName: req.body.lastName,
        dob: req.body.dob


    }, {
        where: {
            id: req.params.id
        }
    }).then(() => {
        student.findAll().then(table => {
            re.json(table)
        })
    })
})
app.put('/course/:id', (req, re) => {
    courses.update({
        name: req.body.name,
        code: req.body.code
    }, {
        where: {
            id: req.params.id
        }
    }).then(() => {

        courses.findAll().then(table => {
            re.json(table)
        })
    })
})
app.put('/stdrs/:id', (req, re) => {
    student_courses.update({
        courseId: req.body.courseId
    }, {
        where: {
            studentId: req.params.id
        }
    }).then(sub => re.send('updated'))
})


connection.sync()
