const mongoose=require('mongoose')

const noteSchema= new  mongoose.Schema({
    title:String,
    description:String,
})
//most important code
//here all  CRUD operation occurs

const noteModel=mongoose.model('notes',noteSchema)

module.exports=noteModel
