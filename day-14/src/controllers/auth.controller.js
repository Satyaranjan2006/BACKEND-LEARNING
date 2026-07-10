const userModel = require('../models/user.model')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')


//register
async function registerController(req, res)  {
    //using destructure
    console.log("Register API hit");
    const { username, email, password, bio, profileImage } = req.body

    //check the existance of email and password

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyExists) {
        return res.status(409).json({
            massage: 'user already exist' + (isUserAlreadyExists.email == email ? 'Email already exist' : 'username already exist')
        })
    }

    const hash = crypto.createHash('sha256').update(password).digest('hex')

    const user = await userModel.create({
        username, email, bio, profileImage, password: hash
    })

    //creating token

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
            username: user.username
        }, process.env.JWT_SECRET, { expiresIn: "1d" }
    )
    res.cookie('token', token)

    res.status(201).json({
        //we do not  send password in to client.while providing success message
        message: 'user register sucessfully',
        user: {
            email: user.email,
            username: user.username,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })
}

//LOGIN
async function loginControl(req, res) {
    console.log('login api hit');
    const { username, email, password } = req.body

    /*
    user may login via

        username,
        password

         or 
         
         email,
         password
    */

    const user = await userModel.findOne({
        $or: [
            {
                username: username
            },
            {
                email: email
            }
        ]
    })

    if (!user) {
        return res.status(404).json({
            message: 'Invalid User'
        })
    }

    //convert password to hash
    const hash = crypto.createHash('sha256').update(password).digest('hex')
    // password checking
    const isPasswordValid = hash === user.password

   if(!isPasswordValid){
    return res.status(404).json({
        message:'Invalid password'
    })
   }

   const token=jwt.sign(
    {
        id: user._id,

    },process.env.JWT_SECRET,{expiresIn:"1d"})

    res.cookie('token',token)

    res.status(200).json({
        message:'user loggedin successfully',
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImage:user.profileImage
        }
    })
}

module.exports={
    loginControl,
    registerController
}