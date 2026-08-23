const ImageKit=require('@imagekit/nodejs')
const {toFile}=require('@imagekit/nodejs')
const postModel=require('../models/post.model.js')
const jwt=require('jsonwebtoken')
const likeModel = require('../models/like.model.js')

const imagekit=new ImageKit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY
})

async function createPostController(req,res){

   const file=await imagekit.files.upload({
      file:await toFile(Buffer.from(req.file.buffer),'file'),
      fileName:"Test",
      folder:'cohort-2-insta-clone-posts'
   })

   //NOW WE WILL CREATE A POST
   const post=await postModel.create({
      caption:req.body.caption,
      imgUrl:file.url,
      user:req.user.id
   })

   res.status(201).json({
      message:'Post created successfully.',
      post
   })
   // res.send(file)
 
}

async function getPostController(req,res){
   

   //then getting the id
   const userId=req.user.id

   const posts=await postModel.find({
      user:userId
   })

   res.status(200).json({
      message:'Posts fetched successfully',
      posts
   })
}

async function getPostDetailsController(req,res){
   
   const userId=req.user.id;
   const postId=req.params.postId

   if(!postId){
      return res.status(403).json({
         messaged:'user not allowed to perform this action ! Forbidden'
      })
   }
   const post=await postModel.findById(postId)

   if(!post){
      return res.status(403).json({
         message:'forbidden'
      })
   }
   //matching userid with the post userId that is provided by the user while creating the post
   const isValidId=post.user.toString()===userId

   if(!isValidId){
      return res.status(403).json({
         message:'post is not authenticated'
      })
   }
     //lastly returning the success message
   return res.status(200).json({
      message:'post fetched sucessfully'
   })

}


async function likePostController(req,res){
   const username=req.user.username;
   const postId=req.params.postId



   const Post=await postModel.findById(postId)

   if(!Post){
      return res.status(400).json({
         message:'post does not exist'
      })
   }


   const like=await likeModel.create({
      user:username,
      post:postId
   })

   res.status(201).json({
      message:'post liked successfully',
      like
   })


}




module.exports={
    createPostController,getPostController,getPostDetailsController,likePostController
}