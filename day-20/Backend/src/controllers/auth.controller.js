

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const blackListModel=require('../models/blacklist.model.js')
const redis=require('../config/cache.js')

async function registerUser(req, res) {
    //getting the username,email,password

    const { username, email, password } = req.body;

    const isuserAlreadyExist = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })
    //if the uppeline is true

    if (isuserAlreadyExist) {
        return res.status(400).json({
            message: 'user already exist'
        })
    }

    const hash=await bcrypt.hash(password,10)

    const user=await userModel.create({
        username,
        email,
        password:hash
    })

    const token=jwt.sign({
        id:user._id,
        username:user.username
    },process.env.JWT_SECRET,{expiresIn:'3d'})

    res.cookie('token',token)

    return res.status(201).json({
        message:'user registered sycessfully',
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

async function loginUser(req,res){
    const{username,email,password}=req.body

    const user=await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    }).select('+password')

    //if user not exist

    if(!user){
        return res.status(400).json({
            message:'Invalid credential'
        })
    }

    const isPasswordValid=await bcrypt.compare(password,user.password)
    
    if(!isPasswordValid){
        return res.status(400).json({
            message:'Invalid Credential'
        })
    }
    //otherwise

    const token=jwt.sign({
        id:user._id,
        username:user.username
    },process.env.JWT_SECRET,{expiresIn:'3d'})

    res.cookie('token',token)

    return res.status(200).json({
        message:'userlogin sucessfully',
        user:{
            username:user.username,
            email:user.email,
            id:user._id
        }

    })
}

async function getMe(req,res){
    const userId=req.user.id

    //then  find the user based on the userid

    const user=await userModel.findById(userId)

    return res.status(200).json({
        message:'User fetched sucessfully',
        user
    })
}
async function logoutUser(req,res){
    const token=req.cookies.token

    res.clearCookie('token')

    // await blackListModel.create({
    //     token
    // })
    await redis.set(token,Date.now().toString())

    res.status(201).json({
        message:'log out sucessfully'
    })
}


module.exports = {registerUser,loginUser,getMe,logoutUser}