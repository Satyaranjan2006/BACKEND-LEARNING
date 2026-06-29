const express=require('express')
const userModel=require('../models/user.model')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')
//used for cookie
// const cookieParser=require('cookie-parser')

const authRouter=express.Router()

authRouter.post('/register',async(req,res)=>{
    const{name,email,password}=req.body

    //for providing the valid message response
    const isUserAlreadyExists=await userModel.findOne({email})

    //now checking the condition
    if(isUserAlreadyExists){
        return res.status(409).json({
            message:'User already exist in the perticulat email  Address'
        })
    }
//line convert the password tohhash
    const hash=crypto.createHash('md5').update(password).digest('hex')


  const user=  await userModel.create({
        name,email,password:hash
    })

    const token=jwt.sign(
        {
            id:user._id,
            email:user.email

         },
    process.env.JWT_SECRET
)
   //cookie
   res.cookie("jwt_token",token)

    
    res.status(200).json({
        message:'user registered',
        user,
        token
    })
})

authRouter.post('/login',async(req,res)=>{
    const{email,password}=req.body
    //check the email for the user
    const isEmailExist=userModel.findOne({email})

    if(!isEmailExist){
        return res.status(404).json({
            message:"user email does not exist"
        })
    }
    //checking password requirment
    const isPasswordMatched=user.password===crypto.createHash('md5').update(password).digest('hex')

    if(!isPasswordMatched){
        return res.status(401).json({
            message:"invalid password"
        })
    }
    const token=jwt.sign({
        id:user._id
    },
    process.env.JWT_SECRET)

    res.cookie('jwt_token',token)

    res.status(201).json({
        message:'user logedIn sucessfully',
        user
    })
})

module.exports=authRouter