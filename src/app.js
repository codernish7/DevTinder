const express = require ('express')

const app = express()

const {userAuth,hrAuth}= require('./utils/middleware')

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

app.listen(5000,()=>{
    console.log('server is listening')
})