const express = require('express')
const userController = require('../controllers/user.controller.js')
const identifyUser = require('../middlewares/auth.middleware.js')



const userRouter = express.Router()


/**
 * @routes POST /api/users/follow/:username
 * @description Follow a user
 * @access  will private
 */
userRouter.post('/follow/:username', identifyUser,userController.followUserController)



/**
 * @routes POST /api/users/unfollow/:username
 * @description Follow a user
 * @access  will private
 */
userRouter.post('/unfollow/:username', identifyUser,userController.unfollowUserController)




module.exports = userRouter