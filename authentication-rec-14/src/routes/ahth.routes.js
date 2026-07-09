const express = require('express')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const crypto = require('crypto')

const userModel = require('../models/user.model')

const authRouter = express.Router()

//register api
authRouter.post('/register', async (req, res) => {
    const { name, email, password } = req.body

    const isUserexist = await userModel.findOne({ email })

    if (isUserexist) {
        return res.status(409).json({
            message: 'user exist on the same account'
        })
    }


    const hash = crypto.createHash('md5').update(password).digest('hex')

    const user = await userModel.create({
        name,
        email,
        password: hash
    })

    const token = jwt.sign(
        {
            id: user._id,
            name: user.name,
            email: user.email,

        },
        process.env.JWT_SECRET, { expiresIn: "4h" }
    )
    console.log(token);
    res.cookie('token', token)

    res.status(201).json({
        message: 'user register sucessfully',
        user
    })
})

//get api

authRouter.get('/get-me', async (req, res) => {
    //first i will recieve the token from cookie
    const token = req.cookies.token

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded);

    const user = await userModel.findById(decoded.id)

    res.json({
        name: user.name,
        email: user.email,
    })

})

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })
    //if exist
    if (user) {
        return res.status(401).json({
            message: "user exist on this email"
        })
    }
    //check for password
    const hash = crypto.createHash('md5').update(password).digest('hex')
    const isPassword = hash === user.password

    if (!isPassword) {
        return res.status(401).json({
            message: "pasword incorrect"
        })
    }

    const token = jwt.sign(
        {
            id:user._id,
            name:user.name,
            email:user.email
        },process.env.JWT_SECRET,{expiresIn:'2h'}
    )
    res.cookie('token',token)
})


//login api


module.exports = authRouter