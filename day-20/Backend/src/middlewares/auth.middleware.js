
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model');
const blackListModel = require('../models/blacklist.model');

async function authUser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: 'Token not provided'
        })
    }

    //tohandle blacklisted token use ,so here we usethe concept of check where the token will be checked in blacklisted model.

    const isTokenBlackListed=await blackListModel.findOne({
        token
    })

    if(isTokenBlackListed){
        return res.status(401).json({
            message:'Invalid token'
        })
    }



    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid token'
        })
    }
}


module.exports = { authUser }