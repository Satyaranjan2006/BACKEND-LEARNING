const jwt = require('jsonwebtoken')

async function identifyUser(req,res,next) {
    //getting the token
    const token = req.cookies.token
    //then check whether the  token exist or not
    if (!token) {
        return res.status(401).json({
            message: 'user not found .Unauthorized access'
        })
    }

    let decoded = null;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return res.status(401).json({
            message: error.message
        })
    }
    //request
    req.user=decoded
    //helps to provide the request to next
    next()
}
module.exports = identifyUser