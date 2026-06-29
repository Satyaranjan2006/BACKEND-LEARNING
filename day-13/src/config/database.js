const mongoose=require('mongoose')

function connecToDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('coonect to DB')
    })
}

module.exports=connecToDB