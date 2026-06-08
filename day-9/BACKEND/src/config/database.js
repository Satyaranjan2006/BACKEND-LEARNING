const mongoose=require('mongoose')

function connectToDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('CONNECT TO db')
    })
}

module.exports=connectToDB