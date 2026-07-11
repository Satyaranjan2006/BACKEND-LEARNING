const ImageKit=require('@imagekit/nodejs')
const {toFile}=require('@imagekit/nodejs')

const imagekit=new ImageKit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY
})

async function createPostController(req,res){
   console.log(req.body,req.file);
  //exception case regarding file upload and selecting imagekit rivate key
   if(!req.file || !req.file.buffer){
      return res.status(400).json({
         success:false,
         message:'Please upload an image file using the image field.'
      })
   }

   if(!process.env.IMAGEKIT_PRIVATE_KEY){
      return res.status(500).json({
         success:false,
         message:'Image upload service is not configured on the server.'
      })
   }
   //this end of exception

   try {
      const file=await Promise.race([
         imagekit.files.upload({
            file:await toFile(Buffer.from(req.file.buffer), req.file.originalname || 'post-image'),
            fileName:req.file.originalname || 'post-image'
         }),
         new Promise((_,reject)=>setTimeout(()=>reject(new Error('Image upload timed out')),10000))
      ])

      return res.status(201).json({
         success:true,
         message:'Post image uploaded successfully.',
         data:file
      })
   } catch (error) {
      console.error('Image upload failed:', error)

      return res.status(500).json({
         success:false,
         message:error.message || 'Image upload failed.'
      })
   }
}

module.exports={
    createPostController
}