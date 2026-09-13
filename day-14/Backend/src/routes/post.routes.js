const express = require('express')

const postRouter = express.Router()

const postController = require('../controllers/post.controller')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

const identifyUser = require('../middlewares/auth.middleware')
/*
POST  /api/posts [protected]
 - req.body ={caption,image_file}
*/

//  /api/post/
postRouter.post('/', identifyUser, upload.single('image'), postController.createPostController)
/**
 * GET /api/post/  [protected]
 */
postRouter.get('/',
    identifyUser, postController.getPostController)

/**
 * GET /api/post/details/:postid
 *  -- return   the details about specific popst with the id. also check whether the post belongs to the user that the request comes from
 */
postRouter.get('/details/:postId', identifyUser, postController.getPostDetailsController)

/**
 * @routes POST /api/post/like/:postid
 * @description like a post with the id provided in the request params
 */
postRouter.post('/likes/:postid', identifyUser,postController.likePostController)

/**
 * @route GET/api/post/feed
 *@description  get all the post created in DB
   * @access private
 */

 postRouter.get('/feed',identifyUser,postController.getFeedController)


module.exports = postRouter