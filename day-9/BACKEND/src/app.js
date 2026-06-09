const express=require('express')
const noteModel=require('./models/note.model')
const cors=require('cors')
const path=require('path')



const app=express()
app.use(express.json())
app.use(cors())

app.use(express.static('./public'))

/*

post /api/notes
Create  new note and save data in mongodb
*/
app.post('/notes',async(req,res)=>{
    //destructur
    const{title,description}=req.body
    
    //storing in database
    const note=await noteModel.create({
        title,description
    })
    res.status(201).json({
        message:'note created successfully',
        note
    })
})

app.get('/notes',async(req,res)=>{
    const notes=await noteModel.find()

    res.status(200).json({
        message:'note fetched successfully',
        notes
    })

})

/**
 * delet the note via id 
 */
app.delete('/notes/:id',async(req,res)=>{
    const id=req.params.id

    const notes=await noteModel.findByIdAndDelete(id)

    res.status(200).json({
        message:'note deleted successfully',
        notes
    })
})

/*
update the note via id

*/
app.patch('/notes/:id',async(req,res)=>{
    const id=req.params.id
    const{title,description}=req.body

    const notes=await noteModel.findByIdAndUpdate(id,{title,description})

    res.status(200).json({
        message:'note updated successfully',
        notes
    })
})

//handling wildcart concept

app.use('*name',(req,res)=>{
    res.sendFile(path.join(__dirname,'..', '/public/index.html'))
})

module.exports=app