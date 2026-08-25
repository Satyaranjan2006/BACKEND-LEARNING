const express = require('express')
const authController=require('../controllers/auth.controller')

const authRouter = express.Router()

//POST  /api/auth/register
authRouter.post('/register',authController.registerController)
//Login api
//  /api/auth/login
authRouter.post('/login',authController.loginControl )

module.exports = authRouter