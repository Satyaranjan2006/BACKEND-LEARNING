const express = require('express')
const authController=require('../controllers/auth.controller')
const identifyUser=require('../middlewares/auth.middleware')

const authRouter = express.Router()

//POST  /api/auth/register
authRouter.post('/register',authController.registerController)
//Login api
//  /api/auth/login
authRouter.post('/login',authController.loginControl )

authRouter.get('/get-me', identifyUser,authController.getMeController)

module.exports = authRouter