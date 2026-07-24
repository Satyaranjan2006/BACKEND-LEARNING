const express=require('express')

const postRouter=express.Router()

const postController=require('../controllers/post.controller')
const multer=require('multer')
const upload=multer({storage:multer.memoryStorage()})
/*
POST  /api/posts [protected]
 - req.body ={caption,image_file}
*/

 //  /api/post/
postRouter.post('/',upload.single('image') ,postController.createPostController)
/**
 * GET /api/post/  [protected]
 */
postRouter.get('/',postController.getPostController)

/**
 * GET /api/post/details/:postid
 *  -- return   the details about specific popst with the id. also check whether the post belongs to the user that the request comes from
 */
postRouter.get('/details/:postId',postController.getPostDetailsController)


module.exports=postRouter