const express = require ('express')

const app = express()

const connectionDb = require('./configuration/connection')

const {userAuth,hrAuth}= require('./utils/middleware')

connectionDb().then(()=>{
    console.log('connected to database')
    app.listen(5000,()=>{
    console.log('server is listening')
})
}).catch((err)=>{
    console.log(err)
})

app.use('/user',userAuth)

app.get('/user/admin',(req,res)=>{
    res.send('admin 3')
})

app.get('/user/adminDelete',(req,res)=>{
    res.send('admin deleted')
})

app.get('/user/adminRegister',(req,res)=>{
    res.send('admin registered')
})

app.get('/hr/profile',hrAuth, (req, res)=>{
    res.send('profile for hr1')
})

