const express = require ('express')

const app = express()


app.use('/',(req,res)=>{
    res.send('Hi from listening port 5000 home route')
})
app.use('/test',(req,res)=>{
    res.send('Hi from test route')
})
app.use('/hello',(req,res)=>{
    res.send('Hi from hello route')
})

app.listen(5000,()=>{
    console.log('server is listening')
})