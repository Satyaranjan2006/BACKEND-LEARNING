const mongoose=require('mongoose')

function connectToDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('conncted to DB')
    })
}

module.exports=connectToDB