const ImageKit=require('@imagekit/nodejs')
const {toFile}=require('@imagekit/nodejs')
const postModel=require('../models/post.model')
const jwt=require('jsonwebtoken')

const imagekit=new ImageKit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY
})

async function createPostController(req,res){
   console.log(req.body,req.file);
 
    const token=req.cookies.token

    if(!token){
      return res.status(401).json({
         message:'Token not provided, Unauthorized access'
      })
    }
    let decoded=null

    try {
       decoded=jwt.verify(token,process.env.JWT_SECRET)
    } catch (error) {
      //401:-unauthorized.
      return res.status(401).json({
         message:'user is Unauthorized'
      })
    }
   
    
    

   const file=await imagekit.files.upload({
      file:await toFile(Buffer.from(req.file.buffer),'file'),
      fileName:"Test",
      folder:'cohort-2-insta-clone-posts'
   })

   //NOW WE WILL CREATE A POST
   const post=await postModel.create({
      caption:req.body.caption,
      imgUrl:file.url,
      user:decoded.id
   })

   res.status(201).json({
      message:'Post created successfully.',
      post
   })
   // res.send(file)
 
}

async function getPostController(req,res){
   //getting the token
   const token=req.cookies.token
   //then check whether the  token exist or not
   if(!token){
      return res.status(401).json({
         message:'user not found .Unauthorized access'
      })
   }

   let decoded=null;

   try {
      decoded=jwt.verify(token,process.env.JWT_SECRET)
   } catch (error) {
      return res.status(401).json({
         message:error.message
      })
   }

   //then getting the id
   const userId=decoded.id

   const posts=await postModel.find({
      user:userId
   })

   res.status(200).json({
      message:'Posts fetched successfully',
      posts
   })
}

async function getPostDetailsController(req,res){
   const token=req.cookies.token

   if(!token){
      return res.status(401).json({
         message:'user not authorized'
      })
   }
   //then getting the id from verify status
   let decoded=null;

   try {
      decoded=jwt.verify(token,process.env.JWT_SECRET)
   } catch (error) {
      message:error.message
   }
   const userId=decoded.id;
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




module.exports={
    createPostController,getPostController,getPostDetailsController
}