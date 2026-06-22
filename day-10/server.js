require('dotenv').config()

const app=require('./src/app')
const jwt=require('jsonwebtoken')

const connecToDB=require('./src/config/database')

connecToDB()

app.listen(3000,()=>{
console.log('server has been started on port number 3000');

})