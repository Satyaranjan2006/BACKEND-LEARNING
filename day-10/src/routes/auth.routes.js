const express=require('express')
const userModel=require('../models/user.model')
const jwt=require('jsonwebtoken')
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

  const user=  await userModel.create({
        name,email,password
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
module.exports=authRouter