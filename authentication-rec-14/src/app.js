const express=require('express')
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const authRouter=require('./routes/ahth.routes')

const app=express()

app.use(express.json())
app.use(cookieParser)

app.use('/api/auth',authRouter)

module.exports=app