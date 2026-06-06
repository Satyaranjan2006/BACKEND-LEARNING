const express=require('express')

const app=express()

app.use(express.json())

const noteModel=require('./models/notes.model')

const notes=[

]

app.post('/notes',async (req,res)=>{
    const{title,description}=req.body

const note= await noteModel.create({
    title,description
})

res.status(201).json({
    message:'note created successfully',
    note
})
})

//get api that fetch all data
app.get('/notes',async(req,res)=>{
    const notes=await noteModel.find()

    res.status(200).json({
        message:'note fetched succesfully',
        notes
    })
})

module.exports=app