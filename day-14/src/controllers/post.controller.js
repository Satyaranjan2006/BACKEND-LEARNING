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
  //exception case regarding file upload and selecting imagekit rivate key
   // if(!req.file || !req.file.buffer){
   //    return res.status(400).json({
   //       success:false,
   //       message:'Please upload an image file using the image field.'
   //    })
   // }

   // if(!process.env.IMAGEKIT_PRIVATE_KEY){
   //    return res.status(500).json({
   //       success:false,
   //       message:'Image upload service is not configured on the server.'
   //    })
   // }
   // //this end of exception

   // try {
   //    const file=await Promise.race([
   //       imagekit.files.upload({
   //          file:await toFile(Buffer.from(req.file.buffer), req.file.originalname || 'post-image'),
   //          fileName:req.file.originalname || 'post-image'
   //       }),
   //       new Promise((_,reject)=>setTimeout(()=>reject(new Error('Image upload timed out')),10000))
   //    ])

   //    return res.status(201).json({
   //       success:true,
   //       message:'Post image uploaded successfully.',
   //       data:file
   //    })
   // } catch (error) {
   //    console.error('Image upload failed:', error)

   //    return res.status(500).json({
   //       success:false,
   //       message:error.message || 'Image upload failed.'
   //    })
   // }
}

module.exports={
    createPostController
}